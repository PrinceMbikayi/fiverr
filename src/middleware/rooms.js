import { difference as lodashDifference, pull as lodashPull } from 'lodash';



const getDefaultRoom = (rooms)=>{

  let defaultRoom;
  Object.keys(rooms).forEach((key,index)=>{
    console.log('KEY :', key, rooms[key]?.default);
    if( rooms[key]?.default)  defaultRoom = rooms[key]

  })
  return defaultRoom
}

const roomsMiddleware = (store) => (next) => (action) => {
    //console.log("roomsMiddleware: ", action);
      const {type,payload} = action;
      const selection = payload?.objects
      switch(type) {
        // case "ROOM::UPDATE" :
        //   {
        //     const rooms = store.getState().rooms?.entities;
        //     const previousRoomObjects = rooms[(payload?.id)]?.objects
        //     const defaultRoom = getDefaultRoom(rooms)

        //     console.log('NEW_DEF :', defaultRoom);

        //     const toRemove =  lodashDifference(previousRoomObjects, selection)
        //     const toAdd = lodashDifference(selection, previousRoomObjects)

        //     const newDefaultRoomObjects = [...defaultRoom?.objects, ...toRemove]
        //     console.log('NEW_DEF :', newDefaultRoomObjects);

        //     let defaultAction = {type:action.type, payload:{id:defaultRoom?.id, name:defaultRoom?.name, objects:newDefaultRoomObjects, default:true}}
        //     next(defaultAction)

        //     let currentAction = {type:action.type, payload:{id:payload?.id, name:payload?.name, objects:selection, default:false}}
        //     next(currentAction)


        //     console.log('STATE_MIDLEWARE :', JSON.stringify(previousRoomState?.objects), JSON.stringify(payload?.objects));
        //     console.log('STATE_MIDLEWARE :', toRemove, toAdd);

        // }
        // break;
      default:  
          //console.log(" DEFAULT NEX ACTION : ")     
          next(action)
      }
    }



    export default roomsMiddleware