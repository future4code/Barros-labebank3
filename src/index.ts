import express, { Request, Response } from "express";
import cors from "cors";
import * as data from "./data"
import { verifyAge } from "./function";
import * as allTypes from "./types";

const app = express();

app.use(express.json());
app.use(cors());

app.get("/clients",(req:Request, res:Response)=>{
    res.send(data.clients)
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

let errorCode = 422;
app.post("/criarConta", (req: Request, res: Response) => {
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
})

app.post("/client/payment",(req:Request, res:Response)=>{
    
    const { name, cpf, value, description, date } = req.body

    const clients = data.clients.filter((client)=>{
        return client.name === name && client.cpf === cpf
    })
    for(let client of clients){
        client.balance -= value
    }
    data.clients[0].extract.push(
        {
            value:value,
            description:description,
            date:date
        }
    )

    res.send(clients)
    
})

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