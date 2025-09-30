
import * as types from '_actions/notificationTypes';
import {getNotifications } from '_api/notifications';

const notificationMiddleware = (store) => (next) => (action) => {
  console.log('INSIDE_MIDLEWARE_NOTIFICATIONS',action);
  

    const {type,payload} = action;

    switch(action.type) {

      case types.NOTIFICATIONS_GET :
         
        getNotifications().then((res)=> {
            console.log("in middleware NOTIFICATIONS_GET",res);
            switch(res.errCode) {
                case 200 :
                    console.log("before dispatch")
                    store.dispatch({type:types.NOTIFICATIONS_FILL,payload:res.data})
                    break;
                case -1 :
                    
                
                    break;
                case 401 : 
                /*
                //console.log("demande suite 401")
                    checkUserIsGranted().then((res) => {                 
                    store.dispatch(appRefresh())
                    },(err)=> {
                    //console.log("USer is NOT Granted !!!",err)
                    })
                    //console.log("call done !!!!!!")
                    */
                    break;

                
            }
          })
          //console.log("get Objects called")
          break;

      
      default:
        //console.log('apiMiddleware default, just next',action);    
        next(action)
    }
  }


  
   
  export default notificationMiddleware