export type TypeClients = {
    idAccount : number,
    name:string,
    cpf:string,
    date:string,
    balance:number,
    extract:TypeExtract[]
}

export type TypeExtract = {
    value:number,
    date:string,
    description:string
}