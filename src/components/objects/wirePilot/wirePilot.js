import React from 'react';
import {useEffect,useState,useRef} from 'react';
import { View,Text,TouchableHighlight,Image } from 'react-native';

import { useTranslation } from 'react-i18next';
import { useStore,useSelector,useDispatch } from 'react-redux';

import {Api} from '_api';
import {invert as lodashInvert} from 'lodash'; 
import { useTheme } from '_theming/themeProvider';
import { IconButton} from '@components/ui/buttons/iconButton';
import {updateStatus,objectUpdateProperty, setScheduleDatas} from '_actions/objects';

import {buttonsList} from './config';
import { StyledMainView,styles } from './style';

import { mappedActions as modesActions,  getHeatingTasks} from '_helpers/heaterTools';
import useHeater from '../heater/heaterHook';

//--- Appium -----
import {buildTestId} from '_helpers/appium';




export const TypeWirePilot = (props) => {
   
    const { t, i18n } = useTranslation();
    const theme = useTheme();
    const { uObject,itemId,typeName} = props; 
    const {objectDatas : itemDatas} = uObject;
    const { statuses} = uObject

    const   {  
                getMyHeatingTasks,getScheduleTasks,scheduleDatas,getFirstTaskActivatedFlag,
                activateTasks,deactivateTasks,isActivated
            } = useHeater(itemId);


    const [programActivated,setProgramActivated] = useState(isActivated)
    const [forceRedraw,setForceRedraw] = useState(1);
    const dispatch = useDispatch(); 
    
    const [stateWidth, setStateWidth] = useState(0);
    const [checkUpdate,setCheckUpdate] = useState(0)

    useEffect(() => {       
      
        if(scheduleDatas == undefined) {
            console.log("so init")           
            getScheduleTasks();          
            setForceRedraw(forceRedraw+1);
        }

    }, [scheduleDatas]);

    useEffect(() => { 
       //getFirstTaskActivatedFlag();
    }, []);

    useEffect(() => {       
       console.log("scheduleDatas changed")
     }, [setScheduleDatas]);
    
    useEffect(() => {       
        setProgramActivated(isActivated);
        setForceRedraw(forceRedraw+1)
    },[isActivated])

    useEffect(() => {
        console.log("so redraw");      
    },[forceRedraw])   

    
    const onLayout = (e) => {
        if (stateWidth !== e.nativeEvent.layout.width) {
            setStateWidth(e.nativeEvent.layout.width);         
        }
      }

    const width = '25%';
    

    const executeAction = async(actionName) => {

        const flagVal = (actionName!='PROGRAM');
       
        changeProgramActivation(!flagVal);
       // console.log("executed",actionName)
        if(actionName != "PROGRAM") {
            const inverseModesupdateStatusActions = lodashInvert(modesActions);
            dispatch(updateStatus(itemId,'status',inverseModesupdateStatusActions[actionName]))
            const request = Api.executeAction(itemId,actionName,{})
        }        
    }
   
    const changeProgramActivation = (isDeactivated) => {

        console.log("changeProgramActivation",isDeactivated);
        const tasks = getMyHeatingTasks();
       
        if(isDeactivated == true) {
            activateTasks();
        } else {
            deactivateTasks();
        }
           
    }

    //------------ APPIUM ----------------------------
    const generatedAppiumRefId = itemDatas.typeName+"_"+itemDatas.id;
    
    const soId = buildTestId(generatedAppiumRefId);
    
    const [addAutoId,setAddAutoId] = useState(soId);

    const statusID = buildTestId("statusField");

    return (
            <StyledMainView {...addAutoId}>
                <Text {...statusID}>{statuses.status} {itemDatas.name}</Text>
                <View style={styles.container} onLayout={onLayout}>
                { buttonsList.map(function(v,i){
                    const captionKey = "statuses:"+v.status;
                    const iconButtonID = buildTestId("wireButton_"+v.status); 
                    return (
                          
                            <View style={[styles.wrapper, { width: width }]} key={"wireButtons_"+i}>
                                <View style={styles.box}>
                                    {v.icon == "empty" ?
                                         <></>
                                          :
                                        <IconButton icon={v.icon} isActive = {statuses.status == v.status} caption={t(captionKey)} callback={executeAction} action={v.action} buttonTestID={iconButtonID}/>                                   
                                    }
                                    </View>
                            </View>
                        )
                    })
                }
                    <View style={[styles.wrapper, { width: width }]}>
                        <View style={styles.box}>
                            <IconButton icon="AtHomeWirePilotProgram" isActive={isActivated} caption={t('statuses:program')} callback={executeAction} action="PROGRAM"/>                                  
                        </View>
                    </View>
                </View>
            </StyledMainView>
    )
}