let {contas, saques, depositos, transferencias} = require('../bancodedados');
const {format} = require('date-fns');

const depositar = (req, res) => {
    const {numero_conta, valor} = req.body;

    if(!numero_conta || !valor){
        return res.status(400).json({mensagem: 'Desculpa mas, número da conta e valor são obrigatórios'});
    }
    if(valor <= 0){
        return res.status(400).json({mensagem: 'Desculpa mas, o valor deve ser maior que zero'});
    }

    const contaAchada = contas.find((conta) => { return Number(conta.numero) === Number(numero_conta)});

    if(!contaAchada){
        return res.status(404).json({mensagem: 'Conta não encontrada'});
    }

    contaAchada.saldo += valor;

    const registro = {
        data: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
        numero_conta,
        valor
    };

    depositos.push(registro);

    return res.status(201).send();
}

const sacar = (req, res) => {
    const { numero_conta, valor, senha } = req.body;
    
    if (!numero_conta || !valor || !senha) {
        return res.status(400).json({ mensagem: 'Desculpa mas, o número da conta, a senha e o valor são obrigatórios!' });
    }

    const contaAchada = contas.find((conta) => { return Number(conta.numero) === Number(numero_conta)});

    if(!contaAchada){
        return res.status(404).json({mensagem: 'Conta não encontrada'});
    }

    if (contaAchada.usuario.senha !== senha) {
        return res.status(400).json({ mensagem: 'Senha incorreta' });
    }
    if (valor <= 0) {
        return res.status(400).json({ mensagem: 'O valor de saque não pode ser menor ou igual a zero!' });
    }

    if (contaAchada.saldo < valor) {
        return res.status(403).json({ mensagem: 'Saldo insuficiente' });
    }
    contaAchada.saldo -= valor;

    const registro = {
        data: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
        numero_conta,
        valor,
    };

    saques.push(registro);

    return res.status(201).send();
}

const transferir = (req, res) => {
    const { numero_conta_origem, numero_conta_destino, valor, senha } = req.body;

    if (!numero_conta_origem || !numero_conta_destino || !valor || !senha) {
        return res.status(400).json({ mensagem: 'Desculpa mas, o número da conta de origem, de destino, a senha e o valor são obrigatórios!' });
    }
   
    const contaExistenteOrigem = contas.find(conta => { return Number(conta.numero) == Number(numero_conta_origem)});
    const contaExistenteDestino = contas.find(conta => { return Number(conta.numero) == Number(numero_conta_destino)});


    if (!contaExistenteOrigem) {
        return res.status(404).json({ mensagem: 'Conta de origem não existe!' });
    }

    
    if (!contaExistenteDestino) {
        return res.status(404).json({ mensagem: 'Conta de destino não existe!' });
    }

    if (contaExistenteOrigem.usuario.senha !== senha) {
        return res.status(400).json({ mensagem: 'Senha incorreta' });
    }
    
    if (valor <= 0) {
        return res.status(400).json({ mensagem: 'Permitido somente valores maiores que zero!' });
    }

    if (contaExistenteOrigem.saldo < valor) {
        return res.status(403).json({ mensagem: 'Saldo insuficiente' });
    }

    contaExistenteOrigem.saldo -= valor;
    contaExistenteDestino.saldo += valor;

   const registro = {
        data: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
        numero_conta_origem,
        numero_conta_destino,
        valor
    };

    transferencias.push(registro);

    return res.status(201).send();
}
module.exports = {depositar, sacar, transferir};