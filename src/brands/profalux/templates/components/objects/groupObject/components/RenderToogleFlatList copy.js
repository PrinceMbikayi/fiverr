import React, {useEffect, useState} from 'react';
import { StyleSheet, FlatList, View} from 'react-native';
import { RenderFlatItem } from './RenderFlatItem';
import { alphabeticSort } from '_brand/utils/alphabeticSort';




/**
* return a useful multiline component
* @param {Object} props
* @param {Object} props.objectId  id of the object you are trying to modify its dependencies
* @param {string} props.allPossibleDependencies object all possible dependencies 
* @param {string} props.objectDependencies  object current dependencies
* @param {Object} props.bgColor  toggle background color
* @param {state} props.iconColor  icon background color
* @param {function} props.callBack  function that send back the new modify current dependencies
* 
*/

export const RenderToogleFlatList = (props)=>{

    const { 
      callBack, selection,selectable,
      bgColor, iconColor,iconSize, numColumns, iconJs,forcePadding
    } = props;

    const [data, setData] = useState(alphabeticSort(selectable));//alphabeticSort(selectable)
    const [extra, setExtra] = useState(false);

    useEffect(()=>{
      console.log("SELECTION(FLATLIST) :", selection)
    },[selection])

    useEffect(()=>{
      console.log("SELECTABLE FFF :", selectable)
      const test = selectable?.length %4;
      if(test == 3){
        setData ([...selectable, 'extra1'])
        setExtra(true)
      }else if( test ==2){
        setData ([...selectable, 'extra1','extra2'])
        setExtra(true)
      }else if(test ==1){
        setData ([...selectable, 'extra1','extra2','extra3'])
        setExtra(true)
      }else{
        setData(selectable)
        setExtra(false)
      }
    },[selectable])

    useEffect(()=> {
    },[data]);

    useEffect(()=> {
    },[extra]);

    

    return(
      
    <View style={{flex:1, padding:forcePadding || 0, backgroundColor:'transparent',}}>
      <FlatList
        data={data}
        renderItem={ 
          ({item, index}) => <RenderFlatItem 
                                item = {item}
                                index={index} 
                                selection = {selection} 
                                iconJs={iconJs} 
                                iconSize={iconSize}
                                iconColor={iconColor}
                                bgColor={bgColor}
                                callBack={callBack}
                                active={selection?.indexOf(item)!=-1}
                                isExtra = {extra}
                              /> 
        }
        keyExtractor={(item, index) => "key_"+item} 
        numColumns={numColumns||3}
        refreshing={true}
        extraData={selectable}
    />
  
    </View>

    )
}
const styles = StyleSheet.create({
  toggleWrapper:{
    backgroundColor:"transparent",
    borderRadius:12,
    margin:5
  }
})