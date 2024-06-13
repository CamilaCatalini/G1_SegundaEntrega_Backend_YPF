const {connectToMongoDB, disconnectFromMongoDB} = require('../database/mongodb');

async function getAllComputers(){
    const db = await connectToMongoDB();
    const data = db.db('ComputersCollection');

    const result = await data.collection('computers').find().toArray();
    await disconnectFromMongoDB();

    //console.log(result);
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

module.exports = {getAllComputers,getComputer,nuevaComputadora};