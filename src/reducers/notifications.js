import * as ActionsTypes from '_actions/notificationTypes'; 

const objectInitialState = {  
  resources:[],   
}

export default function notificationsReducer(state = objectInitialState, action) {

  const {payload, type} = action;
  //console.log("notificationsReducer",action);

  switch (type) {

    case ActionsTypes.NOTIFICATIONS_FILL : {

       // console.log("dibc bien")
       let newNotifications = payload;
       //console.log("newNotifications",newNotifications)
       
        return {
            ...state, 
            list:newNotifications.list,
            sections:newNotifications.sections
        }
       
    }   

    default:
      return state
  }

}

