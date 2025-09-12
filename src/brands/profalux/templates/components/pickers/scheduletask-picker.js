import '_brand/templates/components/locales'
import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Pressable, Platform } from 'react-native';

import { withTheme } from '_theming/themeProvider';
//import { connect } from "react-redux";
import RNPickerSelect from 'react-native-picker-select';
import styled from 'styled-components/native';
import { SvgCss } from 'react-native-svg';
import { withTranslation, i18next } from 'react-i18next';
import { useStore, useSelector, useDispatch, connect } from 'react-redux';


import * as ObjectHelpers from '_helpers/objects';
import * as ScenarioHelpers from '_helpers/scenarios';
import { DelayPicker } from '_brand/templates/components/ui/pickers/delayPicker';
import { SunPicker } from '_brand/templates/components/ui/pickers/sunPicker';
import { appIcons } from '_assets/icons/appIcons';

import { TabButtonComponent } from "_brand/templates/components/pickers/TabButtonComponent"
//import { getUser, getUserDefaultWeather, getObjectsByTypeName} from '_helpers/selectors';


//-------------------------------------------------------------
const _rawDatas = [
    // {'label':'4/h-','value':(-4*60)},
    // {'label':'3/h-','value':(-3*60)},
    { 'label': '2/h-', 'value': (-2 * 60) },
    { 'label': '60/mn-', 'value': (-1 * 60) },
    { 'label': '45/mn-', 'value': (-1 * 45) },
    { 'label': '30/mn-', 'value': (-1 * 30) },
    { 'label': '15/mn-', 'value': (-1 * 15) },
    { 'label': '10/mn-', 'value': (-1 * 10) },
    { 'label': '5/mn-', 'value': (-1 * 5) },
    { 'label': '0', 'value': (1 * 0) },
    { 'label': '5/mn+', 'value': (1 * 5) },
    { 'label': '10/mn+', 'value': (1 * 10) },
    { 'label': '15/mn+', 'value': (1 * 15) },
    { 'label': '30/mn+', 'value': (1 * 30) },
    { 'label': '45/mn+', 'value': (1 * 45) },
    { 'label': '60/mn+', 'value': (1 * 60) },
    { 'label': '2/h+', 'value': (2 * 60) },
    // {'label':'3/h+','value':(3*60)},
    // {'label':'4/h+','value':(4*60)},
];



const tabButtonComponentStyle = {
    flex: 1,
    width: "100%",
    borderRightWidth: 1,
    borderBottomWidth: 1,
    alignItems: 'center',
    justifyContent: 'center'
}


//-------- COMPONENT REALLY START HERE

class ScheduleTaskPicker extends Component {

    constructor(props) {

        console.log("ScheduleTaskPicker", props)
        super(props);
        this.my_ref = React.createRef();
        var { taskName, taskObject, trigger = props.trigger, withTimeText = props.withTimeText=true } = props
        //const userDefaultWeather = useSelector(state =>getUserDefaultWeather(state)) || -1;

        console.log('TRIGGER_POINT_CHECK_PICKER :', trigger);
        let initTime = '12:00';
        let initialIndex = 0;
        let initialOffsetIndex = 7;
        if (trigger != undefined) {
            const event = trigger?.event
            const offset = trigger?.offset


            console.log('OFFSET_INDEX :', initialOffsetIndex);
            //_rawDatas[this.state.currentSelections[pickerId]].value
            if (trigger.hasOwnProperty('event')) {
                event == 'sunrise' ? initialIndex = 1 : initialIndex = 2
                _rawDatas.map((item, index) => {
                    if (item.value == offset) {
                        initialOffsetIndex = index
                    }
                })
            } else {
                initialIndex = 0
                const hour = trigger?.hour;
                const minute = trigger?.minute

                const myHour = hour //addZeroOnTheLeft(hour)
                const myMinute = minute//addZeroOnTheLeft(minute)
                initTime = `${myHour}:${myMinute}` || "12:13";
                console.log('VOIR_INIT :', initTime);
            }
        }
        console.log('TRUE_INIT_TIME :', initTime);

        this.state = {
            currentTabIndex: initialIndex,
            currentSelections: { 'regularTime': initTime, 'sunrise': initialOffsetIndex, 'sunset': initialOffsetIndex },
            //currentSelections:{'regularTime':initTime,'sunrise':7,'sunset':7},
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
            notification: { active: false },
            withTimeText:withTimeText

        };

        console.log('INITIAL :',);

        // Needed by Location / Weather picker
        this.inputRefs = {
            location: null
        };
        console.log("currentPicker", this.getCurrentPickerId())
        //this.tellParent(this.getCurrentPickerId()); 


    } // end constructor and init method should be better

    tabsPickerIds = ["regularTime", 'sunrise', 'sunset'];

    getCurrentPickerId = () => {
        return this.tabsPickerIds[this.state.currentTabIndex]
    }


    getDescription = (tObj) => {
        if (tObj == undefined) return {};

        let taskDescription = tObj.description || tObj?.statusDictionary?.__json_description;
        if (typeof taskDescription == 'string') taskDescription = JSON.parse(taskDescription);
        return taskDescription;
    }

    onSelectTab = async (index) => {
        console.log("onSelectTab_INDEX :", index)
        console.log("onSelectTab_CURRENT_STATE :", this.state)
        console.log("onSelectTab_NEW_SELECTION :", this.getCurrentPickerId())
        this.setState({ currentTabIndex: index }, () => {
            this.tellParent(this.getCurrentPickerId());
        })


    }


    pickerMap = (selectionKey) => {

        let pickerDatas = { labels: [] };
        _rawDatas.map((item, index) => {
            let labelDatas = item.label.split('/');
            pickerDatas.labels.push(labelDatas[0] + ' ' + this.props.t('scenarios:' + labelDatas[1]));
            if (labelDatas[0] == 0) {
                pickerDatas.labels[index] = this.props.t('scenarios:' + selectionKey);
            }
            return { 'label': labelDatas[0] + ' ' + this.props.t('scenarios:' + labelDatas[1]), 'value': item.value }
        });

        //console.log("pickerDatas",pickerDatas)
        return pickerDatas
    }

    componentDidMount() {
        const { taskObject, weathersList } = this.props;
        const description = this.getDescription(taskObject);
        if (weathersList.length > 0 && (description?.schedulerId)) {
            const foundIndex = weathersList.findIndex(element => element.value == description?.schedulerId);
            if (foundIndex) {
                const foundLocation = weathersList[foundIndex];
                this.setState({ 'location': foundLocation.value })
            }
        }
        if (description?.event) {
            this.onSelectTab(this.tabsPickerIds.indexOf(description?.event));
        }
    }


    pickersDatas = {
        'sunrise': this.pickerMap("SUNRISE"),
        'sunset': this.pickerMap("SUNSET")

    }

    getPickerDatas = (id) => {

        if (this.pickerDatas == undefined) {
            this.pickersDatas = {
                'sunrise': this.pickerMap("SUNRISE"),
                'sunset': this.pickerMap("SUNSET")
            }
        }

        return this.pickersDatas[id]
    }

    // sunrise and sunset callback
    pickerSelectionCallback = (index, pickerId) => {

        console.log("NEW_SELECTION_0", index, pickerId, this.state.currentTabIndex)
        if (this.state.currentTabIndex == 0 && pickerId != "regularTime") return true;
        let newSelections = { ...this.state.currentSelections }
        console.log('NEW_SELECTION :', newSelections);
        //  index : point to the value of offset for the selected pickerId (sunrise/sunset)
        newSelections[pickerId] = index
        this.setState({ 'currentSelections': { ...newSelections } }, () => { this.tellParent(pickerId) });
    }

    timeSelectionCallback = (value, pickerId) => {
        console.log('HAA ;', value);
        let newSelections = { ...this.state.currentSelections }
        newSelections[pickerId] = value;
        console.log("NEW_SELECTION:", newSelections)
        this.setState({ 'currentSelections': newSelections }, () => { this.tellParent(pickerId) });
    }

    onLocationChange = (value) => {
        this.setState({
            location: value,
        }, () => this.tellParent(this.getCurrentPickerId()));
    }

    //-------------

    tellParent = (pickerId) => {

        const datasToParent = this.formatSendbackDatas(pickerId);
        /*
        console.log("-------- tellParent "+pickerId+" -------------");
        console.log(this.state.currentSelections)
        console.log('data to parent = ',datasToParent)
        console.log("-------- /tellParent -------------");
        */
        if (this.props.callback) {
            if (pickerId == this.getCurrentPickerId()) {
                this.props.callback(datasToParent, pickerId, this.getCurrentPickerId())
            }
        }
    }

    formatSendbackDatas = (pickerId) => {

        // Harold Modif:  Get the user weather to attach to the picker
        //const weathers = ObjectHelpers.getWeatherObjects(); 
        //let userWeather ;  
        let userFavWeather = ObjectHelpers.getUserDefaultWeather()
        let userWeather = Number(userFavWeather)
        console.log("PICKER_SELECTED_DATA_WEATHER:", userWeather)
        // if(weathers.length !=0) {
        //     userWeather = userDefaultWeather
        //     //userWeather = weathers[weathers.length -1]
        //     console.log("PICKER_SELECTED_DATA_WEATHER:", userWeather)
        // }

        switch (pickerId) {
            case 'regularTime':
            case 'otherTime':
                console.log('REGULAR_TIME_PICKER :', this.formatTime(pickerId));
                return this.formatTime(pickerId)
                break;
            case 'sunrise':
            case 'sunset':
                console.log('CHECK_POINT_1 :', pickerId);
                const event = pickerId;
                console.log("formatSendbackDatas", pickerId, this.state.currentSelections);
                const offset = _rawDatas[this.state.currentSelections[pickerId]].value;
                console.log("PICKER_SELECTED_DATA_WEATHER:", { 'event': event, 'offset': offset, 'weatherId': userWeather })
                return { 'event': event, 'offset': offset, 'weatherId': userWeather }

        }
        return -1
    }

    formatTime = (pickerId) => {
        const currentTimeAsArray = this.state.currentSelections[pickerId].split(":");
        const retTime = currentTimeAsArray.reduce(function (r, v, i) {
            v = parseInt(v)
            r += ((v < 10) ? "0" : "") + v + ':';
            return r
        }, "").slice(0, -1);

        const arr = retTime.split(":")
        const time = `${arr[0]}:${arr[1]}`
        console.log('REGULAR_TIME_PICKER_R:', time);
        return { time: time }
    }



    //ANCHOR Render
    render() {
        const { theme, t } = this.props
        const textColor = theme["schedule_widget_text_color"] || theme["screen--color--text"];
        return (
            <>
                <View style={{}}>
                    <View style={{ flex: 1, flexDirection: 'column', paddingHorizontal: 10, backgroundColor: 'transparent' }}>
                        {this.state.withTimeText == true &&
                            <View style={{ flex: 1, flexDirection: 'row', backgroundColor: '#d6d6d6', justifyContent: 'space-around', alignItems: 'center', marginTop: 20, borderRadius: 10, padding: 2 }}>
                                <TabButtonComponent callback={this.onSelectTab} index={0} selected={(this.state.currentTabIndex == 0)} label={t("components:HOUR")} textColor={textColor} />
                                <View style={{ borderRightWidth: 0.8, height: '50%', borderColor: textColor, marginHorizontal: 3 }}></View>
                                <TabButtonComponent callback={this.onSelectTab} index={1} selected={(this.state.currentTabIndex == 1)} label={t("components:DAWN")} textColor={textColor} />
                                <View style={{ borderRightWidth: 0.8, height: '50%', borderColor: textColor, marginHorizontal: 3 }}></View>
                                <TabButtonComponent callback={this.onSelectTab} index={2} selected={(this.state.currentTabIndex == 2)} label={t("components:SUNSET")} textColor={textColor} />
                            </View>
                        }
                        {this.state.isMounted &&
                            <View id="tabContents" style={{ flex: 2, height: Platform.OS == "android" ? 190 : 200, }}>
                                <View style={[{ height: "100%", backgroundColor: 'transparent' }, this.state.currentTabIndex != 0 ? styles.hidden : {}]}>
                                    <View style={{}}>
                                        <DelayPicker initTime={this.state.initialTime} pickerId="regularTime" hideSeconds updateCallback={this.timeSelectionCallback} />
                                    </View>
                                </View>
                                <View style={[{ height: "100%" }, this.state.currentTabIndex != 1 ? styles.hidden : {}]}>
                                    <SunPicker pickerDatas={this.pickersDatas['sunrise']} pickerId="sunrise" initialPosition={this.state.currentSelections['sunrise']} callback={this.pickerSelectionCallback} />
                                </View>
                                <View style={[{ height: "100%" }, this.state.currentTabIndex != 2 ? styles.hidden : {}]}>
                                    <SunPicker pickerDatas={this.pickersDatas['sunset']} pickerId="sunset" initialPosition={this.state.currentSelections['sunset']} callback={this.pickerSelectionCallback} />
                                </View>
                            </View>
                        }
                    </View>
                </View>
                {this.props.children}
            </>
        );
    }
}

export default withTranslation()(withTheme(connect(mapStateToProps)(ScheduleTaskPicker)))


function mapStateToProps(state) {

    let locations = [];
    const weathers = ObjectHelpers.getWeatherObjects();
    if (weathers) {
        locations = weathers.reduce(function (r, v, i) {
            r.push({ 'label': v.name, 'value': v.id })
            return r
        }, [])
    }

    console.log("CHECK_WEATHER_LIST :", locations)
    return {
        'weathersList': locations
    }
};



const TabButton = styled.View`
   
`;

const styles = StyleSheet.create({
    hidden: {
        width: 0,
        height: 0,
        borderWidth: 0,
        borderColor: 'red'
    }
});
const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        fontSize: 16,
        paddingVertical: 10,
        paddingHorizontal: 10,
        paddingRight: 30, // to ensure the text is never behind the icon
        marginTop: 0,
        width: '100%',
        color: 'red'
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