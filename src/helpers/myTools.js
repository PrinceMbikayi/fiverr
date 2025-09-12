import {appRoutesNames} from '_config/AppConfig'
import {CommonActions} from '@react-navigation/native';

export const useMyTools = () => {

    
    const goSchedule = (itemId,datas,title,navigation,associatedAction) => {
        

        const params = {   'itemId':itemId,
            'taskName':datas.name,
            'taskObject':datas.object,
            'initTime':datas.taskTime,
            'days':datas.taskDays,
            'datas':datas,
            'title' : title,
            'associatedAction':associatedAction
        } 

       navigation.navigate('ProductSchedule',params)
    }

    const goDelay = (itemId,datas,title,navigation) => {
        console.log("goDelay !!!")
        navigation.navigate('ProductDelay',{   itemId:itemId,
            'taskName':datas.name,
            'taskObject':datas.object,
            'initTime':datas.taskTime,           
            'title' : title
        })
    }
   

    const resetStackAndGo = (navigation,stackName,stackInitial,destination) => {

        const _stackName = stackName || appRoutesNames.ADD_PRODUCT
        const _stackInitial = stackInitial || "AddProduct";
        const _destination = destination || "Home";

        /* v4 
        const resetCurrentStackAction = StackActions.reset({
            key: _stackName,
            index: 0,
            actions: [NavigationActions.navigate({ name: _stackInitial })],
          });
          */

        const resetCurrentStackAction = CommonActions.reset({
         
           routes: [
            { name: _stackInitial }]
          });

        navigation.dispatch(resetCurrentStackAction);
        setTimeout(()=> {navigation.navigate(_destination)},0);
         
    }


    return { 
         
        navigateToSchedule : (itemId,datas,title,navigation,associatedAction) => (goSchedule(itemId,datas,title,navigation,associatedAction)),
        navigateToDelay : (itemId,datas,title,navigation) => (goDelay(itemId,datas,title,navigation)),
        navigateToNewProduct : (navigation,stackName,stackInitial,destination) => (resetStackAndGo(navigation,stackName,stackInitial,destination))
  
    }
       
  }
