const {connectToMongoDB, disconnectFromMongoDB} = require('../database/mongodb');
const {checkCodeAndData} = require('./dataController');

async function getAllComputers(){
    const db = await connectToMongoDB();
    const data = db.db('ComputersCollection');

    const result = await data.collection('computers').find().toArray();
    await disconnectFromMongoDB();

    //console.log(result);
    return result;
}

// METODO PUT (actualizar)
async function updateComputer(code, computer){

    // checkCodeAndData: funcion que corrobora los datos ingresados.
    let dataOk = checkCodeAndData(code,computer);
    if(!dataOk.state){
        return dataOk
    }
    
    const db = await connectToMongoDB();
    const data = db.db('ComputersCollection'); 
    const collection = data.collection('computers');

    // Modelo del objeto computadora. Servira para saber si en los datos que ingresaron hay un campo
    // que no exista para no agregarlo al modificar.
    const modelComputer = {"codigo": 1, "codigo": 1,
                           "nombre": "Desktop Gaming",
                           "precio": 999.99,
                           "categoria": "Desktop"}
                       
    // En uniqueProps se guardan las keys de computer(datos ingresados para modificar) que no se encuentren 
    // en modelComputer en forma de array. 
    const uniqueProps = Object.keys(computer).filter(key1 => !(key1 in modelComputer))

    // Si se encontro una key que no se esncuentra en nuestro modelo, retorna un error.
    if(!(uniqueProps.length == 0)){
        return {'status': 500, 'msj': 'Error al actualizar computadora. Se quiere actualizar uno o varios campos que no existen!'}
    }

    let result;

    await collection.updateOne({codigo: parseInt(code)}, {$set: computer})
    .then( async e => {

        // updateOne retorna resultados. Uno de ellos es matchedCount el cual vale 1 si se modifico algun dato y
        // 0 si no lo hizo. Esto es para cuando me ingresen un codigo que no exista, me retorne un error.
        if(e.matchedCount===0){
            result = {'status': 500, 'msj': 'Error al actualizar computadora, codigo ' + code + ' no encontrado!'}
        }else{
            result = {'status': 201, 'msj': 'Computadora actualizada exitosamente!'}
        }
    }).catch(err => { 
        console.error(err)
        result = {'status': 500, 'msj': 'Error al actualizar computadora!'}
    }).finally(async () => { 
        await disconnectFromMongoDB(); 
    })

    return result
}

module.exports = {getAllComputers, updateComputer};