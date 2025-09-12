
import './locales'

import React from 'react';
import {useEffect,useState} from 'react';
import { View,Image,TouchableWithoutFeedback } from 'react-native';
import { useSelector } from 'react-redux';
import styled from 'styled-components/native';

import {Api} from '_api';
import {CustomUnlock} from './components/customUnlock';
import { getObjectById } from '_helpers/selectors';

/**
 * it's the Video DoorPhone Widget in list view
 * @param {Object} props 
 * @param {number} props.itemId
 * @param {function} [props.showDetailsCallback]
 * @returns JSX
 */
export const TypeDoorKeeper= (props) => {    

   
    const { statuses,itemId,activeStatusesImages,typeName,showDetailsCallback} = props;
  
    const [myHeight,setMyHeight] = useState(200);
   
    const currentObjectDatas = useSelector(state => getObjectById(state,itemId));
    const [openActions,setOpenActions] = useState([]);

    const settingsActions = () => {
        const actions = currentObjectDatas.actions || [];
        const toOpen = actions?.reduce((r,v,i) => {
            if(v.name == "STRIKE" || v.name == "GATE")r.push(v.name)
            return r
        },[])
        setOpenActions(toOpen)
    }   
    
    // just needed when doorkeeper is created
    useEffect(() => {       
        settingsActions();
    }, [currentObjectDatas.actions]); 

    const openIt = (actionName) => {
        console.log("So openIt ("+actionName+")")
        Api.executeAction(itemId,actionName);
    }  

    const goDetailsAndPlay = () => {
       //(showDetailsCallback || Function)(itemId,{'autoplay':true});  
      
       if(typeof showDetailsCallback === "function") {
        showDetailsCallback(itemId,{'autoplay':true});  
       }  
    }    
    const onLayout = (e) => {
       //
    }


  const snapshot = require('./assets/defaultImage.jpg');
  
    return (
        <View style={{flex:1}} onLayout={onLayout}  > 
            <StyledMainView>             
            <View style={{backgroundColor:'transparent',height:myHeight,marginTop:15,marginBottom:15,justifyContent:'center'}}>
                <TouchableWithoutFeedback onPress={goDetailsAndPlay} style={{backgroundColor:"orange"}}>
                    <Image source={snapshot} style={{flex:1, height: undefined, width: undefined}} resizeMode="contain"  />
                </TouchableWithoutFeedback>
            </View>                       
            </StyledMainView> 
                <View style={{height:10,width:'100%',flex:1}}></View>  
                    <View style={{flex:1,flexDirection:'row',height:80,justifyContent:'center',alignItems:'center'}}>
                    { openActions.indexOf("GATE") != -1 && 
                        <View style={{width: '50%',padding:10,zIndex:8}}>
                            <CustomUnlock  iconThumb="gate" iconRight="padlock" actionName="GATE" callback={openIt} />
                        </View>
                    }
                    { openActions.indexOf("STRIKE") != -1 &&
                    <View style={{width: '50%',padding:10}}>
                        <CustomUnlock  iconThumb="door" iconRight="padlock" actionName="STRIKE" callback={openIt}/>
                    </View>
                    }                   
                </View>                
       </View>   
    )
}

const StyledMainView = styled.View`
                    
                    min-height:150px;                   
                `;