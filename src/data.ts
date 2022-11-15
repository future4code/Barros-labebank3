import * as allTypes from './types'
import { user } from "./types";

export const clients:allTypes.TypeClients[] = [
    {
        idAccount:111111,
        name:"Admin",
        cpf:"11111111111",
        date:"13/11/1993",
        balance:100,
        extract:[]
    },
    
    {
        idAccount:222222,
        name:"User",
        cpf:"22222222222",
        date:"05/10/1987",
        balance:50,
        extract:[]
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

export const users: user[] = [
    {
      id: 1,
      name: "Vanessa Da Mata",
      cpf: "22233344455",
      birthdayDate: "02/05/1992",
      balance: 555,
      statement: [
        {
          value: 555,
          date: "20/04/2022",
          description: "Depósito em dinheiro",
        },
        {
          value: 77,
          date: "19/05/2021",
          description: "Almoço",
        },
      ],
    },
    {
      id: 2,
      name: "Carlos Alberto",
      cpf: "66677788899",
      birthdayDate: "19/08/1998",
      balance: 840,
      statement: [
        {
          value: 840,
          date: "22/07/2022",
          description: "Depósito em dinheiro",
        },
        {
        value: 55,
        date: "19/05/2021",
        description: "Conta de celular",
      },
      ],
    },
    {
        id: 3,
        name: "Guilherme Teixeira",
        cpf: "99900011122",
        birthdayDate: "05/03/2003",
        balance: 950,
        statement: [
          {
            value: 950,
            date: "29/00/2022",
            description: "Depósito em dinheiro",
          },
          {
          value: 250,
          date: "19/05/2021",
          description: "Loja de roupas",
        },
        ],
      },
  ];