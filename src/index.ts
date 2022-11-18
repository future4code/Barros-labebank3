import express, { Request, Response } from "express";
import cors from "cors";
import * as data from "./data"
import { verifyAge, dateVerify } from "./function";
import * as allTypes from "./types";

const app = express();

app.use(express.json());
app.use(cors());

app.get("/clients",(req:Request, res:Response)=>{
    res.status(200).send(data.clients)
})

app.get("/client/balance/cpf/:cpf/name/:name",(req:Request, res:Response)=>{
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

app.post("/criarConta", (req: Request, res: Response) => {
    let errorCode = 422;
    try {
      const { name, cpf, birthdayDate } = req.body;
  
      const newUser:allTypes.user = {
        idAccount:Date.now(),
        name:name,
        balance:0,
        birthdayDate:birthdayDate,
        cpf:cpf,
        extract:[]

      }
  
      if (!name || !cpf || cpf.length !== 11 || !birthdayDate) {
        errorCode = 400;
        if (cpf.length !== 11) {
          throw new Error("CPF deve conter 11 números");
        }
        throw new Error(
          "Necessário preencher body com nome, CPF e data de nascimento"
        );
      }
  
      for (let user of data.clients) {
        if (user.cpf === cpf) {
          throw new Error("CPF já cadastro na base de dados");
        }
      }
  
      if (verifyAge(birthdayDate) >= 18) {
        data.clients.push(newUser);
  
        res.status(201).send( "Usuário cadastrado com sucesso!" );
      } else {
        throw new Error("Cliente não possui idade igual ou superior a 18 anos");
      }
    } catch (error: any) {
      res.status(errorCode).send(error.message);
    }
});
// -- -- -- --  Funcao de pagar uma conta -- -- -- -- //

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
            if(day > DMA[0] && month >= DMA[1] && year >=  DMA[2]){
                // faz nada aqui //
            } else {
                payAccountsValue = payAccountsValue + extract.value
                updateBa = updateBa + extract.value;
            };   
            });
            
            if(findClient.balance >= updateBa) {
            findClient.balance = findClient.balance - updateBa; // aqui é onde esta atualizando o saldo(Balance)
            } else {
            errorCode = 409;
            throw new Error("Saldo insuficiente!");
            }
        };
        updateBalane();
        
        res.status(201).send(`Saldo antigo era de ${beforeUpdateBalance}e o atual é de ${findClient.balance.toFixed(2)},
        apos atualizar  o valor e descontar ${payAccountsValue} de suas contas antigas`)
    } catch(erro: any){
      res.status(errorCode).send(erro.message);
    }
});

// -- -- // -- -- // - // -- // -- // -- // -- // - // -- -- //
app.post("/clients/transfer",(req:Request, res:Response)=>{
    const {name, cpf, nameToTransfer, cpfToTransfer, value} = req.body
    
    const clientAccount = data.clients.filter((client)=>{
        return client.name === name && client.cpf === cpf
    })

    const clientToTransf = data.clients.filter((client)=>{
        return client.name === nameToTransfer && client.cpf === cpfToTransfer
    })

    for(let client of clientAccount){
        client.balance = client.balance - value
    }

    for(let client of clientToTransf){
        client.balance = client.balance + value
    }

    res.send(`Valor de ${value} foi transferido com sucesso para o cliente ${clientToTransf[0].name}`)
});



app.patch("/clients/addBalance",(req:Request, res:Response)=>{
    const {name, cpf, value} = req.body

    const clients = data.clients.filter((client)=>{
        return client.name === name && client.cpf === cpf
    })

    for(let client of clients){
        client.balance = client.balance + value
    }

    res.send(`O valor de R$: ${value} foi adicionado com sucesso...
    Seu saldo atual é de R$: ${clients[0].balance}`)
})

app.listen(3003, () => {
    console.log("Server is running in http://localhost:3003");
});

/*app.post("/clients/createAccount",(req:Request, res:Response)=>{
    const {name, cpf, date,} = req.body
    
    try{

        const yearOfBirth = date.substring(6)
        const actualDate = String(new Date().getFullYear())
        const result = Number(actualDate) - Number(yearOfBirth)

        const cpfExist = data.clients.find((prod)=>{
            return prod.cpf === cpf
        })

        if(result < 18){
            const erro = new Error("Contas somente são criadas se você possuir no minimo 18 anos...")
            erro.name = "ageError"
            throw erro
        }

        if(cpfExist){
            const erro = new Error("Já existe um cliente cadastrado com este CPF...")
            erro.name = "cpfExist"
            throw erro
        }

        if(!name){
            const erro = new Error("Digite o nome do usuario...")
            erro.name = "nameNotFound"
            throw erro
        }
        if(!cpf){
            const erro = new Error("Digite o seu CPF...")
            erro.name = "cpfNotFound"
            throw erro
        }
        if(!date){
            const erro = new Error("Digite sua data de nascimento...")
            erro.name = "dateNotFound"
            throw erro
        }
        data.clients.push(
            {
                idAccount: Math.floor(Math.random() * 999999999999999),
                name:name,
                cpf:cpf,
                date:date,
                balance : 0,
                extract:[
                    {
                        date:"",
                        description:"",
                        value:0
                    }
                ]
            }
        )
        
        res.status(200).send("Parabens.. Agora você é um cliente LabeBank!!")
    }
    catch(e:any){
        if(e.name === "nameNotFound"){ res.status(400).send(e.message)}
        else if(e.name === "cpfNotFound"){ res.status(400).send(e.message)}
        else if(e.name === "dateNotFound"){ res.status(400).send(e.message)}
        else if(e.name === "cpfExist"){ res.status(400).send(e.message)}
        else if(e.name === "ageError"){ res.status(400).send(e.message)}
    }
})*/

// app.post("/client/payment",(req:Request, res:Response)=>{    
//     const { name, cpf, value, description, date } = req.body

//     const clients = data.clients.filter((client)=>{
//         return client.name === name && client.cpf === cpf
//     })
//     for(let client of clients){
//         client.balance -= value
//     }
//     data.clients[0].extract.push(
//         {
//             value:value,
//             description:description,
//             date:date
//         }
//     )

//     res.send(clients)
    
// })

// app.post("/cliente/pagarConta", (req:Request, res:Response) => {
//     let errorCode = 400;
//     try {
//         const cpf = req.query.cpf as string;
//         const {value, description, date} = req.body;
//         const verificarData = regexBR.test(date);
        
//         if(!cpf){
//             errorCode = 422;
//             throw new Error("Passe o cpf do usuario no headers");
//         } else if(!value || !description ){
//             errorCode = 422;
//             throw new Error("Informaçoes faltando, por favor, digite o valor e a descrição ");
//         } else if(typeof(value) !== "number"){
//             errorCode = 422;
//             throw new Error("Digite o valor da conta em numeros");
//         };
    
//         const procurarUsuario = data.clients.find( cliente => cliente.cpf === cpf);

//         if(!procurarUsuario){
//             errorCode = 404;
//             throw new Error("Digite o cpf do usuario ");
//         } else if(procurarUsuario.balance < value){
//             errorCode = 423;
//             throw new Error("Saldo insuficiente!")
//         };
//         const dataAtual = new Date()
//         const dia = dataAtual.getDate();
//         const mes = dataAtual.getMonth() + 1;
//         const ano = dataAtual.getFullYear();
//         if(!date || date.length === 0){ // se não passar uma data, o saldo ja é descontado e a conta ja é paga
//             let novoGasto:allTypes.TypeExtract = {
//                 value: value,
//                 description: description,
//             date: `${dia}/${mes}/${ano}`
//             };
//             data.clients.map( (user) => {
//             if(user.cpf === cpf){
//                 let novoSaldo = user.balance - value;
//                 user.balance = novoSaldo;
//                 user.extract.push(novoGasto)
//             }
//             });
//         } else if(date){
//             const validacaoDeData = () => { 
//             if(!verificarData){ 
//             errorCode = 422;
//             throw new Error("Formato de data incorreto!");
//             } 
//             let d = Number(date.split("/")[0]); // pega o dia da data
//             let m = Number(date.split("/")[1]); // o mes da data
//             let a = Number(date.split("/")[2]); // o ano da data
            
//             if(a < ano){ // Verificação do ano
//                 errorCode = 422;
//                 throw new Error("Ano invalido! Passe uma data de hoje em diante")
//             } else if(d < dia && m === mes && a === ano || d < dia && m < mes && a === ano){ // Verificação do dia
//                 errorCode = 422;
//                 throw new Error("Dia invalido! Passe uma data de hoje em diante") 
//             } else if(d >= dia && m < mes && a === ano){ // Verificação do mes
//                 errorCode = 422;
//                 throw new Error("Mes invalido! Passe uma data de hoje em diante")
//             } else {
//                 let novoGasto:allTypes.TypeExtract = {
//                 value: value,
//                 description: description,
//                 date: date
//                 };
//                 data.clients.map( (user) => {
//                 if(user.cpf === cpf){
//                     user.extract.push(novoGasto)
//                 }
//                 });
//             }
//             };
//             validacaoDeData();
//             regexBR.test(date);
//         }
    
//         res.status(201).send(data.clients)
//         } catch(erro: any){
//         res.status(errorCode).send(erro.message);
//         }
// });