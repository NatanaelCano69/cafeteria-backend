const path = require('path');
const result = require('dotenv').config({path: path.join(__dirname, '.env')});

console.log('dotenv result:', result);
console.log('');
console.log('Env vars loaded:');
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD || '[empty]');
console.log('DB_NAME:', process.env.DB_NAME);
console.log('');
console.log('Full .env file location:', path.join(__dirname, '.env'));
