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