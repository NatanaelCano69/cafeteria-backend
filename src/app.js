const express = require('express');
const cors = require('cors');
require('dotenv').config();

const consumoRoutes = require('./routes/consumo.routes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', consumoRoutes);

module.exports = app;