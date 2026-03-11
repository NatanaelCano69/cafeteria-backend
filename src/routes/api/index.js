const router = require('express').Router();
const ConsumoRouter = require('./consumo.routes');
const UsuariosRouter = require('./usuarios.routes');
const ReportesRouter = require('./reportes.routes');

router.use('/consumo', ConsumoRouter);
router.use('/usuarios', UsuariosRouter);
router.use('/reportes', ReportesRouter);

module.exports = router;
