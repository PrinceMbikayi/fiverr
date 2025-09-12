const filterObjectsByType = (objects,typesAllowed,sortBy = 'name',order = 'asc') => {

    console.log("in filterObjectsByType",objects)




    if(typesAllowed == undefined || typesAllowed.length == 0){
       
        typesAllowed = ['Remote_Button','Light','HUE','Application']
    }
   
    const data = objects.loaded.filter((id) => { 
       
        let exclude = typesAllowed.indexOf(objects.entities.objects[id].type) != -1;
        return (exclude)
        }).map((id => id));


    if(sortBy != undefined) {
        console.log("Ben oui",sortBy)
        const compareValues = (key, order = 'asc') => {
  
            return function innerSort(a, b) {
              if (!objects.entities.objects[a].hasOwnProperty(key) || !objects.entities.objects[b].hasOwnProperty(key)) {
                // property doesn't exist on either object
                return 0;
              }
            
              const aO = objects.entities.objects[a];
              const bO = objects.entities.objects[b];
              const varA = (typeof aO[key] === 'string')
                ? aO[key].toUpperCase() : aO[key];
              const varB = (typeof bO[key] === 'string')
                ? bO[key].toUpperCase() : bO[key];
          
              let comparison = 0;
              if (varA > varB) {
                comparison = 1;
              } else if (varA < varB) {
                comparison = -1;
              }
              return (
                (order === 'desc') ? (comparison * -1) : comparison
              );
            };
        }
        return data.sort(compareValues(sortBy,order));
    }
    return data;
}


const getObjectDatas = (state,objectId) => {

  const objectTasks = {}
  
  return state.objects.entities.objects[objectId]
}





export  {
    filterObjectsByType,
    getObjectDatas
}