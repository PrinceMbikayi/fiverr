// import {ADD_SCHEDULER} from '../actions/scheduler'
// import dotProp from 'dot-prop-immutable';


// const objectInitialState = {
//     objectsByTypeNames:{},
//   }

// export default function objectsReducer(state = objectInitialState, action) {
//     const {payload, type} = action;


//     switch (type) { 
//         // for (let [key, value] of Object.entries(objectsByTypeNames)) {
//         //     state = dotProp.merge(state,'objectsByTypeNames.'+key,value)
//         // }


//         case ActionsTypes.GATEWAY_ADD :{

//             const id = payload.id;
//             state = dotProp.merge(state,'objectsByTypeNames.SchedulerTask',id)
//             return state;
//             break;
//         }

//         case ADD_SCHEDULER :{
//             const id = payload.id;
//             state = dotProp.merge(state,'objectsByTypeNames.SchedulerTask',id)
//             return state;
//             break;
//         }


//         default:
//             return state
//     }

// }