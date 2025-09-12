/* à reporter sur master production */

import React, { Component } from 'react';
import { View, Text,SafeAreaView,KeyboardAvoidingView,TouchableOpacity} from 'react-native';
import {useContext,useState,useRef,useEffect} from 'react';
import { useStore,useSelector,useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useNavigation,useRoute,StackActions } from '@react-navigation/native';

import Toast from 'react-native-root-toast';

import { xorBy} from 'lodash';
import {difference as lodashDifference} from 'lodash'
import { find as lodashFind } from 'lodash';

import styled from 'styled-components/native';

import {deleteHeaterScheduleTasks} from '_helpers/heaterTools';
import {createThermostatApplication,updateParametersOnServer} from '_api/objects';

import { useTheme } from '_theming/themeProvider';

import {thermostatDefaultProg,thermostatDelayOptions} from './thermostatConfig';

import {useMyTools} from '_helpers/myTools';

import {addObjectAction} from '_actions/asyncActions';
import {updateRDependencies,updateParameter} from '_actions/objects';
import {setScheduleDatas} from '_actions/objects';
import {convertThermostatToSchedule,convertWeekToProgParameter} from '_helpers/heaterTools';

import SimplePopUp from '_components/ui/simplePopUp';
import AccessButton from '_components/forms/accessButton';
import {HeaderWithBack} from '_components/headers/header-with-back';

import FormInput from '_components/forms/formInput';
import {focusAddedProduct} from '_actions/app';

import {getAllObjects,getObjectsByTypeName,getObjectById,getWidgetReference} from '_helpers/selectors';

import { MySelectBox } from './components/selectBox';
import {SimpleSelectRender,MultiSelectRender} from './components/modalSelects';

const ThermostatWizard = (props) => {

    const isMounted = useRef(false)


    const { t, i18n } = useTranslation();
    const { theme,baseColors} = useTheme();
    const {bgColor,textColor,headerBackgroundColor,headerTextColor} = baseColors;

   
    const myNavigationTool = useMyTools();
    const dispatch = useDispatch();
    
   const navigation = useNavigation();
   const route = useRoute();
   const navigationParams = route?.params || {}; 
   
    const {itemId,update : isUpdate, parameters : updateParameters} = navigationParams;
    
    const allObjects =  useSelector(getAllObjects);
    const probesIds = useSelector(state => getObjectsByTypeName(state,'AtHomeProbe'));
    const heatersIds = useSelector(state => getObjectsByTypeName(state,'AtHomeHeater'));
    const plugInIds = useSelector(state => getObjectsByTypeName(state,'AtHomePlugIn'));
    const boilerIds =  useSelector(state => getObjectsByTypeName(state,'AtHomeBoiler'));
    

    const [progress,setProgress] = useState(isUpdate ? 'update':'start'); //start
    const [probes,setProbes] = useState([{item:'',id:'...'}])
    const [heaters,setHeaters] = useState([{item:'loading...',id:'LOADING'},{item:'loading...',id:'LOADING'},{item:'loading...',id:'LOADING'},{item:'loading...',id:'LOADING'}])
    
    
    const title = t('thermostat:'+((isUpdate != undefined) ? 'THERMOSTAT_UPDATE_TITLE' : 'ADD_THERMOSTAT'));
    const placeholderDelay = t('thermostat:SELECT_THERMOSTAT_DELAY_PLACEHOLDER');
    const placeholderText = t('addProduct:SELECT_A_PROBE');
    const placeholderProbe = t('addProduct:SELECT_A_PROBE');
    const placeholderHeater = t('addProduct:SELECT_A_HEATER');
   
    const [selectedHeaters, setSelectedHeaters] = useState([])
    const [selectedDelay,setSelectedDelay] = useState({});
    const [selectedProbe,setSelectedProbe] = useState({});
    const [appName,setAppName] = useState(""); 
    const [popUpSelectionType,setPopUpSelectionType] = useState(""); 
    const [canSave,setCanSave] = useState(false);
    const [initialHeatersSelection,setInitialHeatersSelection] = useState([])

    const setPointPopUpRef  = useRef();
    
    const delay_options = thermostatDelayOptions.reduce((r,v,i)=> {
        r.push({"item":t(v.item),"id":v.id});
        return r;
    },[])



    // DID MOUNT
    useEffect(() => {
        isMounted.current = true;
        if(isUpdate) {
            console.log("it's an update",updateParameters)
            const initHeaters = updateParameters.heater_ids.split(",").reduce((r,v,i) => {
                if(v != 0)r.push(Number(v))
                return r
            },[]);
            setInitialHeatersSelection([...initHeaters]);
            setSelectedHeaters(initHeaters);  
            setAppName(updateParameters.appName)          
        }
        // WILL UNMOUNT
        return () => (isMounted.current = false)
      }, []);


    
    useEffect(() => {
       
       const probeList = doList(probesIds);      
       if(probeList.length == 0) {
           setProgress("missing_component");
       }
       setProbes(doList(probesIds));
       const toSelect = [...(heatersIds)&& heatersIds,...(boilerIds)&& boilerIds,...(plugInIds)&& plugInIds];
       console.log("toSelect",toSelect);

       if(toSelect.length == 0) {
            setProgress("missing_component")
       }
       const addHeaters = doSelectMultiList(toSelect);
       console.log("addHeaters",addHeaters)
       setHeaters(addHeaters);
       console.log("isUpdate !!!!!",isUpdate)
      
       if(isUpdate) {          
           const initProbe = probeList.reduce((r,v,i)=> {
            if(v.id == Number(updateParameters.probe_id))r = {...v}
            return r
           },{})
           setSelectedProbe(initProbe);          
            const init_delay = lodashFind(delay_options,{id:Number(updateParameters.delay)});            
            setSelectedDelay(init_delay);
       }
       console.log("progress",progress);      
    }, []);


    useEffect(() => {       
       console.log("change !!! ",probesIds,heatersIds,boilerIds,plugInIds);       
     }, [probesIds,heatersIds,boilerIds,plugInIds]);
 
    /*  [probesIds,heatersIds,boilerIds,plugInIds]); */
    
   
    useEffect(() => {
        console.log("can save tst",appName.length,selectedProbe,selectedDelay, selectedHeaters)
       if( appName.length < 4 || Object.keys(selectedProbe).length == 0 || Object.keys(selectedDelay).length == 0  || selectedHeaters.length < 1) {
           setCanSave(false);
       } else {
            setCanSave(true);
       }      
       
     }, [selectedDelay,selectedHeaters,selectedProbe,appName]);
    
     

    const doList = (ids) => {
        if(ids == undefined) return []
        const list = ids.reduce((r,v,i)=> {
            const _obj = allObjects[v];
            if(_obj.uniType == undefined) {
                r.push({'item':""+_obj.name,'id':v,'hasSetPoint':(_obj.statusDictionary['setpoint']!=undefined)});
            }
            return r;
       },[])
       return list;
    }

    const doSelectMultiList = (ids) => {
        if(ids == undefined) return []
        const list = ids.reduce((r,v,i)=> {
            const _obj = allObjects[v];
            if(_obj.uniType == undefined)r.push({'item':""+_obj.name,'id':v});
            return r;
       },[])
       return list;
    }   
   

    function onMultiHeaterChange() {       
        return (item) => setSelectedHeaters(xorBy(selectedHeaters, [item], 'id'));        
    }

    function onDelayChange () {        
        return (val) => setSelectedDelay(val)
    }
    //-----------------------------------
    const onAddThermostat = async() => {
        console.log("onAddThermostat raw",isMounted.current,selectedHeaters,selectedDelay,selectedProbe)
        const heaterIds  = selectedHeaters.reduce((r,v,i)=> {
            r.push(""+v);
            return r
        },[])

        const probeId = selectedProbe.id;
        const controlId = (selectedProbe.hasSetPoint) ? probeId : false;
        const delay = selectedDelay.id;
        //const created = await createThermostatApplication("mon regul 1",);
        console.log("onAddThermostat",heaterIds,probeId,controlId,delay,appName)
        const created = await createThermostatApplication(appName,probeId,controlId,heaterIds,delay).catch((err)=> { console.log(err)});
        //console.log("created",created)
        // force reload sometimes no info from WebSocket so mimic the expected behavior;
        if(created.errCode == 200 && created.id != undefined) {
            //console.log("force Add Object",created.id)
            addObjectAction(created.id,dispatch);
            setProgress('created');
            deleteScheduleTasks(heaterIds);

            // ------------------ auto add default program --------------------!!
            const weekDatas = convertThermostatToSchedule(created.id,thermostatDefaultProg);               
            dispatch(setScheduleDatas(created.id,weekDatas));           
            const parameters = {'prog':convertWeekToProgParameter(weekDatas,created.id,1)}; 
            const doUpdateParameters = await updateParametersOnServer(created.id,parameters).catch(err => console.log("no auto program",err)); 
            //console.log("doUpdateParameters",doUpdateParameters)    
            
        } else {
            let msg = "Error";
            if(created.errMsg) {
                switch (created.errMsg) {
                    case "object_exists" :
                        msg = t("addProduct:OBJECT_HAS_SAME_NAME",{name:appName});
                        break;
                    default :
                        msg = t("thermostat:CREATION_ERROR_GENERIC");
                        break;
                }
            }

            Toast.show(msg);
        }
        

    }

    const onUpdateThermostat = () => {
        console.log("onUpdateThermostat !!!!! ",isMounted.current,
                    "initialHeatersSelection",initialHeatersSelection,
                    "selectedHeaters",selectedHeaters,selectedDelay,selectedProbe);
        //heaters
        const removed = lodashDifference(initialHeatersSelection,selectedHeaters);
        const added = lodashDifference(selectedHeaters,initialHeatersSelection);
       //update store
        const action = updateRDependencies(added,removed,itemId,'applications');
        dispatch(action);

        const probeVal  = ""+selectedProbe.id;
        const heatersVal = selectedHeaters.join(",");
        const delayVal  = ""+selectedDelay.id;       
        const controlVal = (selectedProbe.hasSetPoint) ? selectedProbe.id : false;

        dispatch(updateParameter(itemId,'probe_id',probeVal));
        dispatch(updateParameter(itemId,'control_id',probeVal));
        dispatch(updateParameter(itemId,'heater_ids',heatersVal));
        dispatch(updateParameter(itemId,'delay',delayVal));

        //update server
        let parameters = {'heater_ids':heatersVal, 'probe_id':probeVal,'delay':delayVal};
        if(controlVal != false) parameters['control_id']= probeVal;
        console.log("updateThermostat",parameters)
        updateParametersOnServer(itemId,parameters).catch(err => console.log(err));

        // and also delete ScheduleTasks
        if(added.length > 0) {
            deleteScheduleTasks(added);
        }
        
    }
    /**
     * if heater is added then its own schedules must be deleted
     * @param {*} ids 
     */
    const deleteScheduleTasks = (ids) => {
        if(ids.length > 0 ) {
            const delScheduleTasks = ids.reduce((r,v,i) => {
                deleteHeaterScheduleTasks(v);
                r.push(v);
                return r
            },[])
            //console.log("delete that",delScheduleTasks)
        }
    }

    const onCancel = () => {
        console.log("cancel")
        navigation.goBack();
    }
    const onCancelUpdate = () => {
        console.log("onCancelUpdate");
        navigation.goBack();
    }
    const handleInputChange = (val) => {
       setAppName(val);
    }

    const onOpenSimplePopUp = (type,title) => {
        setPopUpSelectionType(type)
        setPointPopUpRef.current.popupTitle(title)
        setPointPopUpRef.current.toggle()
    }

    const validateSelection = (val,type) => {
        console.log("validateSelection",val,type);
        switch(type) {
            case 'heaters':
                setSelectedHeaters(val);
                break;
        }
        setPointPopUpRef.current.toggle()
    }

    const cancelSelection = () => {
        setPointPopUpRef.current.toggle();
    }

    const selectDelayCallback = (id,toggle) => {
        //here id is the value
        console.log("selectDelayCallback",id);
        const delaySelection = delay_options.reduce((r,v,i) => {
            if(v.id == id)r = {...v};
            return r
        },{})
        console.log("delaySelection",delaySelection)
        setSelectedDelay(delaySelection)
        if(toggle!=false)setPointPopUpRef.current.toggle()
    }

    const selectProbeCallback = (id,toggle) => {
        //here id is the value
        console.log("selectProbeCallback",id,probes);
        const selection = probes.reduce((r,v,i) => {
            if(v.id == id)r = {...v};
            return r
        },{})
        console.log('selection Probe',selection);
        setSelectedProbe(selection)
        if(toggle!=false)setPointPopUpRef.current.toggle()
    }
    //======================================================================
    
    const popUpBody = (direct) => {

        const switchVal = direct || popUpSelectionType
        const cancelLabel = t("CANCEL");
        const validateLabel = t("VALIDATE");
    
        switch(switchVal) {
            case "heaters" :
                return (
                  
                    <MySelectBox    label={placeholderHeater} options={heaters} selectedValues={selectedHeaters} 
                                    onMultiSelect={onMultiHeaterChange} onTapClose={onMultiHeaterChange} isMulti 
                                    cancel={{callback:cancelSelection,label:cancelLabel}}
                                    validate={{callback:validateSelection,label:validateLabel,type:'heaters'}}/>
                    
                )
                break;
            case "delay" :
                return (                 
                    <MySelectBox label={placeholderDelay} options={delay_options} value={selectedDelay} singleSelectionCallback={selectDelayCallback} onChange={onDelayChange}/>
                )
                break;
                case "probe" :
                    return (                      
                        <MySelectBox label={placeholderHeater} options={probes} value={selectedProbe} onChange={onDelayChange} singleSelectionCallback={selectProbeCallback}/>
                    )
                    break;
        }
    }
    // Attention à la version wizard sans props goBack
    const getHeader = () => {
       
       return  <View style={{height:84,alignItems:'center',justifyContent:'center'}}>
                        <HeaderWithBack title={title} {...props.goBack && {'goBack' : {action:props.goBack}}} themeDependency/>
                    </View>
       
    }

    const goToNewThermostat = () => {
        dispatch(focusAddedProduct(true));
        myNavigationTool.navigateToNewProduct(navigation)
        //navigation.navigate("Home",{'justCreated':true});
    }

    //---------------------------------
    const BodyText = (props) => {
        const {children} = props
        return (
            <StyledBodyText color={theme.onBody}>{children}</StyledBodyText>
        )
    }
    // ----------------------------------
    const bodyColor = bgColor || theme["card--color--bodybg"] || theme.body;
    //const textColor = theme.onBody; // declared at fc begining
    return (
        <SafeAreaView style={{flex:1,backgroundColor:bodyColor}}>            
            <>
            {
                getHeader()
            }
            </>
        <View style={{backgroundColor:bodyColor}}>      
            { progress == 'missing_component' &&
                <StepContainer>
                    {probes.length == 0 &&
                        <>
                        <BodyText style={{marginBottom:20}}>{t("thermostat:THERMOSTAT_NO_PROBE")}</BodyText>                    
                        </>
                    }
                    {heaters.length == 0 &&
                        <BodyText>{t("thermostat:THERMOSTAT_NO_HEATER")}</BodyText>
                    }                
                </StepContainer>            
            }
            { progress == 'start' &&
                <StepContainer>
                    <KeyboardAvoidingView  style={{flex:1}} behavior="position" >
                        <BodyText>1. {t('addProduct:SELECT_PROBE_STEP')}</BodyText>
                        <SimpleSelectRender options={probes} selection={selectedProbe} placeHolder={placeholderProbe} type="probe" title={t("thermostat:POPUP_PROBE_TITLE")} addMore={onOpenSimplePopUp}/>
                        <BodyText>2. {t('addProduct:SELECT_HEATER_STEP')}</BodyText>
                        <MultiSelectRender options={allObjects} selection={selectedHeaters} type="heaters" title={t("thermostat:POPUP_HEATERS_TITLE")} addMore={onOpenSimplePopUp}/>  
                        <BodyText>3. {t('addProduct:SELECT_THERMOSTAT_DELAY_STEP')}</BodyText>                
                        <SimpleSelectRender options={delay_options} selection={selectedDelay} placeHolder={placeholderDelay} type="delay" title={t("thermostat:POPUP_DELAY_TITLE")} addMore={onOpenSimplePopUp}/> 
                        
                        <BodyText style={{marginTop:20}}>4. {t('addProduct:THERMOSTAT_GIVE_NAME')}</BodyText>
                        <FormInput value={appName} name='appName' placeholder={t("addProduct:THERMOSTAT_GIVE_NAME_PLACEHOLDER")} autoCapitalize='none'   onChangeText={(txt) => handleInputChange(txt)} color={theme.onBody} iconColor='white'/>
                        <View style={{flexDirection:'row',justifyContent:'space-between',marginTop:40,padding:15,paddingBottom:25,paddingTop:0,height:60,borderTopWidth:1,borderTopColor:'white'}}>
                                <View  style={{width:'48%'}}>
                                <AccessButton  onPress={onCancel} specialColor={textColor} title={t("CANCEL")}/>
                                </View>
                                <View  style={{width:'48%'}}>
                                <AccessButton   disabled={!canSave} onPress={onAddThermostat} specialColor={textColor} title={t("SAVE")}/>
                                </View>
                        </View>
                    </KeyboardAvoidingView>
                </StepContainer>
            }
            { progress == 'created' &&
                <StepContainer>
                    <BodyText>{t("thermostat:CREATION_COMPLETE")}</BodyText>
                    <AccessButton  onPress={goToNewThermostat} specialColor={textColor} title={t("thermostat:SHOW_CREATED_THERMOSTAT")}/>
                </StepContainer>
            
            }
            {progress == 'update' &&
                <StepContainer >
                    <BodyText>{t('thermostat:THERMOSTAT_UPDATE_PROBE_TITLE')}</BodyText>
                    <SimpleSelectRender options={probes} selection={selectedProbe} placeHolder={placeholderProbe} type="probe" title={t("thermostat:POPUP_PROBE_TITLE")} addMore={onOpenSimplePopUp}/> 
                    <BodyText>{t('thermostat:THERMOSTAT_UPDATE_HEATERS_TITLE')}</BodyText>
                    <MultiSelectRender options={allObjects} selection={selectedHeaters} type="heaters" title={t("thermostat:POPUP_HEATERS_TITLE")} addMore={onOpenSimplePopUp}/>        
                    <BodyText>{t('thermostat:THERMOSTAT_UPDATE_DELAY_TITLE')}</BodyText>                
                    <SimpleSelectRender options={delay_options} selection={selectedDelay} placeHolder={placeholderDelay} type="delay" title={t("thermostat:POPUP_DELAY_TITLE")} addMore={onOpenSimplePopUp}/> 
                    
                    <View style={{flexDirection:'row',justifyContent:'space-between',marginTop:40,padding:15,paddingBottom:25,paddingTop:0,height:60,borderTopWidth:1,borderTopColor:textColor}}>
                            <View  style={{width:'48%'}}>
                                <AccessButton  onPress={onCancelUpdate} specialColor={textColor} title={t("CANCEL")}/>
                            </View>
                            <View  style={{width:'48%'}}>
                            <AccessButton   disabled={!canSave} onPress={onUpdateThermostat} specialColor={textColor} title={t("SAVE")}/>
                            </View>
                    </View>
                </StepContainer>           
            }        
        </View>      
        <SimplePopUp ref={setPointPopUpRef} title={t("scenarios:THERMOSTAT_SELECT_SETPOINT")} minHeight={400} flexed={true}> 
           <View style={{padding:10,flex:1}}>
           {
               popUpBody()
           }
           </View>           
        </SimplePopUp>        
      </SafeAreaView>
    )
        
}

export default ThermostatWizard

const SelectionText = styled.Text`
            color:${props => props.color || 'green'};
            font-size:18px;
        `;
const StepContainer = styled.ScrollView`
    padding:15px;
    
`;
const StyledBodyText = styled.Text`
    color:${props => props.color || 'white'}; 
    text-align:${props => props.align || 'left'};
    font-size:14px;        
`;

