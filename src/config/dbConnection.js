require('dotenv/config');

var data = ({
    client: 'mysql',
    connection: {
        host: process.env.DB_HOST,
        user:  process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_DATABASE,
        port: process.env.DB_PORT,
        ssl: true
    }
});

var connection = require('knex')(data);

if (connection) {
    console.log("Conectado ao SIAPE - Local!");
} else {
    console.log("Não conectado")
}

module.exports = connection;