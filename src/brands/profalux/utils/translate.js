export const translateQuestionDatas = (t,tns,datas) => {

    console.log("translateQuestionDatas datas",datas)
     const tt = (key,params) => {
         return t(tns+":"+key,params)
     }

     const translated = datas.reduce((r,v,i) => {
 
             let item = {"question":tt(v?.question),"illustration":v?.illustration};
             const tAnswers = (v.answers).reduce((ar,av,ai) => {
                switch(v.answerType) {
                    case 'numbers' :
                        ar.push(numberTranslation(tt,v.keyName,av));
                        break;
                    default :
                    ar.push(regularTranslation(tt,av))
                }
                // ar.push(ta);
                 return ar;
             },[]);
 
             item.answers = tAnswers;
 
             r.push(item)
 
             return r;
 
     },[])
 
     return translated;
 
 }

 const regularTranslation = (tt,av) => {
    return {'label' : tt(av.label),'value':av.value,...(av.description ? {'description':tt(av.description)} : {})}
                
 }

 const numberTranslation = (tt,key,av) => {
    
    return {'label' : tt(key,{value:av}),'value':av}
                
 }