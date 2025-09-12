
import React, {useState} from 'react';
import { Text, View,StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '_theming/themeProvider';
//import {Picker} from '@react-native-community/picker';
import {Picker} from '@react-native-picker/picker';



export const SunPicker = (props) => {
  //console.log("SunPicker",props)
  const {  navigation,pickerDatas,initialPosition,callback,pickerId} = props;
  const { t, i18n } = useTranslation(); 
  const {theme} = useTheme();
  const [_selection,_setSelection] = useState(initialPosition); 

  console.log('_setSelection', props);
  
  const onSelect = (index) => {
   
    _setSelection(index)
    if(callback)callback(index,pickerId)
  }
    
      //console.log("pickerDatas",pickerDatas)

      const pickerTextSize = 20;
    return (
        <View style={{backgroundColor:"transparent",height:200}}>           
           <View style={[styles.container]}> 
                          <Picker
                            selectedValue={_selection}
                            style={{height: 50, width: '100%'}}
                            onValueChange={(itemValue, itemIndex) => {
                                   onSelect(itemIndex)
                              }
                            }

                            itemStyle={{color:"#3C3C43"}}
                            >
                            {pickerDatas.labels.map(function(v,i){
                              return ( <Picker.Item label={v} value={i} key={'sp_'+v}/>)
                            })

                            }
                           
                          </Picker>
                          
                <View>
                   
                </View>
            </View>
        </View>
    );
}
const stylesA = {
    title : {
        color: "#3C3C43",
        fontSize:20
    }
}

let styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    width:'100%',
   
   
  },
  caption: {
    width: null,
    flex: 1,
    alignItems:'center'
  },
  wheelPicker: {
    height: 150,
    width: null,
    flex: 1,
  },
  dateWheelPicker: {
    height: 150,
    width: null,
    flex: 3,
  },
})