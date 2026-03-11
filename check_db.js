const { pool } = require('./src/config');
require('dotenv').config({ path: './src/.env' });

async function checkData() {
    try {
        const [consumos] = await pool().query('SELECT * FROM consumos LIMIT 1');
        console.log('Sample consumo row:', JSON.stringify(consumos[0], null, 2));

        const [count] = await pool().query('SELECT COUNT(*) as total FROM consumos');
        console.log('Total consumos:', count[0].total);

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkData();
