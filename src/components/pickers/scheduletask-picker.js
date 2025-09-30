import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';

import {withTheme} from '_theming/themeProvider';
import {connect} from 'react-redux';
import RNPickerSelect from 'react-native-picker-select';
import styled from 'styled-components/native';
//import {SvgCss} from 'react-native-svg';
import {SvgCss} from 'react-native-svg/css';
import {withTranslation, i18next} from 'react-i18next';

import * as ObjectHelpers from '_helpers/objects';
import * as ScenarioHelpers from '_helpers/scenarios';
import {DelayPicker} from '@components/ui/pickers/delayPicker';
import {SunPicker} from '@components/ui/pickers/sunPicker';
import {appIcons} from '_assets/icons/appIcons';

//-------------------------------------------------------------
const _rawDatas = [
  {label: '4/h-', value: -4 * 60},
  {label: '3/h-', value: -3 * 60},
  {label: '2/h-', value: -90},
  {label: '60/mn-', value: -1 * 60},
  {label: '45/mn-', value: -1 * 45},
  {label: '30/mn-', value: -1 * 30},
  {label: '15/mn-', value: -1 * 15},
  {label: '10/mn-', value: -1 * 10},
  {label: '5/mn-', value: -1 * 5},
  {label: '0', value: -1 * 0},
  {label: '5/mn+', value: 1 * 5},
  {label: '10/mn+', value: 1 * 10},
  {label: '15/mn+', value: 1 * 15},
  {label: '30/mn+', value: 1 * 30},
  {label: '45/mn+', value: 1 * 45},
  {label: '60/mn+', value: 1 * 60},
  {label: '2/h+', value: 2 * 60},
  {label: '3/h+', value: 3 * 60},
  {label: '4/h+', value: 4 * 60},
];

TabButtonComponent = props => {
  const {iconColor} = props;
  return (
    <View
      style={[
        tabButtonComponentStyle,
        {borderColor: props.iconColor},
        props.selected ? {borderRightWidth: 0} : {borderRightWidth: 1},
        props.last ? {borderBottomWidth: 0} : {},
      ]}>
      <TouchableOpacity
        activeOpacity={0.3}
        underlayColor="#DDDDDD"
        onPress={() => {
          props.callback(props.index);
        }}>
        <TabButton>
          <SvgCss
            xml={appIcons[props.icon]}
            width="48"
            height="48"
            fill={iconColor}
          />
        </TabButton>
      </TouchableOpacity>
    </View>
  );
};

const tabButtonComponentStyle = {
  flex: 1,
  width: '100%',
  borderRightWidth: 1,
  borderBottomWidth: 1,
  alignItems: 'center',
  justifyContent: 'center',
};

//-------- COMPONENT REALLY START HERE

class ScheduleTaskPicker extends Component {
  constructor(props) {
    //console.log("ScheduleTaskPicker",props)
    super(props);
    this.my_ref = React.createRef();
    var {itemId, taskName, taskObject, initTime} = props;

    var initTime = '13:00:00';
    var initScenario;
    if (taskObject == undefined) {
      //initialTime =
    } else {
      let taskDescription =
        taskObject.description ||
        taskObject?.statusDictionary?.__json_description;
      if (typeof taskDescription == 'string')
        taskDescription = JSON.parse(taskDescription);

      initTime = ScenarioHelpers.formatObjectScheduleTaskTime(
        taskDescription.date,
      );

      if (initTime.indexOf(':') == -1) initTime = '13:00:00';
      const scenarioId = taskDescription.scenarioId;
      if (scenarioId != undefined) {
        initScenario = ObjectHelpers.getObjectById(scenarioId);
      }
    }

    this.state = {
      currentTabIndex: 0,
      currentSelections: {regularTime: initTime, sunrise: 9, sunset: 9},
      selectionChanged: false,
      pickerSelections: [],
      initialTime: initTime,
      days: this.initDays,
      isOnOff: false,
      scenarios: {},
      objectId: props.itemId,
      isEnabled: true,
      isMounted: true,
      taskName: taskName,
      notification: {active: false},
    };

    // Needed by Location / Weather picker
    this.inputRefs = {
      location: null,
    };
    console.log('currentPicker', this.getCurrentPickerId());
    //this.tellParent(this.getCurrentPickerId());
  } // end constructor and init method should be better

  tabsPickerIds = ['regularTime', 'sunrise', 'sunset'];

  getCurrentPickerId = () => {
    return this.tabsPickerIds[this.state.currentTabIndex];
  };

  getDescription = tObj => {
    if (tObj == undefined) return {};

    let taskDescription =
      tObj.description || tObj?.statusDictionary?.__json_description;
    if (typeof taskDescription == 'string')
      taskDescription = JSON.parse(taskDescription);
    return taskDescription;
  };

  onSelectTab = async index => {
    this.setState({currentTabIndex: index}, () => {
      //console.log("onSelectTab",index,this.state,this.getCurrentPickerId())
      this.tellParent(this.getCurrentPickerId());
    });
  };

  pickerMap = selectionKey => {
    let pickerDatas = {labels: []};
    _rawDatas.map((item, index) => {
      let labelDatas = item.label.split('/');
      pickerDatas.labels.push(
        labelDatas[0] + ' ' + this.props.t('scenarios:' + labelDatas[1]),
      );
      if (labelDatas[0] == 0) {
        pickerDatas.labels[index] = this.props.t('scenarios:' + selectionKey);
      }
      return {
        label: labelDatas[0] + ' ' + this.props.t('scenarios:' + labelDatas[1]),
        value: item.value,
      };
    });

    //console.log("pickerDatas",pickerDatas)
    return pickerDatas;
  };

  componentDidMount() {
    const {taskObject, weathersList} = this.props;
    const description = this.getDescription(taskObject);
    if (weathersList.length > 0 && description?.schedulerId) {
      const foundIndex = weathersList.findIndex(
        element => element.value == description?.schedulerId,
      );
      if (foundIndex) {
        const foundLocation = weathersList[foundIndex];
        this.setState({location: foundLocation.value});
      }
    }
    if (description?.event) {
      this.onSelectTab(this.tabsPickerIds.indexOf(description?.event));
    }
  }

  pickersDatas = {
    sunrise: this.pickerMap('SUNRISE'),
    sunset: this.pickerMap('SUNSET'),
  };

  getPickerDatas = id => {
    if (this.pickerDatas == undefined) {
      this.pickersDatas = {
        sunrise: this.pickerMap('SUNRISE'),
        sunset: this.pickerMap('SUNSET'),
      };
    }

    return this.pickersDatas[id];
  };

  // sunrise and sunset callback
  pickerSelectionCallback = (index, pickerId) => {
    //  console.log("check here ::: pickerSelectionCallback ",index,pickerId,this.state.currentTabIndex)
    if (this.state.currentTabIndex == 0 && pickerId != 'regularTime')
      return true;
    let newSelections = {...this.state.currentSelections};
    newSelections[pickerId] = index;
    this.setState({currentSelections: {...newSelections}}, () => {
      this.tellParent(pickerId);
    });
  };

  timeSelectionCallback = (value, pickerId) => {
    let newSelections = {...this.state.currentSelections};
    newSelections[pickerId] = value;
    this.setState({currentSelections: newSelections}, () => {
      this.tellParent(pickerId);
    });
  };

  onLocationChange = value => {
    this.setState(
      {
        location: value,
      },
      () => this.tellParent(this.getCurrentPickerId()),
    );
  };

  //-------------

  tellParent = pickerId => {
    const datasToParent = this.formatSendbackDatas(pickerId);
    /*
        console.log("-------- tellParent "+pickerId+" -------------");
        console.log(this.state.currentSelections)
        console.log('data to parent = ',datasToParent)
        console.log("-------- /tellParent -------------");
        */
    if (this.props.callback) {
      if (pickerId == this.getCurrentPickerId()) {
        this.props.callback(datasToParent, pickerId, this.getCurrentPickerId());
      }
    }
  };

  formatSendbackDatas = pickerId => {
    switch (pickerId) {
      case 'regularTime':
      case 'otherTime':
        return this.formatTime(pickerId);
        break;
      case 'sunrise':
      case 'sunset':
        const event = pickerId;
        console.log(
          'formatSendbackDatas',
          pickerId,
          this.state.currentSelections,
        );
        const offset = _rawDatas[this.state.currentSelections[pickerId]].value;
        return {event: event, offset: offset, weatherId: this.state.location};
    }
    return -1;
  };

  formatTime = pickerId => {
    const currentTimeAsArray =
      this.state.currentSelections[pickerId].split(':');
    const retTime = currentTimeAsArray
      .reduce(function (r, v, i) {
        v = parseInt(v);
        r += (v < 10 ? '0' : '') + v + ':';
        return r;
      }, '')
      .slice(0, -1);

    return {time: retTime};
  };

  //ANCHOR Render
  render() {
    const {theme, t} = this.props;
    const textColor =
      theme['schedule_widget_text_color'] || theme['screen--color--text'];
    return (
      <>
        <View style={{minHeight: 200, borderColor: '#777', borderWidth: 1}}>
          <View
            style={{flex: 1, flexDirection: 'row', height: 200, maxHeigh: 200}}>
            <View id="TabMenu" style={{minWidth: 80, height: 200}}>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <TabButtonComponent
                  callback={this.onSelectTab}
                  index={0}
                  selected={this.state.currentTabIndex == 0}
                  icon="clock"
                  iconColor={textColor}></TabButtonComponent>
                <TabButtonComponent
                  callback={this.onSelectTab}
                  index={1}
                  selected={this.state.currentTabIndex == 1}
                  icon="sunrise"
                  iconColor={textColor}></TabButtonComponent>
                <TabButtonComponent
                  callback={this.onSelectTab}
                  index={2}
                  selected={this.state.currentTabIndex == 2}
                  last
                  icon="sunset"
                  iconColor={textColor}></TabButtonComponent>
              </View>
            </View>
            {this.state.isMounted && (
              <View id="tabContents" style={{flex: 2, height: 200}}>
                <View
                  style={[
                    {height: '100%'},
                    this.state.currentTabIndex != 0 ? styles.hidden : {},
                  ]}>
                  <View style={{}}>
                    <DelayPicker
                      initTime={this.state.initialTime}
                      pickerId="regularTime"
                      hideSeconds
                      hideLabels
                      updateCallback={this.timeSelectionCallback}
                    />
                  </View>
                </View>
                <View
                  style={[
                    {height: '100%'},
                    this.state.currentTabIndex != 1 ? styles.hidden : {},
                  ]}>
                  <SunPicker
                    pickerDatas={this.pickersDatas['sunrise']}
                    pickerId="sunrise"
                    initialPosition={9}
                    callback={this.pickerSelectionCallback}
                  />
                </View>
                <View
                  style={[
                    {height: '100%'},
                    this.state.currentTabIndex != 2 ? styles.hidden : {},
                  ]}>
                  <SunPicker
                    pickerDatas={this.pickersDatas['sunset']}
                    pickerId="sunset"
                    initialPosition={9}
                    callback={this.pickerSelectionCallback}
                  />
                </View>
              </View>
            )}
          </View>
        </View>
        <View style={{flex: 1, flexDirection: 'row', height: 40}}>
          {this.state.currentTabIndex > 0 && (
            <>
              <View
                style={{
                  minWidth: 80,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <SvgCss
                  xml={appIcons['mapLocation']}
                  width="24"
                  height="24"
                  fill={textColor}
                />
              </View>
              <View
                style={{
                  minWidth: 240,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <RNPickerSelect
                  placeholder={{
                    label: t('scenarios:SELECT_WEATHER'),
                    value: null,
                  }}
                  value={this.state.location}
                  items={this.props.weathersList}
                  style={{
                    inputAndroid: {
                      ...pickerSelectStyles.inputAndroid,
                      color: textColor,
                    },
                    inputIOS: {
                      ...pickerSelectStyles.inputIOS,
                      color: textColor,
                    },
                  }}
                  onValueChange={this.onLocationChange}
                  ref={el => {
                    this.inputRefs.location = el;
                  }}
                  textInputProps={{color: textColor}}
                />
              </View>
            </>
          )}
        </View>
        {this.props.children}
      </>
    );
  }
}

export default withTranslation()(
  withTheme(connect(mapStateToProps)(ScheduleTaskPicker)),
);

function mapStateToProps(state) {
  let locations = [];
  const weathers = ObjectHelpers.getWeatherObjects();
  if (weathers) {
    locations = weathers.reduce(function (r, v, i) {
      r.push({label: v.name, value: v.id});
      return r;
    }, []);
  }

  return {
    weathersList: locations,
  };
}

const TabButton = styled.View``;

const styles = StyleSheet.create({
  hidden: {
    width: 0,
    height: 0,
    borderWidth: 0,
    borderColor: 'red',
  },
});
const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 10,
    paddingHorizontal: 10,
    paddingRight: 30, // to ensure the text is never behind the icon
    marginTop: 0,
    width: '100%',
    color: 'red',
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'purple',
    borderRadius: 8,
    color: 'green',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});
