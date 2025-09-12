import React from 'react';
import {useContext,useState,useEffect,useRef} from 'react'
import { View,Switch,Text,Image, TouchableOpacity,TouchableHighlight} from 'react-native';
import { useSelector,useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useNavigation,useRoute,StackActions } from '@react-navigation/native';

import styled from 'styled-components/native';

import { setPoint as setPointOnServer,getApps,updateApplication} from '_api/objects'
import {Api} from "_api";

import {getAllObjects,getObjectsByTypeName,getObjectById,getWidgetReference} from '_helpers/selectors';
import SimplePopUp from '_components/ui/simplePopUp';
import {getModeIcon} from '_config/products/core';
import PureIconRender from '_components/pureIconRender';
import {SimplePicker} from '@components/ui/pickers/simplePicker';
import AccessButton from '_components/forms/accessButton';
import {updateParameter} from '_actions/objects';
import {RightChevron} from '_components/ui/rightChevron';

import { useTheme } from '_theming/themeProvider';
import {setPointsArray} from './thermostatConfig';

export const TypeThermostatSettings = (props) => {
    const { t, i18n } = useTranslation();
    const {itemId,typeName} = props;
    const {theme,baseColors} = useTheme();
    const {bgColor,textColor,headerBackgroundColor,headerTextColor} = baseColors;

    const iconColor = textColor;
    const iconBackgroundColor = theme['widget--round--wrapper--color--background'] || props.backgroundColor;


    const navigation = useNavigation();
    const route = useRoute();
    const navigationParams = route?.params || {}; 
    
    const dispatch = useDispatch();  
    const allObjects =  useSelector(getAllObjects);  
    const objectDatas =  useSelector(state => getObjectById(state,itemId));
    const appName = objectDatas.name;

    const __app_id =  objectDatas.statusDictionary.__app_id;  
    const objStatuses = objectDatas.statusDictionary;
    const objParameters = objectDatas.parameters;
    console.log("!!!!!! objParameters !!!!!",objParameters);
    console.log("thermostat Settings navigation",navigation)
   
    const doRange = (start, end) => Array.from({length: (end - start)}, (v, k) => (k + start).toString());


    const modeRanges = setPointsArray.reduce((r,v,i)=> {
                        r[v.mode] = v.range;
                        return r
                    },{})

    const [modesList,setModesList] = useState([{label:'',icon:'empty.svg',value:0}]); 
    const [heaterNames,setHeaterNames] = useState([])
    const [updateVersion,setUpdateVersion] = useState('init');
    const [currentVersionId,setCurrentVersionId] = useState(''+objStatuses.app_version);
    const [newVersionId,setNewVersionId] = useState(''+objectDatas);
    
    useEffect(() => {
        const list = setPointsArray.reduce((r,v,i) => {
            r.push({    'mode':v.mode,
                        label:t("scenarios:THERMOSTAT_MODE_"+v.mode.toUpperCase()),
                        'value':objParameters['setpoint_'+v.mode],
                        'icon' : getModeIcon(__app_id,v.mode)
                    });
            return r;
        },[])
        console.log("list ==================================================>",list)
        setModesList(list);

        let _heaterNames = (objParameters.heater_ids.split(",")).reduce((r,v,i) => {
           // console.log(' _heaterNames : ',v);            
            r.push(allObjects[Number(v)].name);
            return r;
        },[])

        _heaterNames.push(allObjects[Number(objParameters.probe_id)].name)
        setHeaterNames(_heaterNames);
        
    }, [objParameters]);

    useEffect(() => {
       
    }, [objectDatas]);

    const iconFillColor = iconColor;
    const iconSize = 24;

    const setPointPopUpRef  = useRef();

    const [currentPopUpProperty,setCurrentPopUpProperty] = useState("");
    const [modeSetPointIndex,setModeSetPointIndex] = useState(0);
    const [pickerSelectedIndex,setPickerSeletedIndex] = useState(0);

    const openSetPointPopUp = (value,mode) => {
        setPickerDatas({labels:modeRanges[mode]})
        setCurrentPopUpProperty(mode)
        setModeSetPointIndex(getCurrentIndex(mode,value))
        setPickerSeletedIndex(getCurrentIndex(mode,value))
        setPointPopUpRef.current.toggle()
    }

    const getCurrentIndex = (mode,value) => {
        //console.log(mode,value,modeRanges[mode],"modeRanges",modeRanges,"mode",mode)
        return modeRanges[mode].indexOf(value.toString());
    }

    const selectTemp = (index) => {
        //console.log("temp Selected ",index)
        setPickerSeletedIndex(index);
    }
    
    const validateSetPoint = () => {
       // console.log("validate alors ",currentPopUpProperty,pickerSelectedIndex);
        updateModeList(currentPopUpProperty,pickerSelectedIndex)
        setPointPopUpRef.current.toggle();
    }
    const cancelSetPoint = () => {
        setPointPopUpRef.current.toggle();
    }

    const updateModeList = (mode,index) => {
       // console.log("updateModeList",mode,index)
        const value = Number(modeRanges[mode][index])
        const newList = modesList.reduce((r,v,i) => {
            if(v.mode != mode) {
                r.push(v)
            } else {
                r.push({...v,'value':value})
            }
            return r;
        },[])
        //console.log("modesList",JSON.parse(JSON.stringify(modesList)))
        setModesList(newList);
        //----- update state -----------
       
        dispatch(updateParameter(itemId,'setpoint_'+mode,value));
        //-----save on server ----------
        setPointOnServer(itemId,mode,value);
    }


    const openAppSettings = () => {
       // console.log("openAppSettings !!!!!!!",navigation);
        const {delay,probe_id,heater_ids} = objParameters;
        const myParams = {delay,probe_id,heater_ids,'appName':appName};
        const destination = (navigation.state.params.inFamily) ? 'ThermostatComponentUpdateInProductStack' : 'ThermostatComponentUpdate'
        navigation.navigate(destination,{itemId:itemId,update:true,parameters:myParams})
    }
    

    const tempLabels = doRange(0, 30);

    const [pickerDatas,setPickerDatas] = useState([{label:''}])
    //const pickerDatas = {labels : tempLabels}


    // Update version
    const checkForUpdate = async() => {
        console.log("step 2")
        setUpdateVersion('callServer')
        const res = await getApps().catch((err)=> { console.log(err)});
        if(res.errCode == 200) {
            console.log(res);
            const thermostatNewVersion = res.data.reduce((r,v,i)=> {
                //console.log(">>",v.resource.name)
                if(v.resource.name && v.resource.name != "Régulation_de_température") return r;
                r = v.resource.version;
                return r
            },currentVersionId)

            console.log(objStatuses,thermostatNewVersion)
        
            if(thermostatNewVersion == currentVersionId) {
                setUpdateVersion("uptodate");
            } else {
                if (thermostatNewVersion > currentVersionId) {
                    setNewVersionId(thermostatNewVersion)
                    setUpdateVersion("newVersionAvailable")
                }
            }

        }

    }

    const installUpdate = async() => {
        setUpdateVersion("installUpdate");
        //
        
        const doUpdate = await Api.executeAction(itemId,'UPDATE');
        console.log("doUpdate",doUpdate)
        if(doUpdate.errCode == "200") {
            setCurrentVersionId(newVersionId);
            setUpdateVersion("updateDone");
        }
        
    }


    return (
            <>
            <View style={{padding:20}}>
                <SectionTitle color={textColor}>{t("thermostat:THERMOSTAT_SETTINGS_MODE")}</SectionTitle>
                {
                        modesList.map((v,i) => {
                            return (
                                <View key={"h_settings_key"+v.label} style={{flexDirection:'row',alignItems:'center',paddingTop:20,paddingBottom:20,borderBottomWidth:1,borderBottomColor:'#999999'}}>
                                    <PureIconRender size={iconSize} img={v.icon} fill={iconFillColor}/> 
                                    <View style={{flexGrow:4}}>
                                        <Text style={{marginLeft:15,color:textColor}}>{v.label.toUpperCase()}</Text>
                                    </View>
                                    
                                    <View>
                                        <TouchableOpacity onPress={() => openSetPointPopUp(v.value,v.mode)}>
                                            <Text style={{color:textColor}}>{v.value.toString()}°c</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                
                            )
                        })
                }
               
            </View> 
            <View style={{padding:20,flex:1}}>
                <SectionTitle color={textColor}>{t("thermostat:THERMOSTAT_SETTINGS_COMPONENTS")}</SectionTitle>
                {
                    <View style={{flexDirection:'row',borderBottomWidth:1,borderBottomColor:'#999999',paddingTop:20,paddingBottom:20}}>
                            <View style={{flex:1,flexGrow:10}}>
                                <Text style={{marginRight:20,flexGrow:1,color:textColor}}>{heaterNames.join(", ")}</Text>
                            </View>
                           
                            <View style={{flex:1}}>
                                <RightChevron callback= {openAppSettings} color={textColor}/>
                            </View>  
                    </View>
                                    
                            
                    }  
           
            </View>
            <View style={{padding:20,flex:1,paddingBottom:50}}>
                <SectionTitle color={textColor}>Version</SectionTitle>
                {
                    <View style={{flexDirection:'row',borderBottomWidth:1,borderBottomColor:'#999999',paddingTop:20,paddingBottom:20}}>
                            <View>
                                <Text style={{marginRight:20,flexGrow:1,color:textColor}}>{currentVersionId}</Text>
                                
                            </View>
                            {updateVersion == "init" &&
                                    <>
                                    <TouchableHighlight onPress={checkForUpdate}><Text style={{color:textColor}}>{t("CHECK_FOR_UPDATE")}</Text></TouchableHighlight>
                                    </>
                                
                            }
                            {updateVersion == 'callServer' &&
                                <Text style={{flex: 1, flexWrap: 'wrap',color:textColor}}>{t("CHECK_FOR_UPDATE_CALL")}</Text>
                            }
                            {updateVersion == 'uptodate' &&
                                <Text style={{flex: 1, flexWrap: 'wrap',color:textColor}}>{t("APP_IS_UP_TO_DATE")}</Text>
                            }
                            {updateVersion == 'newVersionAvailable' &&
                                <>
                                <View style={{flexDirection:'column',flex:1}}>
                                    <Text style={{flex: 1, flexWrap: 'wrap',color:textColor}}>{t("APP_NEW_VERSION_AVAILABLE",{'version':newVersionId})}</Text>
                                    <AccessButton title={t("APP_UPDATE_INSTALL")}  onPress={installUpdate} specialColor={textColor} isCentered/> 
                                </View>
                               
                                </>
                            }
                            {updateVersion == "installUpdate" && 
                                <>
                                    <Text style={{color:textColor}}>{t("APP_UPDATE_REQUEST")}</Text>
                                </> 
                            }
                            {updateVersion == "updateDone" && 
                                <>
                                    <Text style={{color:textColor}}>{t("APP_UPDATE_DONE")}</Text>
                                </> 
                            }
                    </View>                                    
                            
                    }  
           
            </View>
            
            <SimplePopUp ref={setPointPopUpRef} title={t("scenarios:THERMOSTAT_SELECT_SETPOINT")} style={{backgroundColor:'red'}} flexed={false}>   
                <View>  
                    <View  style={{height:200}}>
                        <SimplePicker pickerDatas={pickerDatas} initialPosition={modeSetPointIndex} pickerId="glop" callback={selectTemp}/>                    
                    </View>      
                   <View style={{flexDirection:'row'}}>
                        <View style={{flex:1}}>
                            <AccessButton title={t("CANCEL")}  onPress={cancelSetPoint} specialColor={theme['card--color--text'] || "white"}/>  
                        </View>
                        <View style={{flex:1}}>
                            <AccessButton title={t("VALIDATE")}  onPress={validateSetPoint} specialColor={theme['card--color--text'] || "white"}/> 
                        </View>
                    </View>
                </View>   
            </SimplePopUp>
            </> 
    )

  
}
const SectionTitle = styled.Text`
        font-size:16px;        
        color: ${props => props.color || "#777777"}; 
        ${({ label }) => label && `
                         font-size:8px;      
                    `}

`;