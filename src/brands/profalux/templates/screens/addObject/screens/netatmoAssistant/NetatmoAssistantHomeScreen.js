import '_brand/templates/screens/addObject/locales'
import React,{ useState,useRef, useEffect } from 'react';
import { View,Text,StyleSheet,SafeAreaView, ActivityIndicator, Image} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { WebView } from 'react-native-webview';
import PagerView from 'react-native-pager-view';
import { useTheme } from '_theming/themeProvider';
import Button from '_brand/templates/components/ui/Button';
import { Body } from  '_brand/templates/screens/addObject/components/Body';
import { HeaderScreen } from  '_brand/templates/screens/addObject/components/HeaderScreen';
import {getNetatmoUrl} from '_api/Api';



export const NetatmoAssistantHomeScreen = () => {

    const pagerRef = useRef(null);
    const currentPageRef = useRef(0)
    const navigation = useNavigation();
    const route = useRoute();
    const { t, i18n } = useTranslation();
    const tns = "addObject";

    const [allStates, setAllStates] = useState({currentPage:0});

    const {theme} = useTheme();  
    const bgcolor = theme?.prflxbgColor||'white';
    const textColor = theme?.prflxTextColor||'black'


    ////####----------Begin managing Pager View navigation

    console.log("currentPage changed",allStates.currentPage)

    const updateState = (newStates) => {
        setAllStates({allStates,...newStates});
    }

    const goBack = (index) => {
        //console.log("currentPage=",allStates.currentPage,currentPageRef.current)
        
        const nextIndex = currentPageRef.current - 1; 
        currentPageRef.current = nextIndex;
        //console.log("in Go Back",nextIndex)
        if(nextIndex < 0 ) {
            // navigation.goBack(2);
            navigation.goBack();
        } else {           
            updateState({'currentPage':nextIndex});         
            pagerRef.current.setPage(nextIndex); 
        }
        
    };
    
    const goNextPage = () => {
    
        const currentPage = allStates.currentPage;
        
        const nextIndex = currentPage + 1; 
        updateState({"currentPage":nextIndex})      
        pagerRef.current.setPage(nextIndex); 
    }
    
    const goPage = (index) => {
         
        //console.log("goPage",index)
        //setCurrentPage(index); 
        const currentPage = allStates.currentPage;
    
        currentPageRef.current = index;
        updateState({"currentPage":index})           
        if(pagerRef.current)pagerRef.current.setPage(index);    ; 
    }
    
    const onPageSelected = (e) => {
           
        const position = e.nativeEvent.position;
        const index = updateState({"currentPage":position})       
        currentPageRef.current = position;     
    }
    ////####-------------End managing Pager View navigation

const [netatmoUrl, setNetatmoUrl] = useState("");
useEffect(()=>{
    console.log("Here is netatmoUrl :", netatmoUrl)
},[netatmoUrl])

const handleNetamoChoice = async()=>{
    //console.log("I am Clicked")
    const response = await getNetatmoUrl().catch((err) => console.log(err));
    //console.log("Netamo Url :", response?.res?.data?.resource?.netatmo['auth-uri'])
    if(response.errCode == 200){
        const site = response?.res?.data?.resource?.netatmo['auth-uri']
        setNetatmoUrl(site)
        goPage(1)
    }else{
        console.log("ERROR NO NETATMO LINK PROVIDED")
    } 
}

const goToNetatmoSite = async()=>{

    const response = await getNetatmoUrl().catch((err) => console.log(err));
    //console.log("Netamo Url :", response?.res?.data?.resource?.netatmo['auth-uri'])
    if(response.errCode == 200){
        const site = response?.res?.data?.resource?.netatmo['auth-uri']
        setNetatmoUrl(site)
        goPage(1)
    }else{
        console.log("ERROR NO NETATMO LINK PROVIDED")
    }

}

      return (
        <SafeAreaView style={{height:'100%', backgroundColor:'transparent'}}>

            <PagerView 
                style={[{flex:1, backgroundColor:bgcolor}]} 
                ref={pagerRef}
                initialPage={0}
                scrollEnabled={false}
                onPageSelected={onPageSelected}
                >

                        <View key='0' style={{alignItems:'center', justifyContent:'flex-start', backgroundColor:'transparent', paddingTop:20}}>
                            <HeaderScreen title ={t(tns + ":" + "NETATMO_ACCOUNT")} goBack={()=>navigation.navigate("AddObject")}/>
                            <Body style={{marginTop:0, padding:15}}>
                                <View>
                                    <View style={{marginTop:0, marginBottom:10}}>
                                        <Text style={styles.text}>
                                            {t(tns + ":" + "NETATMO_LINK_DESCRIPT")}
                                        </Text>
                                    </View>
                                </View>

                                <View style={[styles.validateButton, {color:textColor, marginTop:200}]}>
                                    <Button onPress={goToNetatmoSite} altStyle titleColor='white' title={t(tns + ":" + "VALIDATE")} bgColor={textColor} noBorder />
                                </View>
                            </Body>
                        </View>

                        <View key='1' style={{alignItems:'center', justifyContent:'flex-start', backgroundColor:'transparent', paddingTop:20}}>
                        <HeaderScreen title = {t(tns + ":" + "BACK_TO_APP")} goBack={()=>navigation.navigate("AddObject")}/>
                            <View  style={{height:'100%', width: '100%',}}>
                            <WebView 
                                originWhitelist={['*']}
                                source={{uri:`${netatmoUrl}`}} 
                                style={{marginTop:-10}}
                            
                            />
                            </View>

                                {/* <View style={[styles.validateButton, {color:textColor, marginTop:400}]}>
                                    <Button onPress={goToNetatmoSite} altStyle titleColor='white' title='Valider' bgColor={textColor} noBorder />
                                </View> */}
                        </View>

            </PagerView>
        </SafeAreaView>
   
        )
};


const styles = StyleSheet.create({
        text:{
            fontSize:16,
            fontWeight:'400',
            alignItems:'center',
            justifyContent:'center',
            textAlign:'center',
            flexWrap:'wrap',
            lineHeight:20,
            marginVertical:10
        },
        validateButton:{
            minWidth:200,
            height:50,
            marginTop:50,
        }
  });
