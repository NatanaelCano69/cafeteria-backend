const { UsuariosController } = require('../../controllers');
const router = require('express').Router();

router.route('')
    .get(UsuariosController.obtenerUsuarios)
    .post(UsuariosController.crearUsuario);

module.exports = router;
