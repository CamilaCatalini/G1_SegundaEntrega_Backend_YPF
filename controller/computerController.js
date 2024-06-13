const {connectToMongoDB, disconnectFromMongoDB} = require('../database/mongodb');

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
    
    const db = await connectToMongoDB();
    const data = db.db('ComputersCollection'); 
    const collection = data.collection('computers');
    let result = {};

    // Modelo del objeto computadora. Servira para saber si en los datos que ingresaron hay un campo
    // que no exista para no agregarlo al modificar.
    const modelComputer = {"codigo": 1, "codigo": 1,
                           "nombre": "Desktop Gaminggg",
                           "precio": 999.99,
                           "categoria": "Desktooop"}
                       
    // En uniqueProps se guardan las keys de computer(datos ingresados para modificar) que no se encuentren 
    // en modelComputer en forma de array. 
    const uniqueProps = Object.keys(computer).filter(key1 => !(key1 in modelComputer))

    // Si se encontro una key que no se esncuentra en nuestro modelo, retorna un error.
    if(!(uniqueProps.length == 0)){
        return {'status': 500, 'msj': 'Error al actualizar fruta. Se quiere actualizar uno o varios campos que no existen!'}
    }

    await collection.updateOne({codigo: parseInt(code)}, {$set: computer})
    .then( async e => {

        // updateOne retorna resultados. Uno de ellos es matchedCount el cual vale 1 si se modifico algun dato y
        // 0 si no lo hizo. Esto es para cuando me ingresen un codigo que no exista, me retorne un error.
        if(e.matchedCount===0){
            result = {'status': 201, 'msj': 'Error al actualizar fruta, codigo ' + code + ' no encontrado!'}
        }else{
            result = {'status': 201, 'msj': 'Fruta actualizada exitosamente!'}
        }
    }).catch(err => { 
        console.error(err)
        result = {'status': 500, 'msj': 'Error al actualizar fruta!'}
    }).finally(async () => { 
        await disconnectFromMongoDB(); 
    })

    return result;
}


async function getComputer(id){
    let result = {}
    const db = await connectToMongoDB();
    if (!db) result={'status':404,'data':'Lo siento, no hay resultado para ese ID'};
    const data = db.db('ComputersCollection');
    
    if(!isNaN(id)){
        const resultado=await data.collection('computers').findOne({codigo:id})
        resultado == null ? result={'status':404,'data':'Lo siento, no hay resultado para ese ID'}:
                            result={'status':200,'data':resultado}; 
    } else{
        result= {'status':400,'data':'Lo siento, el id que buscas no es númerico.'};
    }
    await disconnectFromMongoDB();
    return result;
}

async function nuevaComputadora(computadora){
    let result = {}

    const db = await connectToMongoDB();
    if (!db) result={'status':404,'data':'Lo siento, no hay resultado para ese ID'};
    const data = db.db('ComputersCollection');
   
    if ( computadora === undefined ){
        result={'status':400,'data':"Error en el formato de datos a crear"}
    }else {
         await data.collection('computers').insertOne(computadora)
                    .then(()=>{
                        result={'status':200,'data':computadora}
                    })
                    .catch(error=>{
                        console.error(error)
                        result={'status':500,'data':'Error al crear nueva fruta'}
                    })
                    .finally(async()=>{
                        await disconnectFromMongoDB();
                    });
    }
    return result
}

module.exports = {getAllComputers,updateComputer,getComputer,nuevaComputadora};