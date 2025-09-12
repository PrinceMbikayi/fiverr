import React from 'react';
import { View, StyleSheet} from 'react-native';
import { useObject } from '_hooks/object';
import { HeterogeneousLightPlugWidget } from './HeterogeneousLightPlugWidget';



export const RenderLightPlugGroupWidget = (props) => {

    const {itemId} = props;

    return(
      <View>
        <HeterogeneousLightPlugWidget itemId = {itemId} iconSize={48} />
      </View>
    )
 }

 const styles = StyleSheet.create({
  container : {
    flex:1,
    justifyContent:'center',
    alignItems:'flex-start',
    flexDirection:'column',
    marginHorizontal:5,
    marginVertical:5,
    height:70,
  },
  iconDisplay:{
      flexDirection:'row',
      margin:0,
      borderWidth:1,
      borderRadius:7,
      justifyContent:'space-evenly',
      //backgroundColor:'white'
  },

  body:{
    backgroundColor:'transparent',
    flex:1,
    flexDirection:'column',
    alignItems:'flex-start', 
    justifyContent:'flex-start',
  }
})