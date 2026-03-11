const { ReportesController } = require('../../controllers');
const router = require('express').Router();

router.get('', ReportesController.obtenerReporte);

module.exports = router;
