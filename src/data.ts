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
            date: "10/11/2022"
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
            date: "09/11/2022"
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
            date: "07/11/2022"
          }
        ]
      },
]

// export const extract:allTypes.TypeExtract[] = [
        // {
        //     idClient:111111,
        //     value:0,
        //     date:"",
        //     description:"",
        // }
// ]*/

// export const users: user[] = [
//     {
//       id: 1,
//       name: "Vanessa Da Mata",
//       cpf: "22233344455",
//       birthdayDate: "02/05/1992",
//       balance: 555,
//       statement: [
//         {
//           value: 555,
//           date: "20/04/2022",
//           description: "Depósito em dinheiro",
//         },
//         {
//           value: 77,
//           date: "19/05/2021",
//           description: "Almoço",
//         },
//       ],
//     },
//     {
//       id: 2,
//       name: "Carlos Alberto",
//       cpf: "66677788899",
//       birthdayDate: "19/08/1998",
//       balance: 840,
//       statement: [
//         {
//           value: 840,
//           date: "22/07/2022",
//           description: "Depósito em dinheiro",
//         },
//         {
//         value: 55,
//         date: "19/05/2021",
//         description: "Conta de celular",
//       },
//       ],
//     },
//     {
//         id: 3,
//         name: "Guilherme Teixeira",
//         cpf: "99900011122",
//         birthdayDate: "05/03/2003",
//         balance: 950,
//         statement: [
//           {
//             value: 950,
//             date: "29/00/2022",
//             description: "Depósito em dinheiro",
//           },
//           {
//           value: 250,
//           date: "19/05/2021",
//           description: "Loja de roupas",
//         },
//         ],
//       },
//   ];