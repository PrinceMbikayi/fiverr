  
import {SCENARIOS_FILL,SCENARIO_UPDATE,GET_SCENARIO} from '../actions/scenarios'

const initialState = {
  entities:{},
  objectsByTypeNames:{},
}

export default function scenariosReducer(state = initialState, action) {
  const {payload, type} = action;

   
  
  switch (type) {

    case SCENARIOS_FILL: {
       console.log('dans scenario fill')
        return {
            ...state,
            entities:payload.rooms.entities.rooms,
            arr:payload.rooms.result

           
        }
       
    }
    case GET_SCENARIO: {

      return state;
     
    }
    // case SCENARIO_UPDATE: {

    //   let path = 'entities.objects.'+payload.id;
    //   console.log('BEN UPDATE',payload.name);
    //   console.log(payload.name,payload.id);
    //   //console.log("state.rooms",state.rooms)

    //   const entities =  state.entities;
    //   const entity = state.entities[payload.id]

    //   return {
    //     ...state,
    //     entities: {
    //       ...entities,
    //       [payload.id]:{
    //         ...entity,
    //         ...payload
    //       } 
    //     }
    //   }
    // }


    default:
      return state
  }
}