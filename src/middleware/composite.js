import {SCENARIO_UPDATE,GET_SCENARIO,SCENARIOS_FILL} from '../actions/scenarios';

import dotProp from 'dot-prop-immutable';


const compositeMiddleware = (store) => (next) => (action) => {
    console.log("in compositeMiddleware",action);
    switch(action.type) {

      case SCENARIOS_FILL :
          console.log('in middleware composite')
        next(action)
        break;
      default:
        console.log('bn ben default',action);    
        next(action)
    }
  }
 
  export default compositeMiddleware