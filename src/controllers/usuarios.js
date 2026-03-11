const { pool } = require('../config');

class UsuariosController {
    static async obtenerUsuarios(req, res) {
        try {
            const [rows] = await pool().query(
                `SELECT u.id, u.nombre, u.codigo_barra, u.deuda_total, 
                (SELECT COUNT(*) FROM consumos c WHERE c.usuario_id = u.id) as total_consumos 
                FROM usuarios u WHERE u.activo = 1`
            );
            res.json(rows);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al obtener usuarios' });
        }
    }

    static async crearUsuario(req, res) {
        const { nombre, codigo_barra } = req.body;
        if (!nombre || !codigo_barra) return res.status(400).json({ error: 'Faltan datos' });

        try {
            const [result] = await pool().query(
                'INSERT INTO usuarios (nombre, codigo_barra, activo, deuda_total) VALUES (?, ?, 1, 0)',
                [nombre, codigo_barra]
            );

            const [rows] = await pool().query('SELECT id, nombre, codigo_barra, deuda_total FROM usuarios WHERE id = ?', [result.insertId]);
            res.status(201).json(rows[0]);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al crear usuario' });
        }
    }
}

module.exports = { UsuariosController };
