import './locales';

import React from 'react';
import {useEffect,useState} from 'react';
import { View,Text} from 'react-native';
import { useSelector,useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import {getObjectById,getWidgetReference} from '_helpers/selectors';
import { useTheme } from '_theming/themeProvider';
import {Api} from '_api';
import {updateParameter} from '_actions/objects';
import {setParameters as setParametersApi} from '_api/objects';

import { StyledMainView,BoostText} from './thermostatStyled';
import {ActionBlockRender} from './components/actionBlockRender';
import {ModeCell} from './components/modeCell';
import {SetPointButton} from './components/setPointButton';
import {TemperatureCell} from './components/temperatureCell';
import {ManualSetter} from './components/manualSetter'

//============== COMPONENT START HERE ==========================


export function TypeApplicationThermostat(props) {

   
    const { t, i18n } = useTranslation();
    
    const { itemId,activeStatusesImages,uObject} = props;
    const {objectDatas,statuses} = uObject;
    const {parameters} = objectDatas; 
    const {theme} = useTheme();
    const dispatch = useDispatch(); 

    const iconSize = 56;

    const iconColor = theme['card--color--icon'];
    const textColor = theme['card--color--text'];
    const iconBackgroundColor = theme['widget--round--wrapper--color--background'] || props.backgroundColor;

    const iconFillColor = theme["card--color--icon"];
    const iconWrapperColor = theme["card--color--icon--wrapper--background"] || "transparent"
   
    //const probeObject = useSelector(state => state.objects.entities.objects[parameters.probe_id]);
    
    const probeObject = useSelector(state => getObjectById(state,parameters?.probe_id));

    const [currentTemperature,setCurrentTemperature] = useState("++");

    const [setpointManual,setSetpointManual] = useState(Number(parameters.setpoint_manual));

    //const objectDatas = useSelector(state => getObjectById(state,itemId));
   
    useEffect(() => {       
       //this.doCrash();
       // keep it here if testing needed later just uncomment line below
       //crashlytics().crash();

        // keep here to test crashlytics just uncomment below
       //const myTestError = doMyErrorAgain()
       //const myTestError = doMyErrorMore____1()
       //console.log(iconSize.property.value);
        
        
    }, []);
    
    useEffect(() => {       
       //console.log("changed me me me me me me",objectDatas)
       const new_setpoint_manual = objectDatas?.parameters?.setpoint_manual;
       if(new_setpoint_manual != undefined && new_setpoint_manual != setpointManual)setSetpointManual(new_setpoint_manual)   
       setCurrentMode(objectDatas?.statusDictionary?.__th_mode)
     }, [objectDatas]);

    



    useEffect(() => {      
        console.log("parameters or statuses changed") 
        if(statuses.__th_boost_end) {           
            const boostEnd = statuses.__th_boost_end.split('h').reduce((r,v,i)=> {
                r.push(((Number(v) < 10 )? "0" : "") + v);
                
                return r
            },[]);           
            setBoostEnd(boostEnd.join(":"))
        }       
        const displaySetPointMode = (statuses.__th_mode == "auto") ? statuses.__th_auto_mode : statuses.__th_mode;  
        const dsp = Math.round(parameters['setpoint_'+displaySetPointMode])     
        setDisplayedSetPoint((!isNaN(dsp) ? dsp : "--"));

        setSetpointManual(Number(parameters.setpoint_manual));
       

    }, [statuses,parameters]);

    useEffect(() => {
        console.log("AAAA =================+> ",parameters.setpoint_manual);
    },[parameters.setpoint_manual])
    

    useEffect(() => {
        const currTempValue = probeObject?.statusDictionary?.temperature;
        let currentProbeTemp = (currTempValue != undefined) ? Math.round(currTempValue).toString() : "--"
        setCurrentTemperature(currentProbeTemp)
    },[probeObject])

    
    // status => output
    // __th_mode => mode

    const statusVal = statuses?.status || statuses?.output;

    const thermostatStatus = "scenarios:THERMOSTAT_STATUS_"+(statusVal).toUpperCase()
    const statusIsOn = (statuses.status.toUpperCase() === 'ON');
    const [currentMode,setCurrentMode] = useState(statuses.__th_mode);
    const [boostEnd,setBoostEnd]= useState('');
    const [displayedSetPoint,setDisplayedSetPoint]= useState('');

    const executeAction = (actionName) => {
        Api.executeAction(props.itemId,actionName);
    }

    const setPoint = (point,way) => {
       
        const setPointFunctions = {
                    'manual':{'value':setpointManual,'set':setSetpointManual}
                }
       
        const setPointExist = setPointFunctions[point] 

        if( setPointExist!= undefined) {
            const val = Number(setPointExist.value);
            const newVal = val+(1*(way == "increase")? 1 : -1);
            //console.log("newVal",newVal)
            setPointExist.set(newVal);
            dispatch(updateParameter(itemId,'setpoint_manual',newVal));
            // server update is done in middleware
        }
    }
    
    const modeCellAction = (actionName) => {
        executeAction(actionName)
    }


    return (
        
            <StyledMainView>               
                <View style={{flex:1,flexDirection:'row',paddingLeft:10,paddingRight:10}}>
                    <View style={{flex:1,paddingBottom:30}}>
                        <ModeCell icon="AtHomeWirePilotPower.svg" iconScale={0.6} label={t(thermostatStatus)} fill={iconFillColor} iconSize={iconSize}  selectedColor="green" selected={statusIsOn} actionName="OFF" doAction={executeAction}/>  
                       <View style={{height:15}}></View>
                       <TemperatureCell value={currentTemperature} size={44} label={t("thermostat:TEMPERATURE_REAL_LABEL")} noAlignAdjust fontSize={26}/>
                    </View>
                    <View style={{flex:3,paddingLeft:15,paddingRight:0}}>
                        <View>
                            <ActionBlockRender iconSize={iconSize} newIcon={props.newIcon} iconFillColor={iconFillColor} currentMode= {currentMode} activeStatusesImages={props.activeStatusesImages} actionCallback={executeAction}/>
                        </View>
                        <View style={{flex:1,justifyContent:'center'}}>
                            { currentMode == 'manual' &&                              
                                <ManualSetter callback={setPoint} value={setpointManual} />                                                     
                            }
                            { (currentMode == 'auto' || currentMode == 'boost' )&&
                                <View>
                                    <View style={{flex:1,flexDirection:'row',alignItems:'center',justifyContent:'center',height:iconSize*1.08}}>                                        
                                        <TemperatureCell value={displayedSetPoint} size={iconSize} label={t("thermostat:TEMPERATURE_EXPECTED_LABEL")}/>                                        
                                        <View style={{flex:1,alignItems:'center'}}>
                                            <View style={{position:'absolute',top:-9,height:'100%',width:'50%',left:'50%',backgroundColor:(currentMode == 'boost')? iconBackgroundColor:'transparent'}}/>                                            
                                                <ModeCell icon="thermostat-boost.svg" appIcon iconScale={0.6} fill={iconFillColor} iconSize={iconSize} label={t("scenarios:THERMOSTAT_MODE_BOOST")} selected={(currentMode == 'boost')} doAction={modeCellAction} actionName="BOOST"/>           
                                            </View>
                                            <View style={{flex:1,alignItems:'center',height:iconSize*1.09,opacity:(currentMode == 'boost')? 1:0,marginTop:-18}}>
                                                <View style={{position:'absolute',height:'100%',width:'50%',left:-1,backgroundColor:iconBackgroundColor}}/>
                                                <View style={{position:'absolute',height:iconSize*1.07,width:iconSize*1.05,borderRadius:iconSize*1.05/2,backgroundColor:iconBackgroundColor}}/>
                                                <View style={{flex:1,width:'100%',alignItems:'flex-start',justifyContent:'center'}}>
                                                    <BoostText color={textColor} label>{t("scenarios:THERMOSTAT_BOOST_LABEL")}</BoostText>
                                                    <BoostText color={textColor}>{boostEnd}</BoostText>
                                                </View>
                                            </View>
                                    </View>                                
                                </View>
                            }
                        </View>
                    </View>
                </View>
            </StyledMainView>
    )   
}
TypeApplicationThermostat.displayName = 'Testo'