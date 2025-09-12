

export const sortByIdAndMergeListAtrribute = (data)=>{
  console.log('CLASSEMENT_CONTEXT_SCENARIO_AFTER_TRAIT:', data);
    // const id = Object.keys(data)[0];
    // const elements = Object.keys(data)[1];
    //console.log("ATTRIBUTE :", id, elements)


    //---#####---------FIRST METHOD
    // for(let i=0;i<data.length;i++){
    //   let key = (data[i].id).toString();
    //   for(let j=i+1;j<data.length;j++){
    //     if(data[j].id == key){
    //       data[i].elements  = [...data[i].elements,...data[j].elements];
    //       delete data.splice(j,1);
    //     }
    
    //   }
    // }

    // return data

    //---#####---------SECOND METHOD
    const myData = data.reduce((prev, cur) => {
      const index = prev.findIndex(v => v.id === cur.id);
      if (index === -1) {
         prev.push(cur);
      } else {
          prev[index].elements.push(...cur.elements);
      }
      return prev;
  }, [])
  
  return myData

} 

// const data = [{
//     id: 1,
//     elements: [1, 2]
//   },
//   {
//     id: 1,
//     elements: [3, 4]
//   },
//   {
//     id: 5,
//     elements: ['a', 'b']
//   },
//   {
//     id: 5,
//     elements: ['c', 'd']
//   }, {
//     id: 27,
//     elements: []
//   }]

  // sortByIdAndMergeListAtrribute(data) : will give 
//   const data = [{
//     id: 1,
//     elements: [1, 2, 3, 4]
//   },
//   {
//     id: 5,
//     elements: ['a', 'b', 'c', 'd']
//   },
//  {
//     id: 27,
//     elements:   
//   }]



// LINK : https://stackoverflow.com/questions/58692417/merge-objects-with-same-id-in-array