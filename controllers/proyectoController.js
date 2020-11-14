const Proyecto = require('../models/Proyecto');
const { validationResult } = require('express-validator');

exports.crearProyecto = async (req, res) => {

    // revisar si hay errores
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({errores: errors.array() });
    }

    try {
        const proyecto = new Proyecto(req.body);

        proyecto.creador = req.usuario.id
        proyecto.save();
        res.json(proyecto);

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

// Obtiene todos los proyectos del usuario actual
exports.obtenerProyectos = async (req, res) => {

    try {
        const proyectos = await Proyecto.find({ creador: req.usuario.id}).sort({ creado: -1});
        res.json({ proyectos });


    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }


}

// Actualiza un proyecto
exports.actualizarProyecto = async(req, res) => {
    

    // console.log(req.body.nombre);
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({errores: errors.array() });
    }

    const { nombre } = req.body;
    const nuevoProyecto = {};

    if (nombre) {
        nuevoProyecto.nombre = nombre;
    }

    try {
        // revisar el ID
        let proyecto = await Proyecto.findById(req.params.id);


        // Si el proyecto eiste
        if(!proyecto) {
            return res.status(404).json({msj: 'Proyecto no encontrado'});
        }
        // verificar el creador del proyecto
        if(proyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({msg: 'No Autorizado'});
        }
        // actualiar
        proyecto = await Proyecto.findByIdAndUpdate({_id: req.params.id }, 
            { $set : nuevoProyecto}, { new: true });

        res.json({proyecto});

    } catch (error) {
        console.log(error);
        res.status(500).send('Error en el servidor');
    }

}

// Elimina un proyecto por su id
exports.eliminarProyecto = async(req, res) => { 

    try {
        // revisar el ID
        let proyecto = await Proyecto.findById(req.params.id);


        // Si el proyecto eiste
        if(!proyecto) {
            return res.status(404).json({msj: 'Proyecto no encontrado'});
        }
        // verificar el creador del proyecto
        if(proyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({msg: 'No Autorizado'});
        }
        // eliminar proyecto
        await Proyecto.findOneAndRemove({_id : req.params.id});
        res.json({ msg: 'Proyecto Eliminado'});


    } catch (error) {
        console.log(error);
        res.status(500).send('Error en el servidor');
    }

}