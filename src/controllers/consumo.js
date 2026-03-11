const connection = require('../config');
const { pool } = require("../config");


class ConsumoController {

    static async registrarConsumo(req, res) {
        console.log('[Backend] registrarConsumo request body:', req.body);
        const { codigo } = req.body;
        const PRECIO_FIJO = 50
        if (!codigo) {
            return res.status(400).json({ error: 'Código requerido' });
        }

        try {
            // Convert codigo to number to match database INT type
            const codigoNum = parseInt(codigo, 10);
            if (isNaN(codigoNum)) {
                return res.status(400).json({ error: 'Código inválido' });
            }

            // Buscar usuario
            let [usuarios] = await pool().query(
                'SELECT * FROM usuarios WHERE codigo_barra = ? AND activo = 1',
                [codigoNum]
            );

            if (usuarios.length === 0) {
                await pool().rollback();
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }

            let usuario = usuarios[0];

            // Registrar consumo
            await pool().query(
                'INSERT INTO consumos (usuario_id, monto) VALUES (?, ?)',
                [usuario.id, PRECIO_FIJO]
            );

            // Actualizar deuda
            await pool().query(
                'UPDATE usuarios SET deuda_total = deuda_total + ? WHERE id = ?',
                [PRECIO_FIJO, usuario.id]
            );

            [usuarios] = await pool().query(
                'SELECT * FROM usuarios WHERE codigo_barra = ? AND activo = 1',
                [codigoNum]
            );

            usuario = usuarios[0];

            res.json({
                usuario: usuario.nombre,
                monto: PRECIO_FIJO,
                deuda_total: parseFloat(usuario.deuda_total),
                mensaje: 'Consumo registrado correctamente'
            });

            console.log('[Consumo] Emitiendo evento Socket.IO...');
            // broadcast to Socket.IO clients
            try {
                const io = require('../socket').getIo();
                io.emit('consumo', {
                    type: 'consumo',
                    data: {
                        usuario: usuario.nombre,
                        monto: PRECIO_FIJO,
                        deuda_total: parseFloat(usuario.deuda_total),
                        usuario_id: usuario.id
                    }
                });
                console.log('[Consumo] Evento Socket.IO emitido exitosamente');
            } catch (e) {
                console.error('[Consumo] Socket.IO send error', e);
            }

        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al registrar consumo' });
        }

    };

    static async obtenerConsumoPorClienteId(req, res) {
        const usuarioId = req.query.usuario;

        if (!usuarioId) {
            return res.status(400).json({ error: 'Usuario requerido' });
        }
        try {

            let [usuarios] = await pool().query('SELECT * FROM usuarios WHERE id = ?', [usuarioId]);

            if (usuarios.length === 0) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }

            const usuario = usuarios[0];

            const [consumos] = await pool().query(
                'SELECT * FROM consumos WHERE usuario_id = ?',
                [usuario.id]
            );

            res.json({
                usuario: usuario.nombre,
                historial: consumos.map(c => ({
                    folio: c.id,
                    monto: c.monto,
                    fecha: c.fecha_hora
                }))
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al obtener consumos' });
        }
    }

    static async obtenerUltimosConsumos(req, res) {
        try {
            const [consumos] = await pool().query(
                'SELECT c.id, c.monto, u.nombre as usuario, u.deuda_total FROM consumos c ' +
                'JOIN usuarios u ON c.usuario_id = u.id ' +
                'ORDER BY c.id DESC LIMIT 10'
            );
            res.json(consumos);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al obtener ultimos consumos' });
        }
    }
}

module.exports = { ConsumoController }