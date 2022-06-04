const {banco,contas,saques, depositos, transferencias} = require('../bancodedados');
let proximoId = contas.length+1;

//listar todas as contas
const obterContas = (req, res) => {
    
    if(contas.length === 0){
        return res.status(404).json({mensagem: 'Não há contas cadastradas.'});
    }
    
    res.status(200).json(contas);
}

//função com async, criar conta
async function criarConta (req, res) {
    const {nome, cpf, data_nascimento,telefone,email,senha} = req.body;

    if (!Number(cpf)){
        return res.status(400).json({mensagem: 'CPF deve conter somente números'});
    }
    if(!nome || !cpf || !data_nascimento || !telefone || !email || !senha){
        return res.status(400).json({mensagem: 'Desculpa mas, todos os campos são obrigatórios'});
    }
    
    const cpfExiste = contas.find((conta) => { return conta.usuario.cpf === cpf});
    const emailExiste = contas.find((conta) => { return conta.usuario.email === email});

    if(cpfExiste){
        return res.status(400).json({mensagem: 'O CPF informado já existe cadastrado!'});
    }
    
    if(emailExiste){
        return res.status(400).json({mensagem: 'O Email informado já existe cadastrado!'});
    }

    const novaConta = {
        numero: proximoId++,
        saldo: 0,
            usuario: {
                nome,
                cpf,
                data_nascimento,
                telefone,
                email,
                senha
            }
    }

    contas.push(novaConta);
    return res.status(201).send();
}

//atualização do úsuário da conta
const atualizarConta = (req, res) => {
    const {nome, cpf, data_nascimento,telefone,email,senha} = req.body
    const {numeroConta} = req.params;

    if (!Number(cpf)){
        return res.status(400).json({mensagem: 'CPF deve conter somente números'});
    }
    if(!nome || !cpf || !data_nascimento || !telefone || !email || !senha){
        return res.status(400).json({mensagem: 'Desculpa mas, todos os campos são obrigatórios'});
    }

    const contaAchada = contas.find((conta) => { return Number(conta.numero) === Number(numeroConta)});

    if(!contaAchada){
        return res.status(404).json({mensagem: 'Conta não encontrada'});
    }

    if(cpf !== contaAchada.usuario.cpf){
        const cpfExiste = contas.find((conta) => { return conta.usuario.cpf === cpf});
        if(cpfExiste){
            return res.status(400).json({mensagem: 'O CPF informado já existe cadastrado!'});
        }
    }

    if(email !== contaAchada.usuario.email){
        const emailExiste = contas.find((conta) => { return conta.usuario.email === email});
        if(emailExiste){
            return res.status(400).json({mensagem: 'O Email informado já existe cadastrado!'});
        }
    }

    contaAchada.usuario ={
        nome,
        cpf,
        data_nascimento,
        telefone,
        email,
        senha
    }
    return res.status(204).send();
}

//exclusão de conta
const excluirConta = (req, res) => {
    const {numeroConta} = req.params;

    const indiceConta = contas.findIndex((conta) => {return Number(conta.numero) === Number(numeroConta)});
    const contaAchada = contas.find((conta) => { return Number(conta.numero) === Number(numeroConta)});

    if(!contaAchada){
        return res.status(404).json({mensagem: 'Conta não encontrada'});
    }
    
    if (indiceConta < 0) {
        return res.status(404).json({ mensagem: "Não existe conta para exlcuir" });
    }
    if(contaAchada.saldo != 0){
        return res.status(403).json({mensagem: 'A conta só pode ser removida se o saldo for zero!'});
    }

    contas.splice(indiceConta, 1);

    return res.status(204).send();
}

const consultaSaldo = (req, res) => {
    const {numero_conta, senha} = req.query; 
    
    if(!numero_conta ||!senha){
        return res.status(400).json({mensagem: 'Desculpa mas, número da conta e senha são obrigatórios'});
    }

    const contaAchada = contas.find((conta) => { return Number(conta.numero) === Number(numero_conta)});
    
    if(!contaAchada){
        return res.status(404).json({mensagem: 'Conta não encontrada'});
    }
    
    if(contaAchada.usuario.senha !== senha){
        return res.status(400).json({mensagem: 'Senha incorreta'});
    }
      

    return res.status(200).json({saldo: contaAchada.saldo}); 
}

const consultaExtrato = (req, res) => {
    const {numero_conta, senha} = req.query
   
       if (!numero_conta || !senha) {
           return res.status(400).json({ mensagem: 'Desculpa mas, o numero_conta da conta e a senha são obrigatórios!' });
       }
   
       const contaAchada = contas.find((conta) => { return Number(conta.numero) === Number(numero_conta)});
   
       if (!contaAchada) {
           return res.status(404).json({ mensagem: 'Conta não encontrada' });
       }
   
       if (contaAchada.usuario.senha !== senha) {
           return res.status(400).json({ mensagem: 'Senha incorreta' });
       }
   
       const extratoDepositos = depositos.filter((deposito) => {return Number(deposito.numero_conta) === Number(numero_conta)});
   
       const extratoSaques = saques.filter((saque) => {return Number(saque.numero_conta) === Number(numero_conta)});
   
       const transferenciasEnviadas = transferencias.filter((transferencia) => {return Number(transferencia.numero_conta_origem) === Number(numero_conta)});
   
       const transferenciasRecebidas = transferencias.filter((transferencia) => {return Number(transferencia.numero_conta_destino) === Number(numero_conta)});
   
       return res.json({
           depositos: extratoDepositos,
           saques: extratoSaques, 
           transferenciasEnviadas, 
           transferenciasRecebidas
        });

}

module.exports = {obterContas,criarConta, atualizarConta, excluirConta, consultaSaldo, consultaExtrato};