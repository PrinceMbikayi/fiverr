import React, {useContext,useEffect} from 'react';
import { ScrollView,SafeAreaView,Linking} from 'react-native';


import { useNavigation,useRoute,StackActions } from '@react-navigation/native';

import { useTranslation } from 'react-i18next';


import { useTheme } from '_theming/themeProvider';
import {AccountHeader} from '../components/header';
import { AccountScreenLine } from '../components/accountLine'; 






export const HelpScreen = (props) => {
   
    const { t, i18n } = useTranslation();
    const { theme,baseColors} = useTheme();
    const title = t('account:HELP');
   const navigation = useNavigation();
   const route = useRoute();
   const navParams = route?.params || {}; 
   


    const doNavigation = (id) => {      
        navigation.navigate(id);        
    }
       
    const externalLinks = {
        faq : t('account:FAQ_URL')
    }


    const doOpenBrowser = (id) => {       
        Linking.openURL(externalLinks['faq'])
    }
   
    useEffect(() => {     
        const initMe = async() => {                    
        }
        initMe();
    }, []);

   
    const {bgColor,textColor,headerBackgroundColor,headerTextColor} = baseColors;

    return (
        <SafeAreaView style={{flex:1,backgroundColor:bgColor}}>
            <AccountHeader title={title} />           
            <ScrollView style={{padding:15,paddingTop:0,flex:1}}> 
                <AccountScreenLine title={t("account:FAQ")} actionType="browser" callback={doOpenBrowser} id="faq"/>
                <AccountScreenLine icon="contact-phone" title={t("account:HOTLINE")} actionType="navigate" callback={doNavigation} id="Hotline"/>        
            </ScrollView>
        </SafeAreaView>     
                    
        )
}