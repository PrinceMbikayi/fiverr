
/**
 * 
 * @param {*} listClassName 
 * @param {*} types 
 * @returns 
 */
export const getGroupPossibleObject = (listClassName, types)=>{
    //console.log("LIST CLASS ET TYPES :", listClassName, types)
    const result = listClassName.reduce((r,v,i)=>{
      if(types[v]) r.push(...types[v]);
      return r;
    }, [])
    return result
  }