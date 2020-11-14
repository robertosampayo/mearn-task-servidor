const Tarea = require('../models/Tarea');
const Proyecto = require('../models/Proyecto');
const { validationResult } = require('express-validator');

exports.crearTarea = async (req, res) => {

    // revisar si hay errores
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({errores: errors.array() });
    }

    // Extraer el proyecto y comprobar si existe

    
    try {
        
        const { proyecto } = req.body;
        const proyectoActual = await Proyecto.findById(proyecto);
        if(!proyectoActual) {
            return res.status(404).json({msg: 'Proyecto no encontrado'})
        }
        console.log(proyectoActual);
        // Revisar si el proyecto actual pertece al usuario autenticado
        if(proyectoActual.creador.toString() !== req.usuario.id) {
            return res.status(401).json({msg: 'No Autorizado'});
        }

        // Creamos la tarea
        const tarea = new Tarea(req.body);
        await tarea.save();
        res.json({ tarea });

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

// Obtiene todos los Tareas del usuario actual
exports.obtenerTareas = async (req, res) => {



    
    try {
        
        const { proyecto } = req.body;
        const proyectoActual = await Proyecto.findById(proyecto);
        if(!proyectoActual) {
            return res.status(404).json({msg: 'Proyecto no encontrado'})
        }
        // Revisar si el proyecto actual pertece al usuario autenticado
        if(proyectoActual.creador.toString() !== req.usuario.id) {
            return res.status(401).json({msg: 'No Autorizado'});
        }

        // Obtener tareas por proyecto
        const tareas = await Tarea.find({ proyecto });
        res.json({ tareas });

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }


}

// Actualiza un proyecto
exports.actualizarTarea = async(req, res) => {
    



    try {
        // revisar el ID
        const { nombre, estado } = req.body;


        const tareaActual = await Tarea.findById(req.params.id);

        const {proyecto} = tareaActual;
        const proyectoTarea = await Proyecto.findById(proyecto);


        if(!tareaActual) {
            return res.status(404).json({msj: 'No existe esa tarea'});
        }


        // Revisar si el proyecto actual pertece al usuario autenticado
        if(proyectoTarea.creador.toString() !== req.usuario.id) {
            return res.status(401).json({msg: 'No Autorizado'});
        }

        // Crear un objeto con la nueva información
        const  nuevaTarea = {};

        if(nombre) nuevaTarea.nombre = nombre;
        if(estado) nuevaTarea.estado = estado;

        // Guardar la tarea

        tarea = await Tarea.findOneAndUpdate({_id: req.params.id }, nuevaTarea, { new: true });

        res.json({ tarea });

    } catch (error) {
        console.log(error);
        res.status(500).send('Error en el servidor');
    }

}

// Elimina un proyecto por su id
exports.eliminarTarea = async(req, res) => { 

    try {
        // revisar el ID
        let tarea = await Tarea.findById(req.params.id);

        const {proyecto} = tarea;
        const proyectoTarea = await Proyecto.findById(proyecto);
        // Revisar si el proyecto actual pertece al usuario autenticado
        if(proyectoTarea.creador.toString() !== req.usuario.id) {
            return res.status(401).json({msg: 'No Autorizado'});
        }

        // Si la tarea existe
        if(!tarea) {
            return res.status(404).json({msj: 'Tarea no encontrada'});
        }

        // eliminar tarea
        await Tarea.findOneAndRemove({_id : req.params.id});
        res.json({ msg: 'Tarea Eliminada'});


    } catch (error) {
        console.log(error);
        res.status(500).send('Error en el servidor');
    }

}