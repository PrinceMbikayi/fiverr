// To be continued
import Toast from 'react-native-root-toast';
import i18n from "i18next";
const noSpace = "noSpace"

const applyRestriction = (restriction,char) => {
    // console.log("restriction",restriction,"("+char+")")
     switch(restriction) {
       case noSpace :   
        if(char == ' ') {
            
            return '';
        }  else {
            return char;
        }              
        // return (char == ' ') ?'':char;                    
         break;
       default :
         return char;
     }
   }

export const restrictField = (e,restriction) => {
     const lastChar = e.slice(-1);
     console.log("lastChar",lastChar)
     const retVal = e.slice(0, -1) + applyRestriction(restriction,lastChar);
     console.log("retVal",retVal);
     if(lastChar == " ") {
      return {val:retVal,msg:"FIELD_NO_WHITESPACE"};
     } else {
      return {val:retVal}
     }
}


let isShown = 0;

export const onChangeWithRulesExternal = (fieldName,restriction) => (values,setFieldValue) => (e) => {
  
  console.log(e)
  //setFieldValue(fieldName,"a")
  
  const retVal = restrictField(e,restriction);
  console.log("retVal",retVal)
  if(values.hasOwnProperty(fieldName))setFieldValue(fieldName,retVal?.val?.trim())
  if(retVal.msg && isShown == 0) {
    isShown = 1;
    Toast.show(i18n.t(retVal.msg),{position: Toast.positions.TOP,duration:1000,onHidden:()=> {isShown = 0}});
  }
  
}