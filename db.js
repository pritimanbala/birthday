var { MongoClient }  = require('mongodb');

let dbConnection

module.exports = {
    connectDb : (cb) => {
        MongoClient.connect('mongodb+srv://pritiman123:test1234@birthday.2gstp.mongodb.net')
        .then((client) => {
            dbConnection = client.db();
            return cb()
        })
        .catch(err => {
            console.log(err);
            return cb(err)
        })
    },
    getDb : () => dbConnection
}