export const ROOMS_FILL = 'ROOMS::FILL';
export const ROOM_UPDATE = 'ROOM::UPDATE';
export const GET_ROOM = "ROOM::GET";
export const ROOM_DELETE = "ROOM::DELETE";
export const ROOM_REMOVE_OBJECT = "ROOM::REMOVE::OBJECT";

export const roomsFill = rooms => ({
  type: ROOMS_FILL,
  rooms
})

export function roomUpdate(data) {

  console.log("ACTION UPDATE :", data)
  return {
    type: ROOM_UPDATE,
    payload: { id: data.id, name: data.name, objects: data.objects, default: data.default }
  };
}

export function updateRoomObject(objectId, oldRommId, newRoomId,) {

  //console.log("ACTION UPDATE :", data)
  return {
    type: ROOM_UPDATE,
    payload: { id: data.id, name: data.name, objects: data.objects, default: data.default }
  };
}

export function roomRemoveObject(roomId, objectId){

  console.log("ROOM REMOVE OBJECT IN ACTION:", roomId, objectId)
   return {
    type: ROOM_REMOVE_OBJECT,
    payload: {id:roomId, objectId : objectId}
   }
}

export function getRoom(roomId) {

  return {
    type: GET_ROOM,
    payload: { roomId: roomId }
  }
}

export function roomDelete(roomId) {
  return {
    type: ROOM_DELETE,
    payload: { roomId: roomId }
  }
}
