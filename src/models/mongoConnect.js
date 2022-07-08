require('dotenv').config()
const MongoClient = require('mongodb').MongoClient

const uri = 'mongodb+srv://rd2:ioss@cluster0.xlbfpwk.mongodb.net/?retryWrites=true&w=majority'
const client = new MongoClient(uri)

const conn = async (coll) => {
    await client.connect();
    const database = await client.db('ieab');
    console.log('Connected successfully to server ');
    return await database.collection(coll);
}

module.exports = conn
