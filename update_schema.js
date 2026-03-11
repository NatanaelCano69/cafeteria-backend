const mysql = require('mysql2');
require('dotenv').config({ path: './src/.env' });

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

connection.connect();

async function updateSchema() {
    connection.query('DESCRIBE consumos', (err, results) => {
        if (err) {
            console.error('Error describing table:', err);
            process.exit(1);
        }

        const hasFecha = results.find(col => col.Field === 'fecha');
        if (!hasFecha) {
            console.log('Adding "fecha" column to "consumos" table...');
            connection.query('ALTER TABLE consumos ADD COLUMN fecha DATETIME DEFAULT CURRENT_TIMESTAMP', (err) => {
                if (err) {
                    console.error('Error adding column:', err);
                    process.exit(1);
                }
                console.log('Column "fecha" added successfully.');
                process.exit(0);
            });
        } else {
            console.log('Column "fecha" already exists.');
            process.exit(0);
        }
    });
}

updateSchema();
