const express = require('express');
const {obterContas,criarConta,atualizarConta, excluirConta,consultaSaldo, consultaExtrato} = require('./controladores/contas');
const {depositar, sacar, transferir} = require('./controladores/transacoes');

const rotas = express();


rotas.get('/contas', obterContas);
rotas.post('/contas', criarConta);
rotas.put('/contas/:numeroConta/usuario', atualizarConta);
rotas.delete(`/contas/:numeroConta`, excluirConta);
rotas.get('/contas/saldo', consultaSaldo);
rotas.get('/contas/extrato', consultaExtrato);

rotas.post('/transacoes/depositar', depositar);
rotas.post('/transacoes/sacar', sacar);
rotas.post('/transacoes/transferir', transferir);



module.exports = rotas;