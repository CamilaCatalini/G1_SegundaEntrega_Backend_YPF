// Servidor. 
const express = require('express');
const { getAllComputers,getComputer,nuevaComputadora } = require('./controller/computerController');
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


// Se obtienen la computadora con el id ingresado.
app.get('/api/computadoras/:id', async (req, res) => {
    let id = parseInt(req.params.id);
    const resultado=await getComputer(id);
    res.status(resultado.status).send(resultado.data);
});

//se crea una computaora nueva 
app.post('/api/computadoras',async (req,res)=>{
    const computadora = req.body;
    const resultado = await nuevaComputadora(computadora);
    res.status(resultado.status).send(resultado.data);
})



app.get('*', (req, res) => {
    res.status(404).send('Lo siento, la página que buscas no existe.'); 
});

// Inicia el servidor.
app.listen(PORT, () => {
    console.log(`Servidor iniciado en el puerto http://localhost:${PORT}`);
});