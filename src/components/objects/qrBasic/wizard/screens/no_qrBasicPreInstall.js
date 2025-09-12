import '../../locales'
import React from 'react';
import {useContext,useState,useRef,useEffect} from 'react';
import { View,Image} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation,useRoute } from '@react-navigation/native';
import styled,{ThemeProvider} from 'styled-components/native';
import PagerView from 'react-native-pager-view';


//-----------------------------------------------------
import { useTheme } from '_theming/themeProvider';
import AccessButton from '_components/forms/accessButton';
import {ViewerTitle,ViewerText} from '../../components/styled';


const QrBasicPreInstall = (props) => {

    const isMounted = useRef(false)
    const { t, i18n } = useTranslation();
    const { theme,baseColors} = useTheme();
    const {bgColor,textColor,headerBackgroundColor,headerTextColor} = baseColors;
  
    
    const navigation = useNavigation();
    const route = useRoute();
    const navigationParams = route?.params || {}; 
    
   // const {itemId,update : isUpdate, productId : atHomeObjectType} = navigation?.state?.params || {}; //v4
    const {itemId,update : isUpdate, productId : atHomeObjectType} = navigationParams;
    
    const endCallback = props.endCallback;
    const indexCallback = props.indexCallback;
    const changedPosition = props.currentPosition;
    
    const pagerTitles = [   "",
                                t("doorkeeper:PRE_INSTALL_STEP_2_TITLE"),
                                t("doorkeeper:WIFI_CONNECT_TITLE")
                            ]

    const pagerRef = useRef(null);
    const initialPage = 0
    const pageRefCurrentPage = useRef(initialPage);
    const [qrCodeVisible,setQrCodeVisible] = useState(false)


    const goNextPage = (newIndex) => {

       
        if(newIndex == undefined) {
            pageRefCurrentPage.current +=1;
        } else {
            pageRefCurrentPage.current = newIndex;
        }        
        pagerRef.current.setPage(pageRefCurrentPage.current);   
    }


    // DID MOUNT
    useEffect(() => {
        isMounted.current = true;
        console.log("DoorKeeperWizardStartScreen",props);
        if(indexCallback) indexCallback(0,pagerTitles[0])

        if(isUpdate) {
                   
        }
        // WILL UNMOUNT
        return () => (isMounted.current = false)
      }, []);

      useEffect(() => {
       if(changedPosition != pageRefCurrentPage.current) {
        goNextPage(changedPosition)
       }
      }, [changedPosition]);



    // ----------------------------------
    const instructionsUrl =  t('doorkeeper:INSTRUCTIONS_URL');

    

   const [consoleFramewire,setConsoleFramewire] = useState(null);
   const [stepOneImage,setStepOneImage] = useState(null);
    
   //const [stepTwoImage,setStepTwoImage] = useState(null);

   useEffect(() => {
    
    setStepOneImage(<ResponsiveImage source={require('../../assets/intro-logo.png')} width={150}></ResponsiveImage>);
   // setStepTwoImage(<ResponsiveImage source={require('../../assets/stepTwo.png')} width={300}></ResponsiveImage>);
   // setConsoleFramewire(<ResponsiveImage source={require('../../assets/console.png')} width={240} ></ResponsiveImage>);
   }, []);
   
    const ResponsiveImage = (props) => {

        const {source,width} = props;        
        const myRatio = useRef(1);
        const [refreshMe,setForceRefresh] = useState(Date.now());
        const responsiveMe = (event) => {
            const eSource = event.nativeEvent.source;            
            myRatio.current =   eSource.height/eSource.width ;           
            setForceRefresh(Date.now())
        }
        const myStyle = {flex:1,width:undefined,height:undefined,...(props.style != undefined)? props.style : {}};
        return (
            <View style={{width:width,minHeight:width*myRatio.current}} >
                <Image  onLoad={event => {responsiveMe(event)}} style={myStyle} resizeMode="contain" source={source} ></Image>
            </View>
        )
    }

    const onSetQrCodeVisible = () => {       
        setQrCodeVisible(!qrCodeVisible);
    }

    const onPageSelected = (e) => {
       
        const position = e.nativeEvent.position;
        pageRefCurrentPage.current = position;        
        const index = pageRefCurrentPage.current;       
        if(indexCallback) indexCallback(index,pagerTitles[index])
    }

    
    const bodyTextColor = textColor;
    const backgroundColor = bgColor;
    const styledTheme = {'textColor':textColor};
    console.log("styledTheme",styledTheme)

    return (
        <ThemeProvider theme={styledTheme}>
            <PagerView  initialPage={0} style={{flex:1}} ref={pagerRef} onPageSelected={onPageSelected}>
                <View style={{backgroundColor:'transparent'}} key="1">
                        <TopView>
                             <View style={{alignItems:'center',justifyContent:'center',marginTop:50}}>
                                <View style={{maxWidth:200,maxHeight:200,flex:1,overflow:'hidden'}}>
                                {
                                        stepOneImage
                                }
                                </View>
                            </View>
                        </TopView>
                    <View style={{flexGrow:1}}>
                        <MiddleView>
                           
                                <ViewerTitle>{t("qrbasic:PRE_INSTALL_STEP_1_TITLE")}</ViewerTitle>                              
                               <ViewerText style={{marginTop:15}} >{t("qrbasic:PRE_INSTALL_STEP_1_BODY")}</ViewerText>
                            
                        </MiddleView>               
                        <BottomView>
                            <AccessButton  onPress={() => endCallback()} onPagerPress={goNextPage} specialColor={bodyTextColor} title={t("qrbasic:PRE_INSTALL_STEP_1_BUTTON")} horizontalPadding={20}/>
                        </BottomView>
                    </View>
                </View>
                {/*
                <View style={{backgroundColor:'transparent'}} key="2">                       
                        <View style={{flexGrow:1}}>
                            <ScrollView style={{flex:1}}>
                            <MiddleView>
                                {
                                        stepTwoImage
                                }
                                <View style={{alignItems:'center',justifyContent:'center'}}>
                                    <ViewerText style={{marginTop:15}} >
                                        <Trans i18nKey="doorkeeper:PRE_INSTALL_STEP_2_TEXT">
                                                ...texte principal<Text style={{textDecorationLine:'underline'}} onPress={() => Linking.openURL(instructionsUrl)}>texte lien</Text>
                                        </Trans>
                                    </ViewerText>
                                </View>
                            </MiddleView> 
                            </ScrollView>              
                            <BottomView style={{flex:1,bottom:0}}>
                                <AccessButton  onPress={goNextPage} specialColor={bodyTextColor} title={t("doorkeeper:LET_S_GO")} horizontalPadding={20}/>
                            </BottomView>
                        </View>
                </View>
                <View style={{backgroundColor:'transparent'}} key="3">
                        <TopView style={{padding:20}}>
                            <ViewerText>{t("doorkeeper:WIFI_CONNECT_INNER_TITLE")}</ViewerText>
                            <ViewerText  style={{marginTop:8,lineHeight:32}} >
                                <Trans i18nKey="doorkeeper:CONNECT_WIFI_LI_1_TEXT">
                                        ...texte principal<Image style={{width:24,height:24}} source={require('../../assets/icon-settings.png')}/>
                                </Trans>
                            </ViewerText>
                            <ViewerText  style={{marginTop:8,lineHeight:32}} >
                                <Trans i18nKey="doorkeeper:CONNECT_WIFI_LI_2_TEXT">
                                        ...texte principal<Image style={{width:24,height:24}} source={require('../../assets/icon-wifi.png')}/>
                                </Trans>
                            </ViewerText>
                            <ViewerText  style={{marginTop:8}} >
                                <Trans i18nKey="doorkeeper:CONNECT_WIFI_LI_3_TEXT">
                                        ...texte principal
                                </Trans>
                            </ViewerText>
                            <ViewerText  style={{marginTop:8}} >
                                <Trans i18nKey="doorkeeper:CONNECT_WIFI_LI_4_TEXT">
                                        ...texte principal
                                </Trans>
                            </ViewerText>
                        </TopView>
                    <View style={{backgroundColor:'transparent'}}>
                        <MiddleView>
                            <View style={{alignItems:'center',justifyContent:'center',width:'100%',backgroundColor:'transparent'}}>  
                               {consoleFramewire}
                            </View>
                        </MiddleView>               
                        
                    </View>
                    <BottomView style={{height:230,maxHeight:230,flex:1,flexDirection:'column'}}>                          
                                <View style={{flexDirection:'row',flex:1,alignItems:'center',justifyContent:'center',height:20} }>
                                <CheckBox
                                    title='Click Here'
                                    value={qrCodeVisible}
                                    onValueChange={(newValue) => onSetQrCodeVisible(newValue)}
                                    onTintColor={bodyTextColor} onCheckColor={bodyTextColor} tintColors={{true:bodyTextColor,false:bodyTextColor}}
                                />
                                <ViewerText >{t("doorkeeper:WIFI_CONNECT_QRCODE_VISIBLE")}</ViewerText>
                                </View>                               
                            <AccessButton  disabled={!qrCodeVisible} onPress={() => endCallback()} specialColor={bodyTextColor} title={t("doorkeeper:CONTINUE")} horizontalPadding={20} style={{bottom:10}}/>
                            <View style={{height:2}}></View>
                        </BottomView>
                </View>
                */}
            </PagerView>
        </ThemeProvider>
    )        
}

export default QrBasicPreInstall

const MiddleView = styled.View`
   
    justify-content:flex-start;
    flex-grow:1;
    padding:15px;
`;
const BottomView = styled.View`
    height:64px;
    max-height:64px;
`;
const TopView = styled.View` 
     align-items:center;
    border-width:1px;
    border-color:transparent;
    margin-bottom:15px;
`;


