import { createSelector } from 'reselect'
import { useSelector} from 'react-redux'
import { AppConfig } from '../config'

const objectsDatas = state => state.objects.entities.objects;
const objectsIdsDatas = (state,props) => state.rooms.entities[props.roomId].objects;


const makeGetVisibleObjects = () => {

    return createSelector(
        [objectsDatas,objectsIdsDatas],
        (objects,ids) => {    
            console.log("computing makeGetVisibleObjects")
            var filtered = ids.filter(function(id) {
                //console.log("filtering "+id);
                return AppConfig.HIDDEN_OBJECTS.indexOf(objects[id].type) == -1;
            });
            filtered.sort((a,b) => (objects[a].name.toLowerCase() > objects[b].name.toLowerCase()) ? 1 : ((objects[b].name.toLowerCase() > objects[a].name.toLowerCase()) ? -1 : 0));
           

            return filtered;
        }
    )
}


const singleObjectSelector = (id) => {

}


const getObject = (id) => {
    console.log("dans le getObject (",id,")")
    return useSelector(state => state.objects.entities.objects[id])
}




export { makeGetVisibleObjects,getObject }

