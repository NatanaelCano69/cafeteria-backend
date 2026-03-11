const { pool } = require('../config');

class ReportesController {
    static async obtenerReporte(req, res) {
        try {
            const [rowsTotales] = await pool().query(
                'SELECT COUNT(*) as total_usuarios, IFNULL(SUM(deuda_total),0) as deuda_total FROM usuarios WHERE activo = 1'
            );
            const totales = Array.isArray(rowsTotales) && rowsTotales.length ? rowsTotales[0] : { total_usuarios: 0, deuda_total: 0 };

            // Some databases may not have a `created_at` column; select only stable fields
            const [ultimosRows] = await pool().query(
                'SELECT c.id as folio, u.nombre as usuario, c.monto FROM consumos c JOIN usuarios u ON u.id = c.usuario_id ORDER BY c.id DESC LIMIT 10'
            );
            const ultimos = Array.isArray(ultimosRows) ? ultimosRows : [];

            const [[{ total_consumos }]] = await pool().query('SELECT COUNT(*) as total_consumos FROM consumos');

            res.json({
                total_consumos,
                total_deuda: totales.deuda_total,
                detalles: { totales, ultimos }
            });
        } catch (error) {
            console.error(error.stack || error);
            res.status(500).json({ error: 'Error al obtener reporte', details: error.message });
        }
    }
}

module.exports = { ReportesController };
