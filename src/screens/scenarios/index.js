import './locales';
//------- then FC -------------------------
import React, {useContext,useEffect,useState,useRef,useCallback} from 'react';
import { Text,View,Image,ScrollView,SafeAreaView} from 'react-native'; // use in styled components
import { useSelector,useDispatch } from 'react-redux';
import { useNavigation,useRoute,StackActions } from '@react-navigation/native';

import {StyleSheet} from 'react-native';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/native';

import DeviceInfo from 'react-native-device-info';

import { useTheme } from '_theming/themeProvider';
import { useAppGlobal} from '_helpers/appGlobalProvider';

import{getUser} from '_helpers/selectors';
import {HeaderWithBack} from '_components/headers/header-with-back'
import { AccountScreenLine } from '../account/components/accountLine';
import BottomModal from './components/bottomModal';

import PagerView from 'react-native-pager-view';

import {CalendarList} from '_components/dates/calendarList';
import { SelectProducts } from './components/selectProducts';
import {ModalFooter} from './components/modalFooter';


export const ScenarioHome= (props) => {
   
    const { t, i18n } = useTranslation();
    const { theme} = useTheme();
    const title = t("MENU_SCENARIOS");
    const navigation = useNavigation();
    const route = useRoute();
    const navigationParams = route?.params || {}; 
    
    const [modalContent,setModalContent] =useState(null)
    const bottomModalRef = useRef();

    // Modal footer interactions
    const continueButton = [{title:'continue',id:'continue'}];
    const skipContinueButtons = [{title:'skip',id:'skip'},...continueButton];
    const footerCallback = (id) => {
      
    }
    const buildModal = () => {
        console.log("build Modal")
        const config = [
                            { view:'calendar',title:'Quand partez-vous en vacances ?',footer:{buttons:[...continueButton]}},
                            { view:'products',productType:'AtHomePlugIn',title : "Select Products PLZ",footer:{buttons:[...skipContinueButtons]}},
                            { view:'products',productType:'AtHomeLight',title : "Select Lights"}
                        ];

        const content = config.reduce((r,v,i)=> {
            const title = <Title>{v.title}</Title> 
            let body = null;
            switch(v.view) {
                case 'calendar':
                    body = <CalendarList
                        // Callback which gets executed when visible months change in scroll view. Default = undefined
                        onVisibleMonthsChange={(months) => {console.log('now these months are visible', months);}}
                        // Max amount of months allowed to scroll to the past. Default = 50
                        pastScrollRange={0}
                        // Max amount of months allowed to scroll to the future. Default = 50
                        futureScrollRange={12}
                        // Enable or disable scrolling of calendar list
                        scrollEnabled={true}
                        // Enable or disable vertical scroll indicator. Default = false
                        showScrollIndicator={true}                       
                        markingType={'period'}
                        startDate="2022-01-17"
                        endDate="2022-01-24" 
                        />;
                    break;
               
                case 'products' :
                    body =  <ScrollView style={{height:'100%'}}>
                                <SelectProducts type={v.productType}>
                                </SelectProducts>
                            </ScrollView>;
                    break;
                default :
                    body = <ScrollView style={{height:'100%'}} collapsable={false}><Text style={{color:'black'}}>voilà</Text></ScrollView>;
            
            
            }
            const footer =  (v.footer == undefined) ? <View style={{height:20,backgroundColor:'red'}}></View> : <ModalFooter description={v.footer} callback={footerCallback}/>
            r.push(<View>{title}{body}{footer}</View>)
            return r;
        },[])
        
        const newContent =  <PagerView initialPage={0} style={{height:'100%',overflow:'hidden',backgroundColor:'transparent'}}>{content.map((v,i)=> { return (v)})}</PagerView>
      
        //const newContent = <View style={{height:'100%',width:'100%',flex:1,backgroundColor:'pink'}}></View>
        console.log("newContent----->",newContent)
        setModalContent(newContent )
        //setModalContent(content)
    }

    useEffect(()=>{
        buildModal();
    },[])
    useEffect(()=>{
        console.log("AAA smodalContent",modalContent)
    },[modalContent])




    const doNavigation = (id) => {

        
        console.log("doNavigation",id)
        switch(id) {
            case "profile":
                bottomModalRef.current.open();
                break;
            case "gallery":
                navigation.navigate("GalleryHome");
                break;
            case "wifi":
                navigation.navigate("WifiSettings");
                break;
            
           
            default:
                navigation.navigate(id);
                break;
        }
    }
    const bgColor =  theme['card--color--bodybg']
    const textColor = theme.onBody;
    return (
        <SafeAreaView style={{flex:1,backgroundColor:bgColor}}>
            <HeaderWithBack title={title} backDoClose bgColor={theme['header--color--bg']}/>
            <ScrollView style={{padding:15,paddingTop:0,backgroundColor:bgColor}}>     
                <AccountScreenLine icon="user" title={"Go Programm"} actionType="navigate" callback={doNavigation} id="profile"/>                         
            </ScrollView>
            <BottomModal ref={bottomModalRef}>
               <View style={{width:'100%',flex:1,overflow:'hidden'}}>                    
                    <View style={{width:'100%',height:'100%',marginBottom:-30}}>                                          
                        <View style={{flex:1,height:'100%',width:'100%',backgroundColor:'transparent'}}>
                            <>
                                {modalContent}                           
                            </>
                        </View>
                    </View>                   
                </View>
            </BottomModal>
        </SafeAreaView>
        )
}


const Title = styled.Text`
        width:100%;
        padding:5px;
        align-content:center;        
        align-self:center; 
        font-weight:bold;
        color: ${props => props.color || 'black'}; 
        background-color:blue;
        `;
