require('dotenv/config');

var data = ({
    client: 'pg',
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

if (process.env.DB_USER == 'empreender_tst') console.log("Conectado ao PostGres - TESTES!");

if (process.env.DB_USER == 'empreender_prd') console.log("Conectado ao PostGres - PRODUÇÃO!");

module.exports = connection;