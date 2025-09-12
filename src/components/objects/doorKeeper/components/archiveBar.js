import React from 'react';
import {useEffect,useState} from 'react';
import { View} from 'react-native';
//-----------------------------------------
import {IconButtonRound} from '@components/ui/buttons/iconButtonRound';
import { useTheme } from '_theming/themeProvider';
import icons from '../assets/icons';
import { PLAYER_STATES } from './videoPlayercontrols';



const playStateVars = {
                        [PLAYER_STATES.ENDED]: {action:"replay", icon:"video-replay"},
                        [PLAYER_STATES.PLAYING]: {action:"pause", icon:"video-pause"},
                        [PLAYER_STATES.PAUSED]: {action:"play", icon:"video-play"},
}



const PlayPauseReplayButton = (props) => {
   
    const {playState,iconSize,iconColor,callback} = props;     
    const {icon,action} = playStateVars[playState];
    const doAction = (action) => {       
        if(callback)callback(action)
    }
    return (
        <IconButtonRound  iconSize={iconSize} strokeWidth={2} strokeColor={iconColor} iconXml={icons[icon]}  callback={doAction} action={action} /> 
    )
}


export const ArchiveBar = (props) => {

    const {archiveNavigate,playerAction,currentIndex,collectionLength,playerState,isVideoArchive,specialColor,enabled} = props;
    
    const {theme} = useTheme();    
    const [showPrevious,setShowPrevious] = useState(true)
    const [showNext,setShowNext] = useState(true)
   

    useEffect(() => {
           setShowPrevious((currentIndex > 0))
           setShowNext((currentIndex < collectionLength-1))
    }, [currentIndex,collectionLength]);

    useEffect(() => {
        console.log("playState has changed")
 }, [playerState]);
   
    const bodyTextColor = theme.onBody || 'red';    
    const iconColor = specialColor || bodyTextColor;

   const doAction = (actionType,param) => {
    
    switch(actionType) {
        case "previousArchive" :
            archiveNavigate(-1);
            break;
        case "nextArchive" :
            archiveNavigate(1);
            break; 
        case "replay" :
        case "play" :
        case "pause" :
            if(isVideoArchive)playerAction(actionType) ;
        
            break;
    }
   }

   const smallIconSize = 50;
   const largeIconSize = 65;

   

   // ============ RENDER ===================================
    return (
        <View style={{flex:1,alignItems:'center'}} {...(!enabled && { pointerEvents: 'none' })}> 
            <View style={{flex:1,flexDirection:'row',alignItems:'center',justifyContent:'center',opacity:(!enabled)? 0.3 : 1}}>
                <IconButtonRound  iconSize={smallIconSize} strokeWidth={0}  strokeColor={iconColor} iconXml={icons['archive-previous']} callback={doAction} action="previousArchive" disabled={!showPrevious}/> 
                <View style={{marginLeft:15,marginRight:15,width:65,opacity:isVideoArchive ? 1: 0}}>
                    {playerState &&
                        <PlayPauseReplayButton iconColor={iconColor} iconSize={largeIconSize} playState={playerState} callback={doAction}/>
                    }                    
                    </View>
                <IconButtonRound  iconSize={smallIconSize} strokeWidth={0}  strokeColor={iconColor} iconXml={icons['archive-next']} callback={doAction} action="nextArchive" disabled={!showNext}/>    
            </View>
        </View>   
    )
}