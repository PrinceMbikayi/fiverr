import React from 'react';
import { View, StyleSheet} from 'react-native';
import { useObject } from '_hooks/object';
import TypeDynamic from '_brand/templates/components/objects/@dynamics_brand/routines/index';





export const EquipmentRender = (props)=> {

  const {id} = props;

  const uObject = useObject(id)
  const {typeName} = uObject?.objectDatas
  console.log("CHECCKKKKK : ", typeName)


  return (

    <View style={{ backgroundColor: 'transparent', paddingVertical: 0, borderWidth:4, borderColor:'red'}}>
        <TypeDynamic type={typeName} itemId={id} uObject={uObject}/>
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'pink',
    flex: 1
  },
  button: {
    flex: 1,

  },
  buttonText: {
    padding: 20,
    color: 'white'
  }
})