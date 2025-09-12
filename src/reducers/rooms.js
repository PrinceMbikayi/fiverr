  
import {ROOMS_FILL,ROOM_UPDATE,GET_ROOM, ROOM_DELETE, ROOM_REMOVE_OBJECT} from '../actions/rooms'

const userInitialState = {
  entities:{}
}

export default function roomsReducer(state = userInitialState, action) {
  const {payload, type} = action;

   
  
  switch (type) {

    case ROOMS_FILL: {
       console.log('dans rooms fill')
        return {
            ...state,
            entities:payload.rooms.entities.rooms,
            arr:payload.rooms.result

           
        }
       
    }
    case 'GET_ROOM': {

      return state;
     
    }
    case ROOM_UPDATE: {
      console.log('BEN UPDATE',payload.name);
      console.log(payload.name,payload.id);
      console.log("state.rooms",state.rooms)
      
      //state.entities
      const entities =  state.entities;
      console.log("STATE ENTITIES ",entities)
      const entity = state.entities[payload.id]
      console.log("STATE REFRESH ",entity?.objects, payload)
      const id = payload.id;
      const name = payload.name;
      const objects = payload.objects;
      const isDefault = payload.default;

      //id:id, name:name, objects: objects, default: isDefault

      return {
        ...state,
        entities: {
          ...entities,
          [payload.id]:{
            id:id, name:name, objects: objects, default: isDefault
          }         

        }
        
      }
    }


    case ROOM_REMOVE_OBJECT : {
      const entities =  state.entities;
      //const id = payload.id;
      //const roomObjects = payload.roomObjects
      const objectId = payload.objectId
      const roomId = payload.id;
      // const name = payload.name;
      // const objects = payload.objects;
      // const isDefault = payload.default;
      console.log("ROOM REMOVE OBJECT IN REDUCER:", entities[payload.id].objects)
      //console.log("ROOM REMOVE OBJECT IN REDUCER:", payload.id, objectId)
      

      return {
        ...state,
        entities: {
          ...entities,
          [payload.id]:{
            ...entities[payload.id], objects: (entities[payload.id].objects).filter(id => id != objectId)
          }         
        }
        
      }
    }
  
  //---------------------
    case ROOM_DELETE : {

      //return state;
      const {roomId} = payload;     
      // const loadedPath = 'loaded';     
      // const roomPath = getRoomPath(roomId);
      // console.log("ROOM PATH :", roomPath)
      // console.log("ROOM STATE :", JSON.parse(JSON.stringify(state)))
      // test = dotProp.get(state, "entities[\"10584\"]");
      // console.log("PASSSSS")

    const entities = state.entities;
 
    const keys = Object.keys(entities)
      console.log("KEYS :", keys)


    const deleteMe = (val) => {
        const result = keys.reduce((r,v,i) => {
            if(v != val)r[v] = entities[v]
              return r;
            }
        ,{})
  
        return result;
        }
 
    const newValues = JSON.parse(JSON.stringify(deleteMe(roomId)));
    console.log("NEW VALUES :", newValues)
    //dotProp.set(state, 'entities', newValues);

    return {
      ...state,
      entities: {
        ...newValues,
      }
      
    }
      

    }

    default:
      return state
  }
}

const getRoomPath  = (roomId) => {
  return 'entities['+roomId+']';
}