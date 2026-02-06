const connection = require('../config');
const {pool} = require("../config");

class ConsumoController {

    static async registrarConsumo(req, res) {
        const {codigo} = req.body;
        const PRECIO_FIJO = 50
        if (!codigo) {
            return res.status(400).json({error: 'Código requerido'});
        }

        try {
            // Buscar usuario
            let [usuarios] = await pool().query(
                'SELECT * FROM usuarios WHERE codigo_barra = ? AND activo = 1',
                [codigo]
            );

            if (usuarios.length === 0) {
                await pool().rollback();
                return res.status(404).json({error: 'Usuario no encontrado'});
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
                [codigo]
            );

            usuario = usuarios[0];

            res.json({
                usuario: usuario.nombre,
                monto: PRECIO_FIJO,
                deuda_total: parseFloat(usuario.deuda_total),
                mensaje: 'Consumo registrado correctamente'
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({error: 'Error al registrar consumo'});
        }

    };

    static async obtenerConsumoPorClienteId(req, res) {
        const usuarioId = req.query.usuario;

        if (!usuarioId) {
            return res.status(400).json({error: 'Usuario requerido'});
        }
        try {

            let [usuarios] = await pool().query('SELECT * FROM usuarios WHERE id = ?', [usuarioId]);

            if (usuarios.length === 0) {
                return res.status(404).json({error: 'Usuario no encontrado'});
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
                    monto: c.monto
                }))
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({error: 'Error al obtener consumos'});
        }
    }
}

module.exports = {ConsumoController}