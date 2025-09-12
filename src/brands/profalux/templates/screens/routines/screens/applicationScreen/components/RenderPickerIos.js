import React from 'react';
import { Picker } from '@react-native-picker/picker';
import { useTheme } from '_theming/themeProvider'


export const RenderPickerIos = (props) => {
    const {data, selectedValue, onValueChange, pickerWidth, pickerHeight} = props;
    const { theme } = useTheme();
    const bgcolor = theme?.prflxbgColor || 'white';
    const headerBgColor = theme?.prflxHeaderBackground || '#FFFFFF'
    const textColor = theme?.prflxTextColor || 'black'
    return(
      <Picker
        selectedValue={selectedValue}
        onValueChange={onValueChange}
        itemStyle={{color:textColor}}
        style={{width: pickerWidth, height: pickerHeight}}
       >
        {data.map((item, index) => {
          return(
            <Picker.Item label={item} value={item} key={index} />
          )
        })}
      </Picker>
    )
  }