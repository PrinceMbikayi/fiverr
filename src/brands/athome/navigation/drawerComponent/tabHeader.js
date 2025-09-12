import React from 'react';
import {Text,View,StyleSheet,ScrollView,Dimensions, YellowBox} from 'react-native'

import { useTranslation } from 'react-i18next';
import { Trans } from 'react-i18next'
import { withTheme } from '_theming/themeProvider';

import { useState, useEffect } from "react";
import reducers from '../reducers';
import { useTheme} from '_theming/themeProvider'
import { HeaderWithMenu } from '_components/headers/header-with-menu';

const AtHomeTabHeader= (props) => {
    const { t, i18n } = useTranslation();
    const { theme, navigation} = props;
    const routes = navigation?.state?.routes;
   
    console.log("custom header",props);
    const [name, setName] = useState('John Doe');
    const [inc, setInc] = useState(0);
    const [activeTab,setActiveTab] = useState(0)
    const TAB_BUTTON_WIDTH = Dimensions.get('window').width / 3
    
    const move = (destination,index) => {
        console.log("destination",destination);
        setInc(inc+1)
        setName('alors '+inc)
        setActiveTab(index)
        navigation.navigate(destination);
    }

    return (
       
         
            <ScrollView style={{maxHeight:40,marginTop:-10}} horizontal showsHorizontalScrollIndicator={false}>
                {/*routes.map((route, index) => {
                    let isActive = index == activeTab;
                    return (
                        
                        <View style={[{width:TAB_BUTTON_WIDTH}, isActive ? styles.active : {}]} key={'htk_'+index}>
                            <Button title={t(route.params.title).toUpperCase()}
                                    titleStyle={[styles.button, isActive ? styles.titleActive : {}]}
                                    onPress={() => move(route.key,index)}
                                    type="clear"
                                    containerStyle={styles.buttonContainer}
                            />
                        </View>
                    )}
                    )*/}            
            </ScrollView>
       
    )
}

const styles = StyleSheet.create({                         
    text: {                           
      fontFamily: "UnreadableSans",                           
      fontSize: 24,                           
                      
    },
    button : {
        color:'red',
    }, 
    buttonContainer : {

    }
    , active :{
        borderColor:'red',
        borderBottomWidth:4,
        opacity:0.6,
        
    },
    titleActive : {
        color:'green'
    }
                     
  }); 


export default withTheme(AtHomeTabHeader);