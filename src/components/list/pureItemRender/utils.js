import {getObjectById} from '_helpers/objects';

export const getId = (itemDatas) => {

    if (itemDatas?.eventId) {
        const eventId= ""+itemDatas.eventId+((itemDatas.eventId.slice(-1) != "/")? "/":"");
        const splitted = eventId.split("/");
        const hasId = (splitted.length > 1) ? "\n\nid : " + splitted[splitted.length - 2] : "";
        console.log("HOOOO PSSS :", hasId)
        return hasId;
    }

    return "";
}

//=================== dependencies ================

export const hasRDependencies = (itemDatas) => {  
  console.log("hasRDependencies check",itemDatas)  
    if (itemDatas?.rDependencies?.groups?.length > 0) return true;
    if (itemDatas?.rDependencies?.applications?.length > 0) return true;
    return false;
}

export const isLastInRType = (itemDatas,dependencyType) => {

    if(!hasRDependencies) return false;

    const whichDependencies = getRDependencies(itemDatas);
    console.log("isLastInRType => whichDependencies",whichDependencies)
    if (whichDependencies?.groups?.length == 0 && whichDependencies?.applications?.length == 0) return false;
    

    const dependencies = whichDependencies?.[dependencyType];
    console.log("dependencyType",dependencyType,"dependencies",dependencies)
    const dependenciesInfos = dependencies.reduce((r,v,i) => {
      console.log("v",v)
        if(v?.components.length == 1 && r.names.indexOf(v?.name) == -1) {
            r.names.push(v?.name);
            r.number = r.number+1;
        }

        return r;
    },{names:[],number:0});


    console.log("dependenciesInfos",dependenciesInfos)

    /*
    let isLastInDependency = [];
    let dNames = [];
    dependencies.map((v, i) => {
      //console.log("isLastInRType >",v)
      if (v.components.length == 1) {
        isLastInDependency.push(v);
        dNames.push(v.name)
      }
    });
    if (dNames.length == 0) return false;
    return { 'names': dNames, 'number': isLastInDependency.length }
    */

    

    if(dependenciesInfos.number == 0)return false;
    return dependenciesInfos;
  }


export const getSingleTypeRDependencies = (itemDatas,type) => {
    
    const hasType = itemDatas?.rDependencies?.[type];
    if (!hasType?.length) return [];
    const rdType = hasType.reduce((r, v, i) => {
      const depId = (v.uri + "").split("/").pop();
      const depDatas = getObjectById(depId);
      if (depDatas == undefined) return r;
      r.push({ 'id': depId, 'name': depDatas.name, components: depDatas.components });
      return r
    }, [])
    return rdType
  }


export const getRDependencies = (itemDatas) => {

    let dependencies = {}
    dependencies['groups'] = getSingleTypeRDependencies(itemDatas,'groups');
    dependencies['applications'] = getSingleTypeRDependencies(itemDatas,'applications');
    return dependencies;
  }
