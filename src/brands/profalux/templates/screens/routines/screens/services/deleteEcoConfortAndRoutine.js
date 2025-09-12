import * as ApiObjects from "_api/objects"
import * as Actions from '_actions/objects';
import { myToast } from '_brand/templates/components/ui/myToast';
import { refreshObjectAction } from '_actions/asyncActions';
import store from '_store';
import { deleteObject } from '_api/objects';



export async function deleteEcoConfortAndRoutine(id, weeklyPlannerId){
    const res = await ApiObjects.deleteObject(id).catch((err) => console.log(err));
    console.log('DELETE_ROUTINE_SERVER_RESPONSE :', res);
    if (res.errCode == 200) {
      const action = Actions.objectDelete(id);
      dispatch(action);
    } else if (res.errCode == 403) {
      console.log('DELETE_ECOCONFORT_FAILED :', res);
      // const action = { "mArgs": [{ "value": id.toString(), "name": "objectId" }], "name": "REMOVE_OBJECT" }
      // const requestRemoveRoutineFromPlanner = await ApiObjects.createWeeklyPlanner(action);
      // console.log('DELETE_ROUTINE_REMOVE_PLANNER :', requestRemoveRoutineFromPlanner);

      // if (requestRemoveRoutineFromPlanner.errCode == 200) {
        
      //   const res = await ApiObjects.deleteObject(id).catch((err) => console.log(err));
      //   console.log('DELETE_ROUTINE_DELETE_PASS_RESPONSE :', res);
      //   if (res.errCode == 200) {
      //     const action = Actions.objectDelete(id);
      //     dispatch(action);
      //     const refreshWeeklyPlanner = await refreshObjectAction(weeklyPlannerId, store).catch((err) => console.log("ERROR_REFRESH_WEEKLY_PLANNER :",err)); 
      //   }
      // } else {
      //   console.log('REMOVED_ROUTINE_FROM_WEEKLYPLANNER_FAILED :', requestRemoveRoutineFromPlanner);
      // }

    }else{
      console.log('DELETE_ECOCONFORT_FAILED_2 :', res);
    }
    return res;

  }