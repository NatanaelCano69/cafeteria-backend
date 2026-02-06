const router = require('express').Router();
const ConsumoRouter = require('./consumo.routes');

router.use('/consumo', ConsumoRouter);

module.exports = router;
