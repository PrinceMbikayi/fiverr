import React, { useState, useEffect, useRef} from 'react';
import { View, StyleSheet,FlatList, Dimensions} from 'react-native';
import { ToggleCard } from '_brand/templates/components/objects/common/ToggleCard';
import { useObject } from '_hooks/object';

import {iconsJs} from '_brand/utils/iconsJs';




/**
* return a useful multiline component
* @param {Object} props
* @param {Object} props.objectId  id of the object you are trying to modify its dependencies
* @param {string} props.possibleObjects object all possible dependencies 
* @param {string} props.selectedObjects  object current dependencies
* @param {Object} props.bgColor  toggle background color
* @param {state} props.iconColor  icon background color
* @param {function} props.callBack  function that send back the new modify current dependencies
* 
*/


const { width } = Dimensions.get('window')  
export const ObjectsToggleFlatList = (props)=>{
    const {possibleObjects, selectedObjects, bgColor, iconColor,iconSize, numColumns, callBack, iconJs, isAdd=false} = props;

    // let's get selectedObjects initial state from parent
    const [rdeps, setRdeps] = useState(selectedObjects);



   useEffect(()=>{
    //console.log("RENDER TOGGLE :", selectedObjects);
    isAdd? setRdeps(selectedObjects):console.log("Hello")
   },[selectedObjects])

   useEffect(()=>{
    //console.log("RDEPSSSSSS :",rdeps);
   },[rdeps])




   //##############################################################################

    const RenderItem = ({item, index, rdeps})=>{
      const uObject = useObject(item);
      const typeName = uObject?.objectDatas?.typeName;
      const [active, setActive] = useState(false);
      const name = uObject?.objectDatas?.name;
      const memoryClassNameRef = useRef("");
      const filteredClassName = uObject?.objectDatas?.className; 

      // Deal with none/pre-preactived(ie item already in object dependencies) item 
      useEffect(() => {
        // check if "item" is in list rdeps (  indexOf -> -1 if searchElement does not existe in list )
        const test = rdeps?.indexOf(item.toString())!=-1;
        // test != -1 =>  true, else => false
        //console.log("FLAG", test)
        //console.log("WHAT IN RDEPS :", rdeps)
        setActive(test)
      },[rdeps]);


      useEffect(()=>{
      },[iconRender])



      const [iconRender, setIconRender] = useState();
      let iconView; // = iconsJs.vrOpenIcon.name


      if(typeName == "Rolling_Shutter_Ezsp" || typeName == "Shade_Ezsp"){
        iconView = iconsJs.vrOpenIcon.name;
      }
      else if(typeName == "Rolling_Shutter_Profalux"){
        iconView = iconsJs.vrOpenIcon.name;
      }
      else if(typeName == "Rolling_Shutter_Profalux"){
        iconView = iconsJs.vr868Icon.name;
      }
      else if(typeName == "Venetian_Shutter_Ezsp"){
        iconView = iconsJs.bsoOpenIcon.name;
      }
      else if(typeName == "LightEzsp"){
        iconView = iconsJs.lightOnIcon.name;
      }
      else if(typeName == "SwitchEzsp"){
        iconView = iconsJs.plugOnIcon.name;
      }
      else if(typeName == "Gate_Ezsp" || typeName == 'Gate_Toggle_Ezsp'){
        iconView = iconsJs.gateSomewhereIcon.name;
      }
      else if(typeName == "Garage_Door_Ezsp" || typeName == "Garage_Door_Toggle_Ezsp"){
        iconView = iconsJs.garageOpenIcon.name;
      }
      else{ iconView = iconsJs.vrOpenIcon.name;}


        const onPressHandler = (item) =>{
          //console.log("COUCOU I AM HERE")

          //console.log("CHECK RDEPS :", rdeps)
            const position = rdeps?.indexOf(item.toString());

            //console.log("Check :", position);
            const newRdeps = [...rdeps];

            if(position == -1){

              // add item if not in rdeps
                newRdeps.push(item.toString());
                setRdeps(newRdeps);
            }else{
                newRdeps.splice(position,1);
                setRdeps(newRdeps);
              }
            callBack(newRdeps);
        }

      return(
        <View style={styles.toggleWrapper} key={index}>
            <ToggleCard 
                    id ={item}
                    //IconJS ={iconJs||iconRender} 
                    IconJS ={iconJs||iconView} 
                    iconSize={iconSize || 25} 
                    active = {active}
                    iconColor={active? bgColor : iconColor}
                    bgColor={ active? iconColor : bgColor} 
                    title={name}
                    titleColor = {active? bgColor : iconColor }
                    //viewForm='square' 
                    onPressHandler = {onPressHandler}
                  />
        </View>
      )

    }

    return(
      // <View style={{justifyContent:'center', flex:1, paddingHorizontal:20}}>
      <View style={{flex:3, width:width, padding:10, backgroundColor:'transparent', justifyContent:'center'}}>
      <FlatList
        data={possibleObjects}
        renderItem={ 
                      ({item, index}) => <RenderItem 
                                            item = {item} 
                                            index={index} 
                                            rdeps = {rdeps} 
                                          /> 
                    }
        keyExtractor={(item, index) => "key_"+item} 
        numColumns={numColumns||3}
    />
    </View>
    )
}


const styles = StyleSheet.create({
  
  toggleWrapper:{
    backgroundColor:"transparent",
    borderRadius:12,
    //alignItems:'baseline',
    //justifyContent:'space-evenly',
    padding:5,
    //marginRight:7,
    // shadowOffset:{width: 0, height: 4},
    // shadowOpacity: 0.5,
    // elevation:8,
    // shadowColor:'#000000',
  }
})
