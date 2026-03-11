require('dotenv').config({path: ['./.env']});

const express = require('express');
const routes = require('./routes');
const { pool } = require('./config')
const app = express();
const PORT = process.env.PORT || 3001;
const mysql = require('mysql2');

console.log("ENV DEBUG:");
console.log(process.env);

console.log('db cred: ', {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
})

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS for development: allow requests from Angular dev server
app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (origin) {
        res.header('Access-Control-Allow-Origin', origin);
    } else {
        res.header('Access-Control-Allow-Origin', '*');
    }
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    if (req.method === 'OPTIONS') return res.sendStatus(200);
    next();
});

const socket = require('./socket');
const http = require('http');
const server = http.createServer(app);

app.use(routes);

const io = socket.init(server);

io.on('connection', socket => {
    console.log('Client connected');
});

server.listen(PORT, async () => {
    console.log(`App listening on port ${PORT}!`);

    const [name] = await pool().query('SELECT nombre from usuarios where id = 1')
    console.log(name)
});