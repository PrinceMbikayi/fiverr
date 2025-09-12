import React, {Fragment,useContext,useEffect,useState,useRef,useCallback} from 'react';
import { Text,View,Image,ScrollView,SafeAreaView,Alert} from 'react-native'; // use in styled components
import { useSelector,useDispatch } from 'react-redux';
import { useNavigation,useRoute,StackActions } from '@react-navigation/native';

import DeviceInfo from 'react-native-device-info';
import Toast from 'react-native-root-toast';
import { useTranslation } from 'react-i18next';


import { useTheme } from '_theming/themeProvider';
import {getObjectsByIds,getObjectsByTypeName} from '_helpers/selectors';
import {getAllFiles,deleteObjects as ApiDeleteObjects} from '_api/objects';
import{getUser} from '_helpers/selectors';
import { objectDelete } from '_actions/objects';

import {PushNotificationClientsTemplateScreen} from '_brand/templates/screens/account/screens/notificationClients.js';

export const PushNotificationClientsScreen = (props) => {
   
    const { t, i18n } = useTranslation();
    const { theme,baseColors} = useTheme();   
  
    const userDetails = useSelector(state =>getUser(state));
    const clientIds = useSelector(state => getObjectsByTypeName(state,"Mobile")) || [];
   // const title = t('account:NOTIFICATION_CLIENTS');
    const title = t("account:CONNECTED_DEVICE",{'count':clientIds.length});
    const [clients,setClients] = useState([]);
    const [switchStatuses,setSwitchValues] = useState([]);
    const allObjects = useSelector(getObjectsByIds);
  
    const navigation = useNavigation();
    const route = useRoute();
    const navigationParams = route?.params || {}; 
    

    const [selected,setSelected] = useState([])
    const [currentMobile,setCurrentMobile] = useState();
    const defaultLongPressDuration = 1;
    const instantLongPressDuration = 0.1;
    const [longPressDuration,setLongPressDuration] = useState(defaultLongPressDuration);

    const dispatch = useDispatch();


    const doNavigation = (id) => { 
        const params = { 'itemId':id}   
        navigation.navigate("DeviceGallery",params);        
    }
    const doSwitch = () => {
        console.log('doSwitch')
    }
   
   
    useEffect(() => {     
        const initMe = async() => {
                    
        }
        initMe();
    }, []);

   

    const getClientsDatas = () => {
        const uniqueId = DeviceInfo.getUniqueId();
       // console.log("uniqueId",uniqueId);
        let foundCurrentMobile;
        const ret = clientIds.reduce((r,v,i) => {
           
            if(allObjects[v]?.realName == uniqueId) {
                foundCurrentMobile = allObjects[v];
                return r;
            }
            r.push(allObjects[v]);
            return r
        },[]);

        setCurrentMobile(foundCurrentMobile)
        return ret;  
    }

    useEffect(() => {
       console.log('clientIds',clientIds)
       if(clientIds.length > 0) {
            setClients(getClientsDatas());
       }      
    }, [clientIds]);

    useEffect(() => {
        console.log('currentMobile',currentMobile)
            
     }, [currentMobile]);

     useEffect(() => {
        console.log('selected changed',selected);
        setLongPressDuration((selected.length > 0) ? instantLongPressDuration : defaultLongPressDuration);
     }, [selected]);



   const doLongPress = (id) => {
       console.log("notificationClients longpress",id);
       const pos = selected.indexOf(id);
       let newSelection = [...selected]
       if(pos == -1 ) {
        newSelection.push(id)
       } else {
        newSelection.splice(pos,1)
       }
       setSelected(newSelection)
   }
   const unselect = () => {
       setSelected([])
   }


   const deleteObjects = async () => {

    console.log("so deletecselected",selected);
    const deleteResult = await ApiDeleteObjects(selected);
    console.log("deleteResult",deleteResult);
    //delete from store
    const toDeleteFromStore = [...selected];
    toDeleteFromStore.map((v,i) => {
        const action =  objectDelete(v)
        dispatch(action)
    })
    unselect();
   }

   const showAlert = (title, body, buttons) => {
    Alert.alert(
      title,
      body,
      buttons,
      { cancelable: true }
    );

  }

   const deleteObjectConfirm = () => {

    console.log("On efface !!!!")
    
    Toast.show( t("account:DELETE_OBJECT_ALERT_BODY",{count:selected.length}),{
        position: Toast.positions.BOTTOM,
        duration: Toast.durations.LONG,
        animation:true
    
    
    });
    deleteObjects();
  }
  
  return (
    <PushNotificationClientsTemplateScreen {...{currentMobile,clients,title,selected,setSelected,unselect,deleteObjectConfirm,doLongPress,longPressDuration}}/>
  )

}