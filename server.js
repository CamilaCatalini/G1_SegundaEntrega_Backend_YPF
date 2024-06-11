// Servidor. 
const express = require('express');
const { getAllComputers } = require('./controller/computerController');
const app = express();
const PORT = process.env.PORT || 3008;

// Para evitar TypeError: Cannot read property '_id' of undefined.
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware.
app.use((req, res, next) => {
    res.header('Content-Type', 'application/json; charset=utf-8');
    next();
})

// Ruta raiz.
app.get('/', (req, res) => {
    res.status(200).end('Bienvenid@ a la API de Coleccion de computadoras')
});

// Se obtienen todas las computadoras de la base de datos.
app.get('/api/computadoras', async (req, res) => {
    res.status(200).json(await getAllComputers());
});

app.get('*', (req, res) => {
    res.status(404).send('Lo siento, la página que buscas no existe.'); 
});

// Inicia el servidor.
app.listen(PORT, () => {
    console.log(`Servidor iniciado en el puerto http://localhost:${PORT}`);
});