// Rutas para autanticar usuarios
const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const auth = require('../middleware/auth');
const authController = require('../controllers/authController');

// Iniciar Sesion
// api/auth
router.post('/', 

    authController.autenticarUsuario
);

// Obtiene el usuaio autenticado
router.get('/', 
    auth,
    authController.usuarioAutenticado
);

module.exports = router;