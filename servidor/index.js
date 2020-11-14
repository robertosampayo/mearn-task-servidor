const express = require('express');
const conectarDB = require('./config/db.js');
const cors = require('cors')
// crear el servidor
const app= express();
// Conectar a BD
conectarDB();

// Habilitar cors
app.use(cors());

// Habilitar express.json
app.use(express.json({ extended: true }));

// puerto de la app
const PORT = process.env.PORT || 4000;

// Importar rutas
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/proyectos', require('./routes/proyectos'));
app.use('/api/tareas', require('./routes/tareas'));

// Definir la página principal
app.get('/', (req,res) => {
    res.send('Hola Mundo!')
})

// correr app
app.listen(PORT, '0.0.0.0' , () =>{
    console.log(`El servidor esta funcionando en el puerto ${PORT}`);
})