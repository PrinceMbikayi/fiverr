import {
  WheelPicker,
  TimePicker,
  DatePicker
} from "react-native-wheel-picker-android";
/* import picker components before react is needed ?? */
import React, { useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';

import { useTranslation } from 'react-i18next';
import { useTheme } from '_theming/themeProvider';
import { Trans } from 'react-i18next';
import { ButtonInList } from '@components/ui/buttons/buttonInList';





export const SimplePicker = (props) => {
  const { navigation, pickerDatas, initialPosition, callback, pickerId } = props;
  const { t, i18n } = useTranslation();
  const { theme } = useTheme();
  const [_selection, _setSelection] = useState(initialPosition);


  const onSelect = (index) => {
    // attention pose problème quand on utilise _selection pour initPosition
    // laisser  initPosition={initialPosition} dans WheelPicker
    _setSelection(index)
    if (callback) callback(index, pickerId)
  }





  //console.log("pickerDatas",pickerDatas)

  const pickerTextSize = 20;
  const textcolor = theme['card--color--text'] || 'white';
  return (
    <View>

      <View style={[styles.container]}>


        <WheelPicker

          data={pickerDatas.labels}
          initPosition={initialPosition}
          onItemSelected={onSelect}
          indicatorWidth={2}
          isCyclic={false}
          selectedItemTextSize={pickerTextSize}
          textColor={textcolor}
          selectedItemTextColor={theme.WheelPicker_selected_item}
          itemTextSize={pickerTextSize}
          style={[styles.wheelPicker]}

        />


        <View>

        </View>
      </View>
      {/* visual test Default Componenet <Text style={{color:"white"}}>Test Test Test</Text> */}
    </View>
  );
}
const stylesA = {
  title: {
    color: '#fff',
    fontSize: 20
  }
}

let styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%',

  },
  caption: {
    width: null,
    flex: 1,
    alignItems: 'center'
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