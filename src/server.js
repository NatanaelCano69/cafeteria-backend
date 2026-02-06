require('dotenv').config({path: '../.env'});

const express = require('express');
const routes = require('./routes');
const {pool} = require('./config')
const app = express();
const PORT = process.env.PORT || 3001;
const mysql = require('mysql2');

console.log('db cred: ', {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
})

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(routes);
app.listen(PORT, async () => {
    console.log(`App listening on port ${PORT}!`);

    const [name] = await pool().query('SELECT nombre from usuarios where id = 1')
    console.log(name)
});