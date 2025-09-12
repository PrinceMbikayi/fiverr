import React from 'react';
import {useEffect,useState,useRef,useImperativeHandle} from 'react';
import { View,Text,Image } from 'react-native';

import { useTranslation } from 'react-i18next';
import styled from 'styled-components/native';

import {IconButtonRound} from '@components/ui/buttons/iconButtonRound';
import { useTheme } from '_theming/themeProvider';

import icons from '../assets/icons';
import {getTitleDate} from '../utils'

import {PLAYER_STATES} from './videoPlayercontrols';



//React.forwardRef((props,  /** @type {RefType} */ref) => {



const SnapshotViewer = React.forwardRef((props,ref) => {

    const { circleRadius,actions,archiveNavigate,
            currentArchive,currentIndex,collectionLength
            ,fullscreen,
            specialColor} = props;


    const { t, i18n } = useTranslation();
    
    const {theme} = useTheme();   
     
    const [showPrevious,setShowPrevious] = useState(true)
    const [showNext,setShowNext] = useState(true);
    

    // REF methods can be called (useImperativeHandle)

    useImperativeHandle(ref, () => ({
        
        popupTitle(val) {
            setTitle(val)
        },
        toggle() {           
            setModalVisible(!modalVisible);
        }
    }));

    const titleDate = (dateKey) => {

        let currentLang = i18n.language;
        if(currentLang == "en")currentLang+="-gb";  
        const titleDate = getTitleDate(dateKey,currentLang,'hh:mm:ss');
        if(titleDate == 'TODAY' || titleDate == 'YESTERDAY') {
            return t('doorkeeper:'+titleDate)
        }
        return titleDate
    }
      


    useEffect(() => {
      
           setShowPrevious((currentIndex > 0))
           setShowNext((currentIndex < collectionLength-1))
       

    }, [currentIndex,collectionLength]);

    const bodyTextColor = theme.onBody || 'red';
    const backgroundColor = theme['card--color--bodybg'] || theme['color--bg'];
    const iconColor = specialColor || bodyTextColor;

    useEffect(() => {
       //console.log("fullscreen changed",fullscreen)
    }, [fullscreen]);

    const doAction = (actionType,param) => {
        //console.log("actionType",actionType)
        switch(actionType) {
            case "previousArchive" :
                archiveNavigate(-1);
                break;
            case "nextArchive" :
                archiveNavigate(1);
                
            
                break;
        }

    }

    const smallIconSize = 50;
   const largeIconSize = 65;


    return (
        <>
            <View style={{flex:1,width:'100%'}}>
                <Image source={{uri:currentArchive.thumb}} style={{width:'100%',height:'100%'}} resizeMode="cover"/>
                {fullscreen && 
                <>
                <ImageArchiveControlWrapper zIndex={4}>
                    <View style={{alignItems:'flex-start',paddingLeft:15,flex:1}}>
                        <IconButtonRound  iconSize={smallIconSize} strokeWidth={0}  strokeColor={iconColor} iconXml={icons['archive-previous']} callback={doAction} action="previousArchive" disabled={!showPrevious}/>   
                    </View>
                    <View style={{alignItems:'flex-end',paddingRight:15,flex:1}}>
                        <IconButtonRound  iconSize={smallIconSize} strokeWidth={0}  strokeColor={iconColor} iconXml={icons['archive-next']} callback={doAction} action="nextArchive" disabled={!showNext}/>   
                    </View>
                 
                </ImageArchiveControlWrapper>
                <TitleDate><Text style={{textAlign:'center',padding:10,color:bodyTextColor}}>{titleDate(currentArchive?.date)}</Text></TitleDate>
                </>
                 } 
                
            </View>
        </>
    );
})

export default SnapshotViewer

const  ImageArchiveControlWrapper= styled.View`
                
                position:absolute;
                height:100%;
                width:100%;
                background-color:#FFFF0000;
                align-items:center;
                flex-direction:row;
                justify-content:center;
                z-index:3;
                flex:1;
`;
const  TitleDate= styled.View`                
                position:absolute;
                bottom:40;
                align-self:center;
                background-color:#00000055;
                justify-content:flex-end;                
                z-index:4;
                flex:1;
`;
