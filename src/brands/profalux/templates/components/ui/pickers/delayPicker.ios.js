
/* import picker components befoire react is needed ?? */
import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '_theming/themeProvider';


//import {Picker} from '@react-native-community/picker';
import { Picker } from '@react-native-picker/picker';


export const DelayPicker = (props) => {
  const { t, i18n } = useTranslation();
  const { theme, baseColors } = useTheme();
  const { textColor, headerBackgroundColor, headerTextColor } = baseColors;

  const { initTime = "13:00" } = props
  console.log('MM :', props);
  const initialValues = initTime.split(':');

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



  console.log("initialValues", props.initTime)
  const [_isMounted, _setIsMounted] = useState(0)
  const [_hours, _setHours] = useState(parseInt(initialValues[0]));
  const [_minutes, _setMinutes] = useState(parseInt(initialValues[1]));
  const [_seconds, _setSeconds] = useState(parseInt(initialValues[2]));

  // componentDidMount
  useEffect(() => {
    console.log('picker mounted')
    setTimeout(() => {
      _setHours(parseInt(initialValues[0]));
      _setMinutes(parseInt(initialValues[1]));
      _setSeconds(parseInt(initialValues[2]));
      console.log("timeout mounted")
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
      {/* {props.hideLabels != true &&
                <View style={[styles.container]}>
                  <View   style={[styles.caption]}><Text>Heures</Text></View>
                  <Text>:</Text>
                  <View   style={[styles.caption]}><Text>Minutes</Text></View>
                  {props.hideSeconds != true &&
                            
                            <>
                  <Text>:</Text>
                  <View   style={[styles.caption]}><Text>Secondes</Text></View>
                  </>  
                          }  
                </View>
            } */}
      <View style={[styles.container]}>

        <Picker
          selectedValue={_hours}
          style={{ height: 50, width: (props.hideSeconds == true) ? '50%' : '33%' }}
          onValueChange={(itemValue, itemIndex) => {
            _changeHours(itemIndex)
          }
          }
          itemStyle={{ color: "#3C3C43" }}
        >
          {
            _hoursDatas.labels.map(function (v, i) {
              return (<Picker.Item label={v} value={i} key={i} />)
            })

          }
        </Picker>
        {/* <Text style={{color:'red'}}>:</Text> */}
        <Picker
          selectedValue={_minutes}
          style={{ height: 50, width: (props.hideSeconds == true) ? '50%' : '33%' }}
          itemStyle={{ color: "#3C3C43" }}
          onValueChange={(itemValue, itemIndex) => {
            _changeMinutes(itemIndex)
          }
          } >
          {
            _minutesDatas.labels.map(function (v, i) {
              return (<Picker.Item label={v} value={i} key={i} />)
            })
          }
        </Picker>
        {props.hideSeconds != true &&

          <>
            <Text>:</Text>
            <Text>:</Text>
            <Picker
              selectedValue={_seconds}
              style={{ height: 50, width: (props.hideSeconds == true) ? '50%' : '33%' }}
              itemStyle={{ color: textColor }}
              onValueChange={(itemValue, itemIndex) => {
                _changeSeconds(itemIndex)
              }
              } >
              {
                _secondsDatas.labels.map(function (v, i) {
                  return (<Picker.Item label={v} value={i} key={i} />)
                })
              }
            </Picker>
          </>
        }
        <View>

        </View>
      </View>

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