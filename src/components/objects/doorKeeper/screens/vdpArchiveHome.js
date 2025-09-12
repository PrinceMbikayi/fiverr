import React from 'react';
import { View,ScrollView, Text,SafeAreaView} from 'react-native';
import {useContext,useState,useEffect} from 'react';

import { useTranslation } from 'react-i18next';
import { useNavigation,useRoute } from '@react-navigation/native';
//---------------------------------------------------
import {getObjectFiles} from '_api/objects';

import { useTheme } from '_theming/themeProvider';
import {ArchivesGrid} from '../components/archivesGrid';
import {createFakeCaptures,formatFilesCollection,sortArchives} from '../utils/formatVdpFiles';
import {getTitleDate} from '../utils';

import {TabSelector} from '../components/tabSelector';
import Header from '../components/ui/header';



export const VdpArchiveHomeScreen= (props) => {

   
    const { t, i18n } = useTranslation();
    const { theme} = useTheme();
    
    const navigation = useNavigation(); //V5
    const route = useRoute();
    const navigationParams = route?.params || {};
    const {itemId,previousRoute} = navigationParams;


 
    const title= t('doorkeeper:EVENTS')

    const itemDatas =  {};    
    const [captures,setCaptures] = useState([]);
    const [capturesSimpleArray,setCapturesSimpleArray] = useState([])
    const [allCaptures,setAllCaptures] = useState([]);
    const [imageCaptures,setImageCaptures] = useState([]);
    const [videoCaptures,setVideoCaptures] = useState([]);
    const [selectedTab,setSelectedTab] = useState('all');

    const isDev = false;
    
    
    useEffect(() => {

        const initMe = async() => {
           
            let capturesDatas;
            //console.log("useEffect à la 'componentDidMount'")
            if(itemDatas?.captures == undefined && isDev == true) {
                capturesDatas = createFakeCaptures(); 
                
            } else {
                // à voir quand on aura les vraies infos;               
                const objectFiles = await getObjectFiles(itemId);
               // console.log("objectFiles ----- >>>",objectFiles)                
                capturesDatas = formatFilesCollection(objectFiles.res);
                //console.log("c'est du vrai")
                if(capturesDatas.length == 0) capturesDatas = createFakeCaptures(); 
            }
            const sortedArchives = sortArchives(capturesDatas);           
            setCapturesSimpleArray(capturesDatas);
            setAllCaptures(sortedArchives.orderedCaptures);   
            setVideoCaptures(sortedArchives.videos);
            setImageCaptures(sortedArchives.snapshots);
           //----------------------------------------
           //console.log("sortedArchives.snapshots",sortedArchives.snapshots)
            setCaptures(sortedArchives.orderedCaptures)
        }
        initMe();
       }, []);


    const goBack = () => {
       
        const popAction = StackActions.pop(1);
        navigation.dispatch(popAction);
        
      }
    

    const doAction = (action) => {
        console.log('action',action);
    }

    const play = () => {
        console.log("play play play")
    }

    

    const titleDate = (dateKey) => {

        let currentLang = i18n.language;
        if(currentLang == "en")currentLang+="-gb";  
        const titleDate = getTitleDate(dateKey,currentLang);
        if(titleDate == 'TODAY' || titleDate == 'YESTERDAY') {
            return t('doorkeeper:'+titleDate)
        }
        return titleDate
    }

    const onThumbClick = (args) => {
        //console.log("onThumbClick",args)
        navigation.navigate("VdpArchivePlayer",{...args,captures:capturesSimpleArray,previousRouteName:navigation?.state?.routeName})
    }
 
    const onTabSelect = (tabId) => {
        console.log("tabId",tabId)
        setSelectedTab(tabId);
        switch(tabId) {
            case 'videos' :
                setCaptures(videoCaptures);
                break;
            case 'images' :
                setCaptures(imageCaptures); 
                break;
            default :
                setCaptures(allCaptures);
        }
    }

    

    const tabs= [
                    {'title':t('doorkeeper:TAB_ALL'),tabId :'all'},
                    {'title':t('doorkeeper:TAB_IMAGES'),tabId : 'images'},
                    {'title':t('doorkeeper:TAB_VIDEOS'),tabId :  'videos'}
                ];

    const containerStyle = {backgroundColor:"#242323CC"};
    const tabStyle = {borderBottomColor:'transparent',borderBottomWidth:4}
    const tabStyleSelected = {borderBottomColor:theme['redBar'],borderBottomWidth:4,backgroundColor:'transparent'}
    const tabTextStyle = {color:"#9D9FA1"}
    const tabTextStyleSelected = {color:"white"}


    const bodyTextColor = theme.onBody || 'red';
    const backgroundColor = theme["details_body_color"] || theme["card--color--bodybg"] || theme['color--bg'];
    const titleStyle = {'color':bodyTextColor || 'red'}


    return (
        <SafeAreaView style={{flex:1,backgroundColor:backgroundColor}} bounces={false} alwaysBounceVertical={false}>
            <Header title={title} goBack={goBack} themeDependency/> 
            <TabSelector    tabs={tabs}
                            callback={onTabSelect} 
                            containerStyle={containerStyle} 
                            tabStyle={tabStyle} tabStyleSelected={tabStyleSelected}
                            tabTextStyle={tabTextStyle}
                            tabTextStyleSelected={tabTextStyleSelected}

                            />
            <ScrollView style={{marginBottom:30,backgroundColor:'#FF000000'}}  bounces={false} >
                {
                    captures.map((val,index) => {
                        return (
                            <ArchivesGrid title={titleDate(val.date)} titleStyle={titleStyle} items={val.data} callback={onThumbClick}/>
                        )
                    })
                }
        </ScrollView>    
        </SafeAreaView>
    )
   }