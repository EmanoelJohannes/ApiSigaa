require('dotenv/config');

const express = require ('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.json());

app.use(cors())

app.use(require('./routes'));

app.listen (3333, ()=>{
    console.log("Conectado porta 3333");
});
