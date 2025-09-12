import React from 'react';
import {useContext,useState,useEffect} from 'react';
import { Text, View ,ScrollView,SafeAreaView,Button,Alert} from 'react-native';
import { connect,useSelector,useDispatch,shallowEqual} from "react-redux";
import { useTranslation } from 'react-i18next';
import { useNavigation,useRoute,StackActions } from '@react-navigation/native';

import Accordion from 'react-native-collapsible/Accordion';

import {getNotifications as getNotificationsAction} from '_actions/notifications';
import { useTheme} from '_theming/themeProvider'
import { HeaderWithMenu } from '_components/headers/header-with-menu';
import {HeaderWithBack} from '_components/headers/header-with-back';


import {NotificationItem} from './notificationItem';


export const NotificationsScreen = (props) => {
   

    const { t, i18n } = useTranslation();
    const {theme,baseColors} = useTheme();
    const {bgColor,textColor,headerBackgroundColor,headerTextColor} = baseColors;
    const navigation = useNavigation();
    const route = useRoute();
    const navParams = route?.params || {}; 
    const {header} = navParams;
    console.log("navParams",navParams)


    const dispatch = useDispatch();
   
    const notificationSections = useSelector(state => state.notifications.sections)|| [{title:'loading...',content:[]}];
    const [activeSections,setActiveSections] = useState([0]);
    const [permissions, setPermissions] = useState({});


    useEffect(() => 
    {
      const unsubscribe =  navigation.addListener('focus', () => {
        console.log("focused !!! ")
        dispatch(getNotificationsAction());
      });
      return () => { console.log("unsubscibe me");unsubscribe();console.log("unsubscibe done")}
     },[navigation]);


    
    // render 
    const _renderSectionTitle = section => {
        return (
          <View style={styles.content}>
            <Text>{section.content.title}</Text>
          </View>
        );
      };
    
    const   _renderHeader = section => {
        return (
          <View style={styles.header}>
            <Text style={styles.headerText}>{section.title}</Text>
          </View>
        );
      };
    
    const   _renderContent = (section) => {
        const data = section.content;
        return (
            <>           
            {
                data.map((v,i) => {
                    return (
                      <NotificationItem data={v}/>                     
                    )                   
                })            
            }
            </>           
        );
      };
    
    const   _updateSections = (activeSections) => {      
        setActiveSections(activeSections);        
      };
      
     const  styles = {
                        header:{backgroundColor:textColor,padding:5},
                        headerText:{color:bgColor}            
                    
                    }
    
    const goBack = () => {
      navigation.goBack();
    }

    const backgroundColor = 'red';
    return (
        <SafeAreaView style={{flex:1,backgroundColor:theme['color--bg']}}>
             <View style={{height:84,minHeight:84,alignItems:'center',justifyContent:'center'}}>
              {(header == "back") ? (
                 <HeaderWithBack title={t('MENU_NOTIFICATIONS')} goBack={{action:goBack}} themeDependency/>
              ) : (
                <HeaderWithMenu title={t('MENU_NOTIFICATIONS')} />
              )
              
              }
               
            </View>  
            <View>
         
          </View>         
            <ScrollView style={{flex:1,padding:15,paddingTop:0}}>
           
            <Accordion
                            sections={notificationSections}
                            activeSections={activeSections}
                            renderSectionTitle={_renderSectionTitle}
                            renderHeader={_renderHeader}
                            renderContent={_renderContent}
                            onChange={_updateSections}
            />
            </ScrollView>           
        </SafeAreaView>   
   
)
    };

//export default NotificationsScreen;

const titleStyle = {}