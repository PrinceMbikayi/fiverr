import React, {useEffect, useState, useCallback} from 'react';
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
      callBack, selection,selectable,isPressable,
      bgColor, scanBgColor, iconColor,iconSize, numColumns, iconJs,forcePadding
    } = props;

    // useEffect(()=>{
    //   console.log("SELECTION(FLATLIST) :", selection)
    // },[selection])


    useEffect(()=> {
    
    },[selectable]);

    const renderItem = ({item, index}) => {

      if(item?.empty === true){
        return <View style={{ width: "23%", height: "90%", backgroundColor: 'transparent', justifyContent: 'center', alignItems: 'center', borderRadius: 10, marginTop:4}}/>
      }
      return(
        <RenderFlatItem 
          isPressable ={isPressable||true}
          item = {item}
          index={index} 
          iconJs={iconJs} 
          iconSize={iconSize}
          iconColor={iconColor}
          bgColor={bgColor}
          scanBgColor={scanBgColor}
          callBack={callBack}
          active={selection?.indexOf(item)!=-1}
        /> 

      )
      
};


    const formatData = (dataList, numColumns) => {
      const data = alphabeticSort(dataList)
      let blanks = [];
      const numberOfFullRows = Math.floor(data.length / numColumns);
      let numberOfElementsLastRow = data.length - (numberOfFullRows * numColumns);
      while (numberOfElementsLastRow !== numColumns && numberOfElementsLastRow !== 0) {
        //data.push({ key: `blank-${numberOfElementsLastRow}`, empty: true });
        blanks.push({ key: `blank-${numberOfElementsLastRow}`, empty: true });
        numberOfElementsLastRow++;
      }

      console.log('DATA :', data);

      return [...alphabeticSort(data), ...blanks]
    }
    

    return(
      
    <View style={{flex:1, padding:forcePadding || 0, backgroundColor:'transparent',}}>
      <FlatList
        data={formatData(selectable, numColumns)}
        renderItem={renderItem}
        keyExtractor={(item, index) => "key_"+item} 
        numColumns={numColumns}
        //refreshing={true}
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