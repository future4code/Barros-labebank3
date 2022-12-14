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
