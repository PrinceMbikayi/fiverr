import React,{Fragment} from 'react';
import {useContext,useState,useRef,useEffect,useCallback} from 'react';
import {useDispatch, useSelector } from 'react-redux';
import { Text, View,ScrollView,SafeAreaView,TouchableHighlight,TouchableWithoutFeedback,Image,Modal,Alert } from 'react-native';

import { useNavigation,useRoute,StackActions } from '@react-navigation/native';

import { useTranslation } from 'react-i18next';
import moment from 'moment/min/moment-with-locales';

import styled from 'styled-components/native';
import { TransitionPresets } from '@react-navigation/stack';
//import DateTimePickerModal from "react-native-modal-datetime-picker";
//import DateTimePicker from '@react-native-community/datetimepicker';
import DatePicker from 'react-native-date-picker'

import { Api } from '_api';
import {setScheduleDatas} from '_actions/objects';
import {HeaderWithBack} from '_components/headers/header-with-back';
import ProgramHeaterDay from '_components/objects/programs/programHeaterDay';
import { useTheme } from '_theming/themeProvider';
import PopUp from '_components/ui/popUp';
import AccessButton from '_components/forms/accessButton'
import {heaterFamilyPrograms,getModeLabel} from '_config/products/core';
import {copyDay,convertWeekToSchedulerActions,convertWeekToProgParameter,getCurrentTimeProgramAction,
        deleteHeaterScheduleTasks,
        saveSchedulesOnServer

    } from '_helpers/heaterTools';
import {domusIcons} from '_assets/icons/domusIcons';
import PureIconRender from '_components/pureIconRender';
import {LineWithIcon} from "_components/ui/base/lineIcon";
import {createMultipleScheduleTask,updateParametersOnServer} from '_api/objects';
import {ProgramRange} from './range';
import {LineContent} from './lineContent';
import {getHeaterSchedule,setHeaterSchedule} from '_services/storage';


import useHeater from '_components/objects/heater/heaterHook';

export const ProductProgramDayScreen = () => {
   
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch(); 
    const {theme,baseColors} = useTheme();
    const {bgColor,textColor,headerBackgroundColor,headerTextColor} = baseColors;   
   
    const iconColor = theme["card--color--icon"];
    //const backgroundColor = theme["card--color--bodybg"];
    const backgroundColor = theme["details_body_color"] || theme["card--color--bodybg"];

    const navigation = useNavigation();
    const route = useRoute();   
    const navigationParams = route?.params || {};     
    const {type : objectType,itemId,itemId : objectId,dayId,title} = navigationParams;
   
    const noCurrentTimeAction = ['athome_thermostat']

    const defaultMode = heaterFamilyPrograms[objectType].default;
    const { objectDatas,getMyHeatingTaskIds,scheduleDatas } = useHeater(itemId);

    // Refs for PopUps;
    const selectSimilarDayRef  = useRef();
    const rangeScrollview = useRef();
    const selectModeRef = useRef();
    const addRangeRef = useRef();
    
    //states
    const [dayToCopy,setDayToCopy] = useState(dayId)


    // redraw when ranges changes
    useEffect(() => {
       console.log("effect on dayRanges redraw",dayRanges);
    }, [dayRanges]);

    const goBack = () => {
        console.log(navigation);
        navigation.goBack();
    }

    const noHeader = ['AirConditionerAirwell'];
    const noScrollViewWrap = ['AirConditionerAirwell'];

    const capitalize = (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
   
    //const weekDatasInitial = useSelector(state => state.objects.entities.objects[objectId].schedule_datas);
    const weekDatasInitial = scheduleDatas;
    console.log("weekDatasInitial,scheduleDatas",scheduleDatas)
    const [weekDatas,setWeekDatas] = useState(weekDatasInitial);
    const [undo,setUndo] = useState(null)

    useEffect(() => {
        const toCloneInit = weekDatasInitial?.[dayId] || []
        setUndo(simpleClone(toCloneInit));
        //console.log("weekDatasInitial",toCloneInit)
     }, []);

     useEffect(() => {
       
        console.log("useEffect undo",undo)
     }, [undo]);


    useEffect(() => {
        //keep for refresh
        console.log("useEffect weekDatas")
     }, [weekDatas]);
    

    const reinitDay = () => { 
         
        setDayRanges(simpleClone(undo));
        //jsonConsole("weekDatas",weekDatas)
        weekDatas.splice(dayId,1,simpleClone(undo));
        //jsonConsole("weekDatas",weekDatas)       
        setWeekDatas(weekDatas);
        setCanSave(false);       
    }

    const simpleClone = (datas) => {
        if(datas == undefined) return [];
        return JSON.parse(JSON.stringify(datas));
    }

    const initialRanges = (weekDatasInitial) ? simpleClone(weekDatasInitial[dayId]) : [];
    
    const [dayRanges,setDayRanges] = useState(initialRanges);
    const [canSave,setCanSave] = useState(false); 

    const modifyAndSetDayRanges = (ranges) => {       
        setDayRanges(ranges);
        setCanSave(true);       
    }
    const saveRanges = async() => {

        weekDatas.splice(dayId,1,dayRanges);
        setWeekDatas(weekDatas);
        //console.log("saveRanges",JSON.parse(JSON.stringify(dayRanges)))
        setUndo(simpleClone(dayRanges))
        dispatch(setScheduleDatas(objectId,weekDatas));       
        saveSchedulesOnServer(objectId,objectType,weekDatas);
       
        // et reactivation du mode programmé courant si possible
        if(noCurrentTimeAction.indexOf(objectType) == -1 ) {
            console.log("before reactivation",objectType)
            const progModeAction = getCurrentTimeProgramAction(weekDatas);  
            const request = Api.executeAction(objectId,progModeAction,{});    
        }
         
        setCanSave(false);
    }

    const updateRanges = (rStart,param_rEnd,rMode) => {
        console.log("updateRange !!!! ",rStart,param_rEnd,rMode)
        const rEnd = (param_rEnd == "00:00" || param_rEnd < rStart) ? "23:59" : param_rEnd;

        let resultRanges = [];

        if(rEnd < rStart) {
            const rSh = Number(rStart.split(':')[0]);
            const rSm = Number(rStart.split(':')[1])
            const rEh = Number(rEnd.split(':')[0]);
            const rEm = Number(rEnd.split(':')[1]);

        } else {
          
            let rr = [...dayRanges];
            if(currentRangeIndex)rr.splice(currentRangeIndex,1);           
            resultRanges = insertSingleRange(rr,rStart,rEnd,rMode);           
            modifyAndSetDayRanges(joinSameSiblingsModes(resultRanges));
        }
    }

    const doDefaultEntry = (start,end) => {
        return {'start':start,'end':end,'mode':defaultMode}
    }

    const fillWithDefault = (ranges) => {

        const ret = ranges.reduce((r,v,i) => {
           
            if(i == 0 && v.start > "00:00") {
                r.push(doDefaultEntry("00:00",v.start))
            }             
            if(v.start == v.end) return r;
            if(i > 0 && i < ranges.length) {
                if(v.start > ranges[i-1].end) {
                    r.push(doDefaultEntry(ranges[i-1].end,v.start));                    
                }
            }
            r.push(v);
            if(i == ranges.length-1 && v.end < "23:59") {
                r.push(doDefaultEntry(v.end,"23:59"));     
            }
            return r
        },[])
        console.log("in fillWithDefault",ret)
        return ret;
    }


// ANCHOR insert

const jsonConsole = (title,val) => {
    console.log(title,JSON.parse(JSON.stringify(val)))
}


const insertSingleRange = (ranges,rStart,rEnd,rMode) => {
   
    let bStart = -1;
    let bEnd = -1  
    ranges.map((v,i) => {
        if(v.start <= rStart) {          
            bStart = i+0;
        }
        if(v.start < rEnd) {          
            bEnd = i+0
        }
    })
    console.log("insert Type 0 >> ",ranges,rStart,rEnd,rMode,bStart,bEnd)

    if(bStart != bEnd) {
        console.log("insert Type 1 ++",ranges[bStart],rStart,rEnd)
        if(ranges[bStart].end != rStart)ranges[bStart].end = rStart;
        ranges.splice(bStart+1,0,{start:rStart,end:rEnd,mode:rMode});
        const endSource = {...ranges[bEnd+1]}   
        ranges.splice(bEnd+1,0,{start:endSource.start,end:rEnd,mode:rMode});
        ranges[bEnd+2].start = rEnd;
    } else {
        console.log("insert Type 2")
        jsonConsole('---->',ranges)
        if(bStart == -1) {
            ranges.push({'start':rStart,'end':rEnd,'mode':rMode})
        } else {
            if(rMode == ranges[bStart].mode) {
                console.log("insert Type 2 a",bStart)
                if(rEnd > ranges[bStart].end) ranges[bStart].end = rEnd;
                if(bStart == 0) {
                    console.log("bStart",bStart,rStart)
                    if(rStart > "00:00") {
                        ranges[0].start = rStart;
                        ranges.splice(0,0,{'start':"00:00",'end':rStart,'mode':defaultMode})
                    } else {
                        ranges[0].end = rEnd;
                    }

                    jsonConsole('apres bStart == 0',ranges)
                }
            } else {
                console.log("insert Type 2b")
                const trueEnd = ranges[bStart].end +"";
                console.log("complete datas",ranges[bStart],{'start':rStart,'end':rEnd,'mode':rMode})
                console.log ("--->",rStart,trueEnd)
                
                // 1st reduce the size of the original range
                ranges[bStart].end = rStart;
                // then add new Range
                ranges.splice(bStart+1,0,{start:rStart,end:rEnd,mode:rMode})
                
                // finally add the remainder

                if(trueEnd > rEnd) {
                    ranges.splice(bStart+2,0,{start:rEnd,end:trueEnd,mode:ranges[bStart].mode}) 
                }                
            }
        } 
    }  
    
    console.log("rangesssssss",JSON.parse(JSON.stringify(ranges)))

    if(ranges[0].start > "00:00") {
       
        ranges.unshift(doDefaultEntry("00:00",ranges[0].start))
    }
    console.log("before joinSameSiblingsModes",JSON.parse(JSON.stringify(ranges)))

    // check for empty range
    let missingRange = {};
    
    ranges.map((v,i) => {
        if(i > 0) {
            if(v.start != ranges[i-1].end) {
                missingRange['insertPos'] = i;
                missingRange['value'] = doDefaultEntry(ranges[i-1].end,v.start);
                console.log("il manque un truc",missingRange)
            }
        }
    });
    
    if(missingRange.hasOwnProperty('insertPos')) {
        ranges.splice(missingRange.insertPos,0,missingRange.value);
    }



    const reduced = joinSameSiblingsModes(ranges);    
    console.log("after joinSameSiblingsModes",reduced)
    return fillWithDefault(reduced)
}

const joinSameSiblingsModes = (ranges) => {
    const reduced = ranges.reduce((r,v,i) => {        
        if(v.start == v.end) return r;
        if(r.length > 0 ) {           
            if(v.end < r[r.length-1].end || v.start > r[r.length-1].end || v.end <= r[r.length-1].end) return r;
            if(v.mode == r[r.length-1].mode) {               
                r[r.length-1].end = v.end;
                return r;
            }
        }
        r.push(v);
        return r;
    },[]);
    return reduced;
}
    //--------------- DAYS POPUP -------------------
    const openChooseDayPopUp = () => {
        selectSimilarDayRef.current.toggle()
    }
    // Moment with Locale
    const currentLang = i18n.language;    
    moment.locale(currentLang);   
    const wd = moment.weekdays(true);
    const selectDayDatas = wd.reduce(function(r,v,i){
                r.push({label:v,id:i});
                return r
    },[])

    const selectDay = (id) => {   
        console.log("SelectDay",id)    
        setDayToCopy(id);
    }

    useEffect(()=> {        
        if(dayToCopy != dayId)applyDay();
    },[dayToCopy])




    const applyDay = () => {
        const newRanges = copyDay(weekDatas[dayToCopy]);      
        modifyAndSetDayRanges(newRanges);       
    }
     
    const availablePrograms = heaterFamilyPrograms[objectType].programs;

    const modesDatas = Object.keys(availablePrograms).reduce(function (r, k) {
       r.push(availablePrograms[k]);
       return r
    }, []);

    const openChooseModePopUp = (params) => {
        //console.log("openChooseModePopUp",params,dayRanges)
        // -1 mean it's a new range 
        if(params && params.index > -1) {
            const range = dayRanges[params.index];       
            setCurrentRangeEdit({...range});
        }       
        selectModeRef.current.toggle()
    }

    const selectMode = (index) => {
       
        setCurrentRangeEdit({...currentRangeEdit,mode:modesDatas[index].mode});
        const newRange = {...currentRangeEdit};       
        newRange.mode = modesDatas[index].mode;
        
        if(!addRangePopVisible){
            updateRanges(newRange.start,newRange.end,newRange.mode)            
        }       
    }
    //-------------
    const getHeaterIconName = (id) => {
        return (heaterFamilyPrograms[objectType].programs) ? heaterFamilyPrograms[objectType].programs[id].icon : 'empty'
    }

    const getHeaterIcon = (id) => {
        const modeIcon = getHeaterIconName(id);       
        const icon = (domusIcons[modeIcon] != undefined) ?  modeIcon+'.svg' : "empty.svg";        
        return icon;
    }

    const getHeaterModeName = (id) => { 
        return getModeLabel(objectType,id); 
    }
    //-------------- datetimepicker --------------------
    const [timePickerVisible,setTimePickerVisible] = useState(false);   
    const [timerTime,setTimerTime] = useState(new Date());
    const [pickerTitle,setPickerTitle] = useState("");
    const [currentRangeEdit,setCurrentRangeEdit] = useState({})
    const [currentRangeIndex,setCurrentRangeIndex] = useState(null);
    const [justTest,setJustTest] = useState("nope");
    //const [rangeTimeEditItem,setRangeTimeEditItem] = useState()

    const showTimePicker = (value,range,isEnd,index) => {
       
        //console.log("showTimePicker !!!!",value,range,isEnd,index)
        setJustTest("yeah");
        setCurrentRangeIndex(index);
        const toEdit = {...range,'isEnd':isEnd};       
        setCurrentRangeEdit(toEdit);       
        var dateTarget = new Date(); 
        const hours = (value) ? Number(value.split(":")[0]) : 12 ;
        const minutes = (value) ? Number(value.split(":")[1]) : 0 ;   
        dateTarget.setHours(hours);
        dateTarget.setMinutes(minutes);        
        setTimerTime(dateTarget);        
        setPickerTitle(isEnd ? "scenarios:SELECT_TIME_END":"scenarios:SELECT_TIME_START" );        
       // console.log("showTimePicker next 5!!!!")        
        setTimePickerVisible(!timePickerVisible);
        
    }

    /*
    const oktest = () => {
        console.log("currentRangeIndex",currentRangeIndex)
        console.log("justTest",justTest)
      }

     const handleConfirmTimePickerDebug = useCallback((newDate) => {
       console.log("newDate",newDate)
       console.log("currentRangeIndex",currentRangeIndex)
       console.log("justTest",justTest);
       oktest()
      }, [justTest]);
    */
      


    const handleConfirmTimePicker = (newDate) => {

        /*
        console.log("newDate ====>",newDate)
        console.log("currentRangeIndex",currentRangeIndex)
        console.log("currentRangeEdit",currentRangeEdit)
        console.log("justTest",justTest)
        */
        const hours = newDate.getHours();
        const minutes = newDate.getMinutes();
        const str = ((hours < 10) ? "0" : "")+hours+':'+((minutes < 10) ? "0" : "")+minutes;        
        const newRange = currentRangeEdit.isEnd ? { s : currentRangeEdit.start,
                                                     e:str,
                                                     mode:currentRangeEdit.mode} 
                                                     : 
                                                    {s : str,
                                                    e:currentRangeEdit.end,
                                                    mode:currentRangeEdit.mode
                                                }
        if(addRangePopVisible) {
            setCurrentRangeEdit({start:newRange.s,end:newRange.e,mode:currentRangeEdit.mode});
        } else {  
            updateRanges(newRange.s,newRange.e,newRange.mode)
        }   
       hideDatePickerTimePicker();
    }

    
    const hideDatePickerTimePicker = () => {
        setTimePickerVisible(false)
    }

  // ANCHOR deleteRange
// reminder :  not index directly but params.index as it's a callback from render line
  const deleteRange = (params) => {
        const intIndex = params.index;       
        let newRanges = [...dayRanges];  
        newRanges[intIndex].mode = defaultMode;
        modifyAndSetDayRanges(joinSameSiblingsModes([...newRanges]));        
    }   
    //--------------------------------------------------
    const iconSize = 26;   
    const separatorColor = theme['divider_on_body'];

    // ------- renders ------------------------------
    /*
         <View style={{minHeight:48,alignItems:'center',justifyContent:'center'}}>
                    <HeaderWithBack title={_title} noShadow color={textColor} bgColor={headerBackgroundColor} />
                </View>   

    */


    const getHeader = () => {       
        const _title = capitalize(title);    
        return   <View style={{height:84,alignItems:'center',justifyContent:'flex-start',backgroundColor:headerBackgroundColor}}>
                    <HeaderWithBack title={_title} goBack={{action:goBack}} themeDependency />
                </View>
    }
    const [anchors,setAnchors] = useState({});
    
    const appendAnchor = (id,y) => {
        let newAnchors = {...anchors}
        newAnchors["anchor_"+id] = y;
        setAnchors(newAnchors)
    }
    
    const RenderRanges = () => {       
        let rangeIndex = 0;
       
        return (
            <>               
                 {
                    dayRanges && dayRanges.map((v,i) => {                        
                        if(v.mode != defaultMode) {
                            rangeIndex++;
                            return (
                                <View key={v.start}>
                                    <ProgramRange  index={i} rangeIndex={rangeIndex} data={v} deleteRangeCallback={deleteRange}
                                                chooseModeCallback={openChooseModePopUp}
                                                pickerCallback={showTimePicker}
                                                objectType={objectType}
                                    />
                                </View>
                            )
                        }
                     })
                 }
            </>
        )
    }
    
    // ANCHOR AddRange
    const [addRangePopVisible,setAddRangePopVisible] = useState(false);
    const defaultAddRange = {start:'12:00',end:'12:00',mode:defaultMode}
    
    const toggleLowPop = () => {
        console.log("hep hep hep hep WWWW")
        setAddRangePopVisible(!addRangePopVisible)        
    }
    // ANCHOR LowLevelPop
    //------- ADD RANGE POPUP ------------------
      const openAddRangePopUp = () => {
        setCurrentRangeEdit(defaultAddRange)
        toggleLowPop();
    }

    const confirmNewRange = () => {
       
            if(addRangePopVisible){
               
                let toUpdate = {...currentRangeEdit};
                if(toUpdate.end == "00:00")toUpdate.end = "23:59";
                if(toUpdate.end < toUpdate.start){
                    const userInputEnd = ""+toUpdate.end;
                    toUpdate.end = "23:59"; 
                    updateRanges("00:00",userInputEnd,toUpdate.mode)
                    //and add a special

                }                       
                setCurrentRangeEdit({...toUpdate})
                updateRanges(toUpdate.start,toUpdate.end,toUpdate.mode)
                toggleLowPop();
            }
    }


    const showTimePickerFromLineContent = (params) => {
        //console.log("params",params)
        showTimePicker(params.value,params.range,params.isEnd,params.index);
    }

    const LowLevelPop = (callback) => {
        if(addRangePopVisible) {           
            return (
                <TouchableHighlight onPress={() => toggleLowPop()} style={{backgroundColor:'rgba(0, 0, 0, 0.6)',position:'absolute',top:0,left:0,bottom:0,right:0,alignItems:'center',justifyContent:'center'}} underlayColor="rgba(0, 0, 0, 0.6)" >
                        <View style={{minWidth:250,width:250,borderColor:'black',borderWidth:2,backgroundColor:'white'}}>
                            <LineWithIcon iconLeft="clock" isAppIcon color={theme['card--color--text']} fullTouchable>
                                <LineContent label={t("scenarios:SCHEDULE_START")} callback={showTimePickerFromLineContent} value={currentRangeEdit.start} range={currentRangeEdit}/>
                            </LineWithIcon>
                            <LineWithIcon iconLeft="empty" color='blue' fullTouchable>
                                <LineContent label={t("scenarios:SCHEDULE_END")} callback={showTimePickerFromLineContent} value={currentRangeEdit.end} range={currentRangeEdit} isEnd={true}/>
                            </LineWithIcon>
                            <LineWithIcon iconLeft="sondeObject" noBorder callback={openChooseModePopUp} params={{index:-1}} fullTouchable={true}><Text style={{paddingLeft:15}}>{t(getHeaterModeName(currentRangeEdit.mode))}</Text></LineWithIcon>  
                            <View style={{flexDirection:'row',backgroundColor:'#ddd'}}>
                                <View style={{backgroundColor:'#ddd',flex:1}}>
                                    <AccessButton title={t("CANCEL")}  onPress={toggleLowPop} specialColor="black"/>  
                                </View>
                                <View style={{flex:1}}>
                                    <AccessButton title={t("ADD")}  onPress={confirmNewRange} specialColor="black"/> 
                                </View>
                            </View>  
                        </View>
                </TouchableHighlight>
            )
        
        } else {
            
            return null;
        }
    }

    const rangeTap = (index) => {
        //console.log(anchors)
        //console.log("rangeTap",index,)
        const destination = anchors["anchor_"+index];
        if(destination) {
            rangeScrollview.current.scrollTo({y: destination, animated: true })
        }        
    }
    const cancelModification = () => {
        console.log("cancel");
        reinitDay();
    }
    const saveModification = () => {
        console.log("save");
        saveRanges();
    }
    //--------------------------------------
    const ShowAlert = (title,body,buttons) => {
        Alert.alert(
        title,
        body,
        buttons,
        { cancelable: true }
        );
    
    }

    /*
    const removeSchedule = () => {
        ShowAlert( t("DELETE_OBJECT_ALERT_TITLE").toUpperCase(),
                    t("DELETE_OBJECT_ALERT_BODY"),
                    [ 
                      { text: t("CANCEL").toUpperCase(), onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                      { text: tt("DELETE").toUpperCase(), onPress: removeScheduleConfirmed}
                    ]
                  )
    }

    const removeScheduleConfirmed = () => {
        console.log("c'est confirmé pour la suppression")
    }

    */
    /*
    const onChange = (data) => {
        console.lop("onChange",data);
    }
    */
    //const [open,setOpen] = useState(false)
    const onDateChange = (dd) => {
        console.log(dd)
        setTimerTime(dd)
    }


    const onGloglo = () => {
        console.log("gloglo")
    }

    return (
        <SafeAreaView style={{flex:1}}>
            {
                getHeader()
            }
            {/*
            <Text>voilà </Text>
            <TouchableHighlight onPress={onGloglo} style={{height:30,backgroundColor:'red'}}>
                        <>
                        <H3 color={textColor}>youyou</H3>
                        </>
                    </TouchableHighlight>
             */}
             <ProgramHeaterDay ranges={dayRanges} dayId={0} range_cb= {rangeTap}/>  
                     
             <ScrollView style={{padding:15,backgroundColor:backgroundColor}} ref={rangeScrollview}>  
                <HSeparator dividerColor={separatorColor} fat/>
                <SectionText color={textColor}>{t("scenarios:HEATER_PROGRAM_APPLY_OTHER_DAY_SETTINGS")}</SectionText>
                <HSeparator dividerColor={separatorColor}/>
                <View style={{flex:1,flexDirection:'row',alignItems:'center'}}>
                    <TouchableHighlight onPress={openChooseDayPopUp} style={{flex:1}}>
                        <>
                        <H3 color={textColor}>{selectDayDatas[dayToCopy].label}</H3>
                        </>
                    </TouchableHighlight>
                    <AccessButton style={{flex:1}} title={t("APPLY")}  onPress={applyDay} specialColor={textColor}/>
                </View>
                <HSeparator dividerColor={separatorColor} fat/>
                <SectionText color={textColor}>{t("scenarios:HEATER_PROGRAM_DEFAULT_MODE")}</SectionText>
                <HSeparator dividerColor={separatorColor}/>
                <View style={{flexDirection:'row',alignItems:'center',height:iconSize+10,paddingLeft:10}}>
                    <PureIconRender  style={{padding:5}} size={iconSize} img={getHeaterIcon(defaultMode)} fill={iconColor} />
                    <H3  color={textColor} style={{padding:5,marginLeft:20}}>{t(getHeaterModeName(defaultMode))}</H3>                   
                </View>                
                <RenderRanges/>               
                <HSeparator dividerColor={separatorColor} fat />
                    <LineWithIcon iconRight="plus-circle" isAppIcon callback={openAddRangePopUp} color={iconColor}><Text style={{color:textColor}}>{t("scenarios:HEATER_PROGRAM_ADD_RANGE")}</Text></LineWithIcon>
                <View style={{height:30}}>
                <SectionText color={textColor}></SectionText>
                </View>
                
            </ScrollView> 
            { canSave && <View style={{height:60}}>
              
                    <View style={{flexDirection:'row',justifyContent:'space-between',padding:15,paddingBottom:25,paddingTop:0}}>
                        <View  style={{width:'48%'}}>
                        <AccessButton  onPress={cancelModification} specialColor={'#333'} title={t("CANCEL")}/>
                        </View>
                        <View  style={{width:'48%'}}>
                        <AccessButton  onPress={saveModification} specialColor='#333' title={t("SAVE")}/>
                        </View>
                    </View> 

                </View> 
            }
            {/*
                 modal
                open={timePickerVisible}
            */}
             <Modal
                animationType="slide"
               transparent={true}
                visible={timePickerVisible}>
                    <View style={{flex:1,backgroundColor:'#000000CC',alignItems:'center',justifyContent:'center'}}>
                        <View style={{borderWidth:2,borderColor:'black',backgroundColor:"white",padding:0,alignItems:'center'}}>
                            <DatePicker
                                
                                    date={timerTime}
                                    mode="time"
                                    onDateChange={(date)=>{onDateChange(date)}}
                                    onConfirm={(date)=>{handleConfirmTimePicker(date)}}
                                    onCancel={() => {
                                        hideDatePickerTimePicker()
                                    }}
                                    confirmText="OK"
                            />
                            <View style={{flexDirection:'row',justifyContent:'space-between',padding:15,paddingBottom:25,paddingTop:0}}>
                                <View  style={{width:'48%'}}>
                                <AccessButton  onPress={hideDatePickerTimePicker} specialColor={'#333'} title={t("CANCEL")}/>
                                </View>
                                <View  style={{width:'48%'}}>
                                <AccessButton  onPress={()=>{handleConfirmTimePicker(timerTime)}} specialColor='#333' title={t("OK")}/>
                                </View>
                            </View>
                        </View>
                    </View>
            </Modal>

            
             <PopUp ref={selectSimilarDayRef} title={t("scenarios:HEATER_PROGRAM_SELECT_THE_DAY")} datas={selectDayDatas} callback={selectDay}/>              
             <PopUp ref={selectModeRef} title={t("scenarios:HEATER_PROGRAM_SELECT_THE_MODE")} datas={modesDatas} callback={selectMode} translateLabels={true}/>              
             
             <LowLevelPop/>
            
        </SafeAreaView>  
    );
}

ProductProgramDayScreen.navigationOptions = {
   
    headerShown: false,
    headerMode:'screen',
    gestureEnabled: false,   
    ...TransitionPresets.SlideFromRightIOS
  }

const H3 = styled.Text`
    font-size:20px;
    text-transform:capitalize;
    color:${props => props.color || "black"};
`;

const HSeparator = styled.View`
    margin-top:${props => (props.height / 2 || 10)}px;
    margin-bottom:${props => (props.height / 2 || 10)}px;
    border-bottom-width:1px;
    border-bottom-color:${props => props.dividerColor || "white"};
    ${({ fat }) => fat && `
        border-bottom-width:2px;
    `}

`;
const SectionText = styled.Text`
    color:${props => props.color || "black"};
    font-size:16px;
`;
