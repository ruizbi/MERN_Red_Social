const mongoose = require('mongoose');
const mongodb_uri = `mongodb+srv://${process.env.USER_DB}:${process.env.PASSWORD_DB}@dbprueba.dogc2.mongodb.net/api_disney_alkemy?retryWrites=true&w=majority`;

const dbConnection = async () => {
    await mongoose.connect( mongodb_uri)
    .then(() => console.log('Connect db!'))
    .catch((error) => console.log(error));
}

module.exports = dbConnection;