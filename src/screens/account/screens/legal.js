import React, {useEffect} from 'react';
import {ScrollView,SafeAreaView,Linking} from 'react-native'; // use in styled components


import { useTranslation } from 'react-i18next';

import { useTheme } from '_theming/themeProvider';
import {AccountHeader} from '../components/header';
import { AccountScreenLine } from '../components/accountLine'; 


export const LegalScreen = (props) => {
   
    const { t, i18n } = useTranslation();
    const { theme,baseColors} = useTheme();
    const title = t('account:LEGAL_INFORMATIONS');
  
       
    const doOpenBrowser = (id) => {
       
        const url = t('account:'+id+'_URL');
        if(url && url.length > 0)Linking.openURL(url)
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
                <AccountScreenLine title={t("account:CGU")} actionType="browser" callback={doOpenBrowser} id="CGU"/>
                <AccountScreenLine title={t("account:TERMS")} actionType="browser" callback={doOpenBrowser} id="TERMS"/>
                <AccountScreenLine title={t("account:PRIVACY")} actionType="browser" callback={doOpenBrowser} id="PRIVACY"/>
            </ScrollView>
        </SafeAreaView>     
                    
        )
}