const express = require('express');
const router = express.Router();
const tareaController = require('../controllers/tareaController');
const auth = require('../middleware/auth');
const { check } = require('express-validator');

// Crea una tarea
// api/tarea
router.post('/',
    auth, 
    [
        check('nombre','El nombre de la tarea es obligatorio').not().isEmpty(),
        check('proyecto','El proyecto es obligatorio').not().isEmpty()
    ],  
    tareaController.crearTarea
);

// Obtener tareas
router.get('/',
    auth, 
    tareaController.obtenerTareas
);

// Actualizar Tarea via ID
router.put('/:id',
    auth,
    tareaController.actualizarTarea
);

// Eliminar Tarea via ID
router.delete('/:id',
    auth,  
    tareaController.eliminarTarea
);



module.exports = router;