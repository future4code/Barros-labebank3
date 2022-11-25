export const verifyAge = (birthdayDate: string) => {
    const currentDate = new Date();
    const birthday = Number(birthdayDate.substr(0, 2));
    const birthdayMonth = Number(birthdayDate.substr(3, 2));
    const birthdayYear = Number(birthdayDate.substr(6));
    const nowDay = currentDate.getDate();
    const nowMonth = currentDate.getMonth() + 1;
    const nowYear = currentDate.getFullYear();
    let age = nowYear - birthdayYear;
    if (nowMonth <= birthdayMonth) {
      if (nowDay < birthday) {
        return age - 1;
      } else {
        return age;
      }
    } else {
      return age;
    }
  };
  
  export const convertDate = (date: string) => {
    let split = date.split("/");
    let res = [split[1], split[0], split[2]].join("/");
  
    return res;
  };
  
  export const nowDate: string = new Date().toLocaleDateString();


// Essa função abaixo faz uma verificação na datas que o usuario coloca na hora de pagar conta
// PS: caso seja inserido uma data anterio a data atual ele vai retornar o aviso da data invalida e qual parameto esta invalido, se é o dia, mes ou ano
export const dateVerify = (data:string)  => {
  const regexBR = new RegExp(/^(((0[1-9]|[12]\d|3[01])\/(0[13578]|1[02])\/((19|[2-9]\d)\d{2}))|((0[1-9]|[12]\d|30)\/(0[13456789]|1[012])\/((19|[2-9]\d)\d{2}))|((0[1-9]|1\d|2[0-8])\/02\/((19|[2-9]\d)\d{2}))|(29\/02\/((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|(([1][26]|[2468][048]|[3579][26])00))))$/g);
  const currentDate = new Date()
  const day = currentDate.getDate();
  const month = currentDate.getMonth() + 1;
  const year = currentDate.getFullYear();

  // DMA D = dia, M = mes, A = ano
  const DMA: number[] = [day,month,year];
  let codeErr:number = 400;
  let errorMsg:string = "";
  let validDate: boolean = false;

  const verificarData = regexBR.test(data);
  if(!verificarData){ 
    codeErr = 422;
    errorMsg = "Formato de data incorreto!";
  } 
  let d = Number(data.split("/")[0]); // pega o dia da data
  let m = Number(data.split("/")[1]); // o mes da data
  let a = Number(data.split("/")[2]); // o ano da data

  if(a < year){ // Verificação do ano
    codeErr = 422;
    errorMsg = "Ano invalido!";
  } else if(d < day && m === month && a === year || d < day && m < month && a === year){ // Verificação do dia
    codeErr = 422;
    errorMsg = "Dia invalido! " ;
  } else if(d >= day && m < month && a === year){ // Verificação do mes
    codeErr = 422;
    errorMsg = "Mes invalido!";
  } else {
    validDate = true;
  }
  regexBR.test(data);
  return {validDate, codeErr, errorMsg, DMA}
};  