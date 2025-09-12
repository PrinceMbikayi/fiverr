import '_brand/templates/screens/_locales'
// import '_screens/account/locales';
// import './_locales'
//------- then FC -------------------------
import React, {useContext,useEffect,useState,useRef,useCallback} from 'react';
import { Text,View,Image,ScrollView,SafeAreaView} from 'react-native'; // use in styled components
import { useSelector,useDispatch } from 'react-redux';

import { useNavigation,useRoute,StackActions } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import DeviceInfo from 'react-native-device-info';
import { useTheme } from '_theming/themeProvider';
import{getUser} from '_helpers/selectors';
import {AccountHeader} from './components/header';
import { AccountScreenLine } from './components/accountLine'; 

import { HeaderWithMenu } from '_components/headers/header-with-menu';

import {AutomatedTestIdDisplay} from '_components/objects/@common/testAutomation/AutomatedTestId';
//import {PageBody,OverBody} from '../../../styled/index';
import {PageBody,OverBody} from '../../styled';
import AddCircle from '_brand/images/icons/app/AddCircle';

import {ClientServiceNotice} from './components/clientServiceNotice';




export const AccountHome= (props) => {
   

  

    const dispatch = useDispatch();
    const { t, i18n } = useTranslation();
    const { theme,changeTheme,themeID,baseColors} = useTheme();
    const title = t("MENU_ACCOUNT");
    const userDetails = useSelector(state =>getUser(state));
    console.log("userDetails",userDetails);

  
   const navigation = useNavigation();
   const route = useRoute();
   const navParams = route?.params || {}; 
    
    const uniqueName = DeviceInfo.getUniqueId();
    const bottomModalRef = useRef()

    const [selectTest,setSelectTest] = useState(false)

    const doNavigation = (id) => {

        console.log("doNavigation",id)
        switch(id) {
            case "profile":
               
                navigation.navigate("ChangePassword");
                break;
            case "gallery":
                navigation.navigate("GalleryHome");
                break;
            case "wifi":
                navigation.navigate("WifiSettings");
                break;

            case "select" :
                setSelectTest(!selectTest);
                break;
           
            case "clientService" :
                navigation.navigate("ClientService");
                break;
            default:
                navigation.navigate(id);
                break;
        }
    }

    const [dm,setDm] = useState((themeID == "DARK"));

    console.log("themeID",themeID)

    const doSwitch = (id,value) => {
        console.log("id",id,"value",value);
        changeTheme();
        setDm(!dm);
    }


    const {bgColor,textColor,headerBackgroundColor,headerTextColor} = baseColors;

    return (
        <SafeAreaView style={{flex:1,backgroundColor:theme.primary_2_darker || 'black' || theme['body-with-cards']}}>
            <View style={{minHeight:84}}>
            <HeaderWithMenu title={title} noShadow bgColor="transparent" hideBurger /> 
            </View>
            <ClientServiceNotice/>   
            <PageBody> 
                <OverBody pointerEvents='box-none'/>
               
                <ScrollView style={{padding:15,paddingTop:0,backgroundColor:"transparent",flex:1}}>     
                    {/*<AccountScreenLine fullTouchable={true} title={userDetails?.login} nosubTitle="coucou" actionType="navigate" callback={doNavigation} id="profile"/>*/}
                    <AccountScreenLine fullTouchable={true} title={t("account:PROFILE")} nosubTitle="coucou" actionType="navigate" callback={doNavigation} id="profile"/>
                    
                    {/*<AccountScreenLine icon="gallery" fullTouchable={true} title={t('account:GALLERY')} actionType="navigate" callback={doNavigation} id="gallery"/>*/}
                    {/*<AccountScreenLine title={t("account:DARK_MODE")} actionType="switch" callback={doSwitch} value={dm} id={"dm"} 
                                switchActiveColor={theme["greenValid"] || "green"}/>*/}
                    <AccountScreenLine no_icon="mobile" fullTouchable={true} title={t('account:CONNECTED_DEVICE_plural')} actionType="navigate" callback={doNavigation} id="PushNotificationClients"/>                
                    <AccountScreenLine fullTouchable={true} title={t("account:ASSISTANTS")} nosubTitle="coucou" actionType="navigate" callback={doNavigation} id="profile"/>
                    <AccountScreenLine fullTouchable={true} title={t("account:SHARE_ACCOUNT")} nosubTitle="coucou" actionType="navigate" callback={doNavigation} id="profile"/>
                    <AccountScreenLine fullTouchable={true} title={t("account:CLIENT_SERVICE")} nosubTitle="coucou" actionType="navigate" callback={doNavigation} id="clientService"/>
                    <AccountScreenLine fullTouchable={true} title={t("addProduct:WIFI_CONFIGURATION")} actionType="navigate" callback={doNavigation} id="wifi"/>               
                    <AccountScreenLine title={t("account:LEGAL_INFORMATIONS")}  fullTouchable={true} actionType="navigate" callback={doNavigation} id="Legal"/>                 
                    <AccountScreenLine fullTouchable={true} title={t("account:HELP")} actionType="navigate" callback={doNavigation} id="Help"/> 
                    <AccountScreenLine fullTouchable={true} title={t("account:REPORT_ERROR")} actionType="navigate" callback={doNavigation} id="Help"/> 
                   
                    {/*<AccountScreenLine title={"Test Select"}  fullTouchable={true} actionType="select" callback={doNavigation} value={selectTest} id="select"/> */} 
                </ScrollView> 
            </PageBody>             
        </SafeAreaView>
        )
}
