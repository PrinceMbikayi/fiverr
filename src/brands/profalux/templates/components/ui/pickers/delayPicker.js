import {
  WheelPicker
} from "react-native-wheel-picker-android";
/* import picker components befoire react is needed ?? */
import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '_theming/themeProvider';


export const DelayPicker = (props) => {
  const { t, i18n } = useTranslation();
  const { theme } = useTheme();

  const { initTime = "13:00" } = props
  const initialValues = initTime.split(':');

  console.log('INIT_TIME_PICKER_ANDROID :', initTime, initialValues);

  const formatPicker = (start, end) => {
    let arr = []
    let rel = {};
    for (let i = start; i <= end; i++) {
      // Do
      let key = (i < 10) ? "0" + i : i.toString();
      let val = i;
      arr.push(key);
      rel[val] = key
    }
    return { 'labels': arr, 'rel': rel }
  }
  const _hoursDatas = formatPicker(0, 23);
  const _minutesDatas = formatPicker(0, 59);
  const _secondsDatas = formatPicker(0, 59);



  //console.log("initialValues",props.initTime)
  const [_isMounted, _setIsMounted] = useState(0)
  const [_hours, _setHours] = useState(parseInt(initialValues[0]));
  const [_minutes, _setMinutes] = useState(parseInt(initialValues[1]));
  const [_seconds, _setSeconds] = useState(parseInt(initialValues[2]));

  // componentDidMount
  useEffect(() => {
    //console.log('picker mounted')
    setTimeout(() => {
      _setHours(parseInt(initialValues[0]));
      _setMinutes(parseInt(initialValues[1]));
      _setSeconds(parseInt(initialValues[2]));
      //console.log("timeout mounted")
    }, 100);

    _setIsMounted(1);
  }, []);





  const recomposeTime = (h, m, s) => {
    return "" + h + ":" + m + ":" + s;
  }

  const _changeHours = (val) => {
    if (!_isMounted) return true;
    _setHours(val)
    _tellParent(recomposeTime(val, _minutes, _seconds))
  }

  const _changeMinutes = (val) => {
    if (!_isMounted) return true;
    _setMinutes(val);
    _tellParent(recomposeTime(_hours, val, _seconds))
  }

  const _changeSeconds = (val) => {
    if (!_isMounted) return true;
    _setSeconds(val);
    _tellParent(recomposeTime(_hours, _minutes, val))
  }




  const _tellParent = (value) => {


    const newVal = value || recomposeTime(_hours, _minutes, _seconds);

    if (props.updateCallback) props.updateCallback(newVal, props.pickerId);

  }


  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);

    console.log("Picker onChange", currentDate)
  };







  const pickerTextSize = 20;
  return (
    <View>
      {_isMounted == 1 &&
        <View>
          <View style={[styles.container]}>

            <WheelPicker

              data={_hoursDatas.labels}
              selectedItem={_hours}
              onItemSelected={_changeHours}
              initPosition={parseInt(initialValues[0])}// Add to display initial condition

              indicatorWidth={2}
              isCyclic={false}
              selectedItemTextSize={pickerTextSize}
              itemTextSize={pickerTextSize}
              style={[styles.wheelPicker]}
              selectedItemTextColor={theme.body_color_text}


            />
            {/* <Text>:</Text> */}
            <WheelPicker

              data={_minutesDatas.labels}
              initPosition={parseInt(initialValues[1])} // Add to display initial condition
              selectedItem={_minutes}
              onItemSelected={_changeMinutes}
              indicatorWidth={2}
              isCyclic={false}
              selectedItemTextSize={pickerTextSize}
              itemTextSize={pickerTextSize}
              style={[styles.wheelPicker]}
              selectedItemTextColor={theme.body_color_text}
            />
            {/* {props.hideSeconds != true &&

              <>
                <Text>:</Text>
                <WheelPicker
                  selectedItem={_seconds}

                  data={_secondsDatas.labels}
                  onItemSelected={_changeSeconds}
                  indicatorWidth={2}
                  isCyclic={false}
                  selectedItemTextSize={pickerTextSize}
                  itemTextSize={pickerTextSize}
                  style={[styles.wheelPicker]}
                  selectedItemTextColor={theme.body_color_text}
                />
              </>
            } */}
            <View>

            </View>
          </View>

        </View>
      }
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