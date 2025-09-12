import * as Durin from './durin';

async function createAGroup(groupName) {

    const params = {     
        gw: {
          name: "System"
        },
        typeName: "composite",
        //realName: groupName.replace(' ','_')+'_realName',
        name: groupName
      }

    return Durin.add('object',params)
}

/**
*
* @param {*} objectId
* @param {string} objectIds [comma separated ids inside brackets]
*/

async function modifyAGroup (objectId,objectIds) {
  const type = "object";
  const id = objectId;
  console.log("modifyAGroup",objectId,objectIds)
  const params = { actions:[{name:'MODIFY',mArgs:[{"name":"objects","value":JSON.stringify(objectIds)}]}]}
  console.log('GROUP_MODIFY_PARAMS :', params);
  return Durin.update(type,id,params)
}
export {
  
  createAGroup,
  modifyAGroup
};

