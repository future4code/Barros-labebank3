import express, { Request, Response } from "express";
import cors from "cors";
import * as data from "./data"
import { verifyAge, dateVerify } from "./function";
import * as allTypes from "./types";

const app = express();

app.use(express.json());
app.use(cors());

// Exibir todos clientes
app.get("/clients",(req:Request, res:Response)=>{
    res.status(200).send(data.clients)
})

// Pegar saldo: O usuário deve conseguir verificar o saldo da sua conta, passando o seu nome e o seu CPF. 
// Exercicio Complementar 2:  A informação deve ser igual ao que estiver salvo no sistema. Se for diferente, exiba uma mensagem de erro.
app.get("/clients/client/balance/cpf/:cpf/name/:name",(req:Request, res:Response)=>{
    const cpf = req.params.cpf
    const name = req.params.name

    try{
        const client = data.clients.filter((client)=>{
            return client.name === name && client.cpf === cpf
        })

        if(client.length === 0){
            const erro = new Error("Usuário não encontrado..")
            erro.name = "clientNotFound"
            throw erro
        } else{
            res.send(` Olá ${client[0].name}.... 
            Seu saldo é: R$ ${String(client[0].balance)}`)
        }
    }
    catch(e:any){
        if(e.name === "clientNotFound"){ res.status(400).send(e.message)}
    }
})
// Criar Conta: Um cliente pode criar uma conta no banco se tiver idade igual ou maior do que 18 anos
// Exercicio Complementar 1: Adicione mais uma validação na função do item 1 (Criar conta): verifiquem se o CPF passado já não está atrelado a alguma conta existente.
app.post("/clients/createAccount", (req: Request, res: Response) => {
    let errorCode = 400;
    try {
        const { name, cpf, birthdayDate } = req.body;
    
        if (!name || !cpf || cpf.length !== 11 || !birthdayDate) {
            errorCode = 422;
            throw new Error(
            "Necessário preencher body com nome, CPF e data de nascimento"
            );
        } else if(cpf.length !== 11) {
            errorCode = 422;
            throw new Error("CPF deve conter 11 números");
        }
        const newUser:allTypes.TypeClients = {
            idAccount:Date.now(),
            name:name,
            balance:0,
            birthdayDate:birthdayDate,
            cpf:cpf,
            extract:[]
        }
    
        for (let user of data.clients) {
            if (user.cpf === cpf) {
                errorCode = 409;
                throw new Error("CPF já cadastro na base de dados");
            }
        }
    
        if (verifyAge(birthdayDate) >= 18) {
            data.clients.push(newUser);
    
            res.status(201).send( "Usuário cadastrado com sucesso!" );
        } else {
            errorCode = 409;
            throw new Error("Cliente não possui idade igual ou superior a 18 anos");
        }
    } catch (error: any) {
      res.status(errorCode).send(error.message);
    }
});

// -- -- -- --  Pagar uma conta -- -- -- -- //
// Exercicio Complementar 5: O saldo do usuário não deve ser atualizado neste momento. Caso nenhuma data seja passada, considere que o pagamento deve ser feito hoje. 
// Exercicio Complementar 7: Adicione uma validação ao endpoint de pagar conta: o usuário não pode colocar uma data que já passou.
// Exercicio Complementar 8: O usuário não pode tentar fazer um pagamento cujo valor seja maior do que seu saldo atual.
app.post("/clients/payAccount", (req:Request, res:Response) => {
    let errorCode = 400;
    try {
        const cpf = req.query.cpf as string;
        const {value, description, date} = req.body;
        
        if(!cpf){
            errorCode = 422;
            throw new Error("Passe o cpf do usuario no headers");
        } else if(!value || !description ){
            errorCode = 422;
            throw new Error("Informaçoes faltando, por favor, digite o valor e a descrição ");
        } else if(typeof(value) !== "number"){
            errorCode = 422;
            throw new Error("Digite o valor da conta em numeros");
        };
    
        const findClient = data.clients.find( client => client.cpf === cpf);
        if(!findClient){
            errorCode = 404;
            throw new Error("Digite o cpf do usuario ");
        } else if(findClient.balance < value){
            errorCode = 409;
            throw new Error("Saldo insuficiente!")
        };
    
        if(!date || date.length === 0){
            const {DMA} = dateVerify(""); // DMA abreviação de dia, mes ano, é um array com o dia, mes e ano
            // se não passar uma data e o saldo da conta for maior do que a conta  o saldo ja é descontado e a conta ja é paga
            findClient.balance = findClient.balance - value;
            findClient.extract.push({ value, description, date: `${DMA[0]}/${DMA[1]}/${DMA[2]}` });
    
            res.status(201).send(findClient);
        };
        
        const {validDate,codeErr,errorMsg} = dateVerify(date);
        if(date && validDate){  
            
            findClient.extract.push({value, description, date});
            
            res.status(201).send(findClient)
        } else {
            errorCode = codeErr;
            throw new Error(errorMsg);
        };
    } catch(erro: any){
      res.status(errorCode).send(erro.message);
    }
});
 
// Atualizar Saldo do cliente
// Exercicio Complementar 6: Crie um novo endpoint put responsável por atualizar o saldo de um cliente.  
app.put("/clients/updateBalance", (req:Request, res:Response) => {
    let errorCode = 400;
    try {
        const cpf = req.query.cpf as string;
        
        if(!cpf){
            errorCode = 422;
            throw new Error("Passe o cpf da Conta Bancaria");
        };
        const findClient = data.clients.find( client => client.cpf === cpf);
        
        if(!findClient){
            errorCode = 404;
            throw new Error(`Conta com o CPF ${cpf} inexistente no banco`);  
        };
    
        const {DMA} = dateVerify("")
        let indexConta: number = NaN;
        data.clients.map( (client,index) => { // isso aqui ta encontrando o index da conta
            client.cpf === cpf? indexConta = index : {}
        });

        const beforeUpdateBalance = findClient.balance;
        let payAccountsValue: number = 0;
        const updateBalane = () => {
            let updateBa: number = 0; // essa variavel ira receber os valores de todas as contas com a data anterio a hj
            data.clients[indexConta].extract.map( (extract ) => {
                let day = Number(extract.date.split("/")[0]);
                let month = Number(extract.date.split("/")[1]);
                let year = Number(extract.date.split("/")[2]);
                  
                if(day !== DMA[0] && month <= DMA[1] && year <= DMA[2] && extract.description !== "Depósito de dinheiro"){
                    //so atualizar o saldo se o dia mes e ano for menor do que a data atual e a descricao for diferente de deposito
                    // no banco de dados ja tem os dados necessarios para testar
                    payAccountsValue = payAccountsValue + extract.value
                    updateBa = updateBa + extract.value;
                }
            });
            
            if(findClient.balance >= updateBa) {
            findClient.balance = findClient.balance - updateBa; // aqui é onde esta atualizando o saldo(Balance)
            } else {
            errorCode = 409;
            throw new Error("Saldo insuficiente!");
            }
        };
        updateBalane();
        
        res.status(201).send(`Saldo antigo era de ${beforeUpdateBalance} e o atual é de ${findClient.balance.toFixed(2)},
        apos atualizar  o valor e descontar ${payAccountsValue} de suas contas anteriores ao dia de hoje`)
    } catch(erro: any){
      res.status(errorCode).send(erro.message);
    }
});

// Transferencia entre clientes
// Exercicio Complementar: 10 e 11 feitos
app.post("/clients/transfer",(req:Request, res:Response)=>{
    let erroCode = 400;
    try {
        const {name, cpf, nameToTransfer, cpfToTransfer, value} = req.body
        
        if(!name || !cpf || !nameToTransfer || !cpfToTransfer || !value){
            erroCode = 422;
            throw new Error("Necessario preencher o body com o name, cpf, nameToTransfer, cpfToTransfer, value");
        }else if(typeof(value) !== "number"){
            erroCode = 422;
            throw new Error("A propriedade value tem que sem em numeros");    
        };

        const clientAccount = data.clients.filter((client)=>{
            return client.name === name && client.cpf === cpf
        })
    
        const clientToTransf = data.clients.filter((client)=>{
            return client.name === nameToTransfer && client.cpf === cpfToTransfer
        })
        if(clientAccount.length === 0){
            erroCode = 404;
            throw new Error(`O Cliente ${name} com cpf ${cpf} não foi encontrado`);
        }else if(clientToTransf.length === 0){
            erroCode = 404;
            throw new Error(`O Cliente ${nameToTransfer} com o cpf ${cpfToTransfer} não foi encontrado`);  
        };
        const {DMA} = dateVerify("")
        for(let client of clientAccount){
            let newExtract: allTypes.TypeExtract = {
                value,
                description: "transferencia",
                date: `${DMA[0]}/${DMA[1]}/${DMA[2]}`    
            }
            if(client.balance < value){
                erroCode = 409;
                throw new Error("Saldo insuficiente para fazer a tranferencia");
            } else{
                client.balance = client.balance - value
                client.extract.push(newExtract)
            }
        };

        for(let client of clientToTransf){
            let newExtract: allTypes.TypeExtract = {
                value,
                description: "Depósito de dinheiro",
                date: `${DMA[0]}/${DMA[1]}/${DMA[2]}`    
            };
            client.balance = client.balance + value
        };

        res.send(`Valor de ${value} foi transferido com sucesso para o cliente ${clientToTransf[0].name}`)

    }catch(error: any){
        res.status(erroCode).send(error.message)
    }
});

// Adicionar Saldo a conta
// Exercicio Complementar 3: Crie um endpoint put que receba um nome, um CPF e um valor. Ele deve adicionar o valor ao saldo do usuário 
// Exercicio Complementar 4: Altere o endpoint de adicionar saldo para que ela adicione um item ao extrato da conta do usuário:
app.put("/clients/addBalance",(req:Request, res:Response)=>{
    let erroCode = 400;
    try {
        const {name, cpf, value} = req.body
        if(!name || !cpf || !value){
            erroCode = 422;
            throw new Error("Passe o name, cpf e value");
        }else if(typeof(value) !== "number"){
            erroCode = 404;
            throw new Error("Passe o value em Numeros");
        };

        const clients = data.clients.filter((client)=>{
            return client.name === name && client.cpf === cpf
        })
        if(clients.length === 0){
            erroCode = 404;
            throw new Error("Cliente não encontrado, passe o nome e o cpf correto do cliente");
        }
        const {DMA} = dateVerify(""); // DMA REPRESENTA A DATA ATUAL: D=dia/ M=mes/ A=ano
        let newExtract: allTypes.TypeExtract = {
            value: value,
            description:"Depósito de dinheiro",
            date: `${DMA[0]}/${DMA[1]}/${DMA[2]}`}
        for(let client of clients){
            client.balance = client.balance + value
            client.extract.push(newExtract)
        }
    
        res.status(201).send(`O valor de R$: ${value} foi adicionado com sucesso...
        Seu saldo atual é de R$: ${clients[0].balance}`)

    }catch(error: any){
        res.status(erroCode).send(error.message);
    }
})

app.listen(3003, () => {
    console.log("Server is running in http://localhost:3003");
});

