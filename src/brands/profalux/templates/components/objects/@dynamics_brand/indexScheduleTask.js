import React from 'react';
import {SafeAreaView,Alert,Text, Platform,BackHandler,FlatList, View, ScrollView, Pressable, Linking} from 'react-native';
import TypeDefaultSchedule from '_components/objects/default/defaultSchedule';


const TypeDynamicSchedule = (props) => {
  
    const { theme,itemId,typeName,uniType,navigation,navigationParams} = props; 

    return (
       <TypeDefaultSchedule itemId={itemId} typeName={typeName}  uniType={uniType} navigationParams={navigationParams} navigation={navigation}/>     
    )
}

export default TypeDynamicSchedule;