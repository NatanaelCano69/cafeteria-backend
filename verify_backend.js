const { ReportesController } = require('./src/controllers/reportes');
const { ConsumoController } = require('./src/controllers/consumo');
require('dotenv').config({ path: './src/.env' });

async function verify() {
    console.log('--- Verifying ReportesController.obtenerReporte ---');
    const mockResReporte = {
        json: (data) => console.log('Reporte response:', JSON.stringify(data, null, 2)),
        status: (code) => ({ json: (err) => console.error('Status', code, err) })
    };
    await ReportesController.obtenerReporte({}, mockResReporte);

    console.log('\n--- Verifying ConsumoController.obtenerConsumoPorClienteId ---');
    // Assuming user ID 1 exists
    const mockReqConsumo = { query: { usuario: 1 } };
    const mockResConsumo = {
        json: (data) => console.log('Consumo response:', JSON.stringify(data, null, 2)),
        status: (code) => ({ json: (err) => console.error('Status', code, err) })
    };
    await ConsumoController.obtenerConsumoPorClienteId(mockReqConsumo, mockResConsumo);

    process.exit(0);
}

verify().catch(err => {
    console.error(err);
    process.exit(1);
});
