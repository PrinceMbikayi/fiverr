import React from 'react';
import { Text, View, Pressable, Dimensions} from 'react-native';
import {iconsJs} from '_brand/utils/iconsJs';
import {getObjectById} from '_helpers/objects';


const { width } = Dimensions.get('window')  
export const ItemSelectionRender = (props)=>{

    const {item, iconSize, iconColor, callBack} = props;

        const uObject = getObjectById(item);
       //console.log("VIEW GROUP INSIDE :", uObject)
        const typeName = uObject?.typeName;
        const groupName = uObject?.name
        const componentTypes = uObject?.componentTypes;
        const groupId = uObject?.id;
        console.log("VIEW GROUP INSIDE COMPONENTS  : ", typeName)
    
    
        const IconRender = ({IconJS})=>{
          return(
            <View style = {{width:iconSize, height:iconSize}}>
              <IconJS color = {iconColor} />
            </View>
          )
        }
    
    
        const getIcon = (typeNameArg)=>{
    
          let typeName = typeNameArg;
          if(typeName == 'composite'){
            if(componentTypes && componentTypes.length == 1){
              typeName = componentTypes[0]
            }
    
            console.log("COMPOSITE COMPONENT TYPES :", typeName)
          }
          const defaultIcon = (componentTypes && componentTypes.includes('LightEzsp')) ? 'groupLightOffIcon' : 'groupShuttersIcon';
          let icons = {
            Rolling_Shutter_Ezsp:'vrOpenIcon',
            Shade_Ezsp:'vrOpenIcon',
            Rolling_Shutter_Profalux:'vr868Icon',
            Venetian_Shutter_Ezsp:'bsoOpenIcon',
            LightEzsp:'lightOffIcon',
            SwitchEzsp:'plugOffIcon',
            Gate_Ezsp:'gateSomewhereIcon',
            Gate_Toggle_Ezsp:'gateSomewhereIcon',
            Garage_Door_Ezsp:'garageOpenIcon',
            Garage_Door_Toggle_Ezsp:'garageOpenIcon',
            Hetero: 'groupLightOffIcon',
            undefined:'vrOpenIcon'
      
          }
          const icon = icons[typeName] || defaultIcon;
          const iconComponent = iconsJs[icon].name
          return iconComponent
        }
    
    
        let iconView = getIcon(typeName)
    
        //console.log("ITEM :", item)
            if (item == 'extra') return <View style={{width:width*0.46, height:width*0.2, backgroundColor:'transparent', justifyContent:'center', alignItems:'center', borderRadius:10}}/>;
            let content;
    
            content = (
                <Pressable
                    key = {groupId}
                    onPress={callBack}
                    style={{flex:1, justifyContent:'center', alignItems:'center', padding:5}}
                    >
                        <View style={{
                            width:width*0.46, height:width*0.22, backgroundColor:'white', justifyContent:'flex-start', 
                            borderColor:'orange', borderWidth:1, borderRadius:10, paddingHorizontal:15, paddingVertical:5
                            }}
                          >
                            <Text numberOfLines={1} ellipsizeMode='tail' style={{fontSize:16, fontWeight:'400', textAlign:'center', paddingBottom:5, paddingHorizontal:10}}> {groupName} </Text>
                            <IconRender IconJS ={iconView}/>
                        </View>
                </Pressable>
            )
    
        return <View style={{flex:1, justifyContent:'center'}}>{content}</View>

}    