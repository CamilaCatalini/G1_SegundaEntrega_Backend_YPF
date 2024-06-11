const {connectToMongoDB, disconnectFromMongoDB} = require('../database/mongodb');

async function getAllComputers(){
    const db = await connectToMongoDB();
    const data = db.db('ComputersCollection');

    const result = await data.collection('computers').find().toArray();
    await disconnectFromMongoDB();

    //console.log(result);
    return result;
}

module.exports = {getAllComputers};