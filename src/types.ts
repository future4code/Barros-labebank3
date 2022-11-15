export type TypeClients = {
    idAccount : number,
    name:string,
    cpf:string,
    birthdayDate:string,
    balance:number,
    extract:TypeExtract[]
}

export type TypeExtract = {
    value:number,
    date:string,
    description:string
}

//---------------------------------------------------------------
export type user = {
    id: number;
    name: string;
    cpf: string;
    birthdayDate: string;
    balance: number;
    statement: changeAccount[];
  };
  
  type changeAccount = {
    value: number;
    date: string;
    description: string;
  };