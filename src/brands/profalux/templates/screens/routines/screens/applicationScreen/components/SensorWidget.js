import React from 'react';
import {useRef } from 'react';
import { useSelector} from "react-redux";
import {View,TouchableOpacity,StyleSheet, Dimensions} from 'react-native';
import PureItemRender from '_components/list/pureItemRender/pureItemRender';
import ObjectModal from '_components/ui/objetModal';
import { useObject } from '_hooks/object';

import {getAllObjects} from '_helpers/selectors';

const screenWidth = Dimensions.get('window').width;

export const SensorWidget = (props)=> {
    const {itemId} = props
    //const uObject = useObject(itemId);
    //const typeName = uObject?.objectDatas?.typeName;
    let key = "key_"+itemId;
    let content;
   
    const objectModalRef = useRef()
    const gloIsConnected = useSelector(state=> state?.network?.isConnected);
    const gloServerIsDown = useSelector(state=> state?.network?.serverIsDown);
    const netInfoIsConnected = (gloIsConnected == true && gloServerIsDown == false);
    const allObjects = useSelector(getAllObjects);

    if(allObjects[itemId] == undefined){
            content = null
        }else{
            const boxWidth = screenWidth - 0.1*screenWidth/2;
            const cardWidth = boxWidth/2 -5 // combine with marginRight to avoid padding all
            content = (       
                <View key={key} style={{width:cardWidth,backgroundColor:'transparent',padding:0,marginRight:5}}>
                    <ObjectModal ref={objectModalRef} />
                    <TouchableOpacity activeOpacity={1} style={[styles.button,{backgroundColor:'transparent'}]} touchSoundDisabled={true}>
                        <PureItemRender 
                            itemId={itemId}
                            style={{flex:1}}
                            modal={objectModalRef}
                            netInfoIsConnected={netInfoIsConnected}      
                            />
                    </TouchableOpacity>
                </View>
            )
        }

    return (
        content
    )
  }



const styles = StyleSheet.create({
  button: {
   flex:1,
  
 },
})