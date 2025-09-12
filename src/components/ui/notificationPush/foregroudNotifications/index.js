
import React, {useState,useEffect,useRef} from 'react';
import { Text, View,StyleSheet,FlatList, Platform } from 'react-native';
import {useSelector,useDispatch} from 'react-redux';
import {remove as lodashRemove } from 'lodash'
import Swipeable from 'react-native-gesture-handler/Swipeable';
import LottieView from 'lottie-react-native';

import { deleteNotificationPush } from '_actions/notificationPush';

import { VdpNotification } from '_components/objects/doorKeeper/pushNotifications/foregroundNotification';

import ModalContainer from '_brand/templates/components/ui/modal/modalContainer';
import {useGlobalModal} from '_components/ui/globalModal';
import { useTranslation } from 'react-i18next';
import ListItem from './components/listItem';

import SavModal from './components/savAskForAccess';


export const ForegroundNotifications = (props) => {

    //const isReloading = useSelector(state => state.objects.reload)

    const dispatch = useDispatch();

    const {getNavigation,fullscreenProp} = props
    const isReloading = true;
    const p_notifications =  useSelector(state => state.notificationPush.list)
    const vdp_notification = useSelector(state => state.notificationPush.vdp)
    const sav_notification = useSelector(state => state.notificationPush.sav)
    const [regularNotifications,setRegularNotifications] = useState([]);
    //console.log("notifications notifications notifications notifications notifications",p_notifications)
    const iconColor = "white";
    const iconBackgroundColor = "#228B22";
    const iconSize  = 20;

    const globalModal = useGlobalModal();


    useEffect(() => {  
      
      console.log("fullscreenProp",fullscreenProp)
     // setRegularNotifications(p_notifications)           
  }, [fullscreenProp]);


    useEffect(() => {  
      
        console.log("p_notifications",p_notifications)
        setRegularNotifications(p_notifications)           
    }, [p_notifications]);

    useEffect(() => {        
     // setVdpNotification(vdp_notification) 
        console.log("--->> effect vdp_notification",vdp_notification)       
  }, [vdp_notification]);


  /************** SAV  *****************/

  const { t, i18n } = useTranslation();
  const tns = "motor"
  const ModalContent = (props) => {
    return (
        <ModalContainer {...props}/>
    )
}

  const copyCode = () => {

  }

  const shareCode = () => {

  }

  const popupButtons = () => {
    return [
                {label:t(tns+":"+"GENERATE_CODE_POPUP_BUTTON_COPY"),callback:copyCode},
                {label:t(tns+":"+"GENERATE_CODE_POPUP_BUTTON_SHARE"),callback:shareCode,altStyle:true}
            ]
}

const doGenerateCode = () => {
    console.log("doGenerateCode !!!!!!!!!!!")
    const content = <ModalContent 
                        title = {t(tns+":"+"GENERATE_CODE_POPUP_TITLE")}
                        description = {t(tns+":"+"GENERATE_CODE_POPUP_DESCRIPTION")}
                        buttons={popupButtons()}
                        
                    /> 
    globalModal.setContent(content,{type:'centered'});    
    globalModal.toggle();
}





    useEffect(() => {        
      // setVdpNotification(vdp_notification) 
        console.log("--->> effect sav_notification",sav_notification);
        //doGenerateCode()   
  }, [sav_notification]);



    const deleteRow = (uid) => {
       
        let currentRegularNotifications = [...regularNotifications]
        //lodashRemove(currentRegularNotifications, {'timestamp':uid});
      

        let toDelete = lodashRemove(currentRegularNotifications, function(n) {
          return n.timestamp  == uid;
        });

       console.log("deleteRow",JSON.parse(JSON.stringify(currentRegularNotifications)))
        setRegularNotifications([...currentRegularNotifications]);

        dispatch(deleteNotificationPush(uid))

    }

    const onClose = () => {
      console.log("ON CLOSE ME !!!!!!!")
    }


    return (
        <View style={{position:'absolute',width:'100%',height:'100%',flex:1,backgroundColor:'#FFFF0000'}} pointerEvents="box-none">
          { vdp_notification && <VdpNotification message={vdp_notification?.message} getNavigation={getNavigation}/>
          }
          {sav_notification && <SavModal onClose={onClose}/>}
          <View style={{position:'absolute',bottom:10,width:'100%',flex:1,padding:20,backgroundColor:'#FF000000'}} pointerEvents="box-none">

          <FlatList
              data={regularNotifications}
              keyExtractor={(item, index) => item.timestamp}
              renderItem={({item}) => <ListItem {...item} onLeftOpen={deleteRow}/>}
            />
          </View>
        </View> 
    );
}