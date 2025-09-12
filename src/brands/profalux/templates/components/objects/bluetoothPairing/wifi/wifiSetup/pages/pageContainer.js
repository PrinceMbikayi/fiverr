import React,{Children, useEffect} from 'react';
import { View, Text, StyleSheet, TouchableOpacity,Pressable, SafeAreaView } from 'react-native';
import {useTranslation} from 'react-i18next';
import styled, {ThemeProvider} from 'styled-components/native';
import {useTheme} from '_theming/themeProvider';



import ScreenHeader from './header';

import {H1, H1PopUp, H3, P, VSeparator, IllustrationVSeparator} from '_brand/templates/styled';
import Button from '_brand/templates/components/ui/Button';

//------ navigation ------------
import {useNavigation, useRoute} from '@react-navigation/native';
import {StackActions} from '@react-navigation/native';
import { HeaderScreen } from '_brand/templates/screens/addObject/components/HeaderScreen';






//------- popups -----------------



const PageContainer = (props) => {

    const {children, title, withBack=true} = props;
    console.log("PageContainer",props);
    const navigation = useNavigation();
    const route = useRoute();

   




    const {t} = useTranslation();
    const tns = 'addObject';
    
    const {theme, baseColors} = useTheme();


    

    const handleBack = () => {
        console.log("TRY_GOBACK :", route.name, route.params, route);
        navigation.dispatch(StackActions.pop(1));
        //navigation.dispatch(StackActions.pop(1));
        //navigation.dispatch(StackActions.popToTop());
       // navigation.navigate("garageDoorBleAssistantHomeScreen")
    }


    return (
        <SafeAreaView style={{flex: 1,backgroundColor:'white', justifyContent:"center", alignItems:"center"}}>
            <View style={{flex: 1, backgroundColor: 'transparent', marginTop:20,}}>
                 <HeaderScreen title={title} withBack={withBack} goBack={handleBack} />
                <View style={styles.pagerPage}>
                {children}
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
    container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#dc1717',
  },
 
  pagerPage: {
    backgroundColor: 'transparent',
    padding: 16,
    paddingBottom: 0,
  }
});

export default PageContainer;
