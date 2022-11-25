import * as allTypes from './types'

export const clients:allTypes.TypeClients[] = [
    {
        idAccount:111111,
        name:"Admin",
        cpf:"11111111111",
        birthdayDate:"13/11/1993",
        balance:100,
        extract:[]
    },
    
    {
        idAccount:222222,
        name:"User",
        cpf:"22222222222",
        birthdayDate:"05/10/1987",
        balance:50,
        extract:[]
    },
    { 
        idAccount: 112233,
        name: "Diego",
        cpf: "08298278224" ,
        birthdayDate: "09/03/1999",
        balance: 800,
        extract: [
          { value: 35,
            description: "Conta de agua",
            date: "10/11/2022"
          },
          { value: 63.40,
            description: "Conta de energia",
            date: "10/11/2022"
          },
          { value: 59.90,
            description: "Internet",  
            date: "10/12/2022"
          },
          { value: 800,
            description: "Depósito de dinheiro",
            date: "10/10/2022"
          }
        ]
      },
      { 
        idAccount: 223311,
        name: "Emmanuel",
        cpf: "12345678901",
        birthdayDate: "22/10/1995",
        balance: 760,
        extract: [
          { value: 44.40,
            description: "pizza",
            date: "25/09/2022"
          },
          { value: 22,
            description: "remedios",
            date: "09/12/2022"
          },
          { value: 760,
            description: "Depósito de dinheiro",
            date: "09/07/2022"
          }
        ]
      },
      { 
        idAccount: 332212,
        name: "Jose",
        cpf: "02133490145",
        birthdayDate: "17/12/1990",
        balance: 560,
        extract: [
          { value: 244.27,
            description: "Compra no mercado",
            date: "02/11/2022"
          },
          { value: 27.50,
            description: "Gasolina",
            date: "02/11/2022"
          },
          { value: 57,
            description: "Compra de um short",
            date: "07/11/2023"
          },
          {
            value: 550,
            description: "Depósito de dinheiro",
            date: "15/10/2022"
          }
        ]
      },
]
