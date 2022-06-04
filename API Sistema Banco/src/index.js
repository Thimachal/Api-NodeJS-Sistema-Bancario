const express = require('express');
const rotas = require('./roteador');
const {senha_banco} = require('./intermediarios');

const app = express();

app.use(express.json());
app.use(senha_banco);
app.use(rotas);


app.listen(5000);