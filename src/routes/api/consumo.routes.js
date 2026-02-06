const {ConsumoController} = require("../../controllers");
const router = require('express').Router();

const PRECIO_FIJO = parseFloat(process.env.PRECIO_FIJO);

router.route('/').post(ConsumoController.registrarConsumo);

module.exports = router ;