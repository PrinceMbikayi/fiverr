import moment from 'moment/min/moment-with-locales';
import i18next from 'i18next';



// Get currently active language string
const  activeLanguage = ()=> {
  return i18next.language;
}



/**
 * 
 * @param {*} listClassName 
 * @param {*} types 
 * @returns 
 */
export function getRoutinePossibleObject(listClassName, types){
    //console.log("LIST CLASS ET TYPES :", listClassName, types)
    const result = listClassName.reduce((r,v,i)=>{
      if(types[v]) r.push(...types[v]);
      return r;
    }, [])
    return result
  }

  export function  capitalizeFirstLetter(str){
    // converting first letter to uppercase
    const capitalized = str.charAt(0).toUpperCase() + str.slice(1);
    return capitalized;
  }

  const findDayPosition = (dayIndex)=>{
    let pos = dayIndex - 1;
    if(pos == -1 || pos >6) pos = 0;
    return pos;
}


export function findDayWithTranslation(dayIndex){
    const currentLang = activeLanguage();
    let myDay;
    moment.locale(currentLang)
    const weekdays = moment.weekdays(false)
    const position = findDayPosition(dayIndex)

    console.log("Montre_pos :", position, weekdays[position])
    myDay = weekdays[position]
    return myDay;
}