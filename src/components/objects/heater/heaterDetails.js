import React from 'react';
import {useContext,useState,useEffect,useRef} from 'react'
import { View,Text,TouchableOpacity} from 'react-native';

import { useSelector} from 'react-redux';
import { useNavigation,useRoute,StackActions } from '@react-navigation/native';
import { useTranslation,Trans } from 'react-i18next';
import { useTheme } from '_theming/themeProvider';

import {getObjectById} from '_helpers/selectors';
import {TypeHeater} from './heater';
import {TypeWirePilot} from '../wirePilot/wirePilot';
import ProgramHeaterDay from '../programs/programHeaterDay';
import {RightChevron} from '../../ui/rightChevron';
//import { SolarPanelAirwell } from '../@dynamics/widgets/objectsWidgets';
import {Graph} from '_components/graphs/graph';
import {useAppGlobal} from '_helpers/appGlobalProvider';
import useHeater from './heaterHook';

/**
 * Heater details page content 
 * 
 * @param {Object} props
 * @param {number} props.itemId
 * @param {string} props.typeName
 * @param {string} [props.newIcon] in case typeName is not present in domusIcons
 * 
 */
export const TypeHeaterDetails = (props) => {
  
    const { t, i18n } = useTranslation();
    const {getObjectMapped} = useAppGlobal();
    const { itemId,typeName : realTypeName,newIcon} = props;
    const [typeName,setTypeName] = useState(getObjectMapped(realTypeName));   

    const {theme} = useTheme();  
    const navigation = useNavigation()
   

    const textColor = theme["card--color--text"];   
   
    const [dayRanges,setDayRanges] = useState([]);   
    const [dependencies,setDependencies] = useState({}); 
    const [forceRedraw,setForceRedraw] = useState(0);
    
   
    const {     objectDatas,itemRuntimeDatas,scheduleDatas,objStatuses,activeStatusesImages,
                heaterType,currentDay,
                getMyHeatingTasks,getScheduleTasks, getFirstTaskActivatedFlag,isActivated,
                uObject
            } = useHeater(itemId);

    const sel = useSelector(state => getObjectById(state,itemId));   
   
    //--------------------------------
    const initScheduleDatas = () => {
        getScheduleTasks();      
        //setDayRanges(scheduleDatas[currentDay]); 
    }
    
    
    //=====================================================
    const _goProgram = () => {
       
            const activated = isActivated;   
            const params =  {
                'itemId':itemId,
                'title' : "Programmation",
                'programActivated': activated,
                'type':typeName
            }
        console.log("gogogo ---->",params)    
        navigation.navigate('ProductProgram',params)        
    }

    // ============= refs =============================
    //const programActivatedRef = useRef(isActivated ());
    // ============== useEffects ======================

    useEffect(()=> {
        // if needed
    },[])

    useEffect(()=> {
        console.log("ça bouge dans sel de heater details",sel)
    },[sel])

    
    useEffect(() => {       
       
        if(scheduleDatas) {
            setDayRanges(scheduleDatas[currentDay]);
            setForceRedraw(forceRedraw+1);
        }     
        
        
        console.log("heaterType",heaterType)


    }, [objectDatas]);
    
    useEffect(() => {       
        
        if(scheduleDatas == undefined) {           
            initScheduleDatas();
        } else {            
            setDayRanges(scheduleDatas[currentDay]);           
        }
        setForceRedraw(forceRedraw+1);
    }, [scheduleDatas]);

    useEffect(()=> {
        console.log("useEffect =>",dayRanges)
    },[dayRanges])

    useEffect(()=> {
        //console.log("useEffect =>objectDatas.programActivated et objStatuses",objectDatas.programActivated);        
        setForceRedraw(forceRedraw+1);
    },[objStatuses])   
    //--------------------------------------------------------------------------------------
    console.log("heaterType =",heaterType)
    return (
            <>              
                <View style={{minHeight:200}}>
                    <View style={{flex:1}}>
                    {(heaterType == "AtHomeHeater" || heaterType == "AtHomeBoiler") && 
                            <TypeHeater 
                                    newIcon={newIcon} {...props} 
                                    statuses={objStatuses} 
                                    activeStatusesImages={activeStatusesImages}
                                    widgetReferenceId={objectDatas.id} 
                                    uObject={uObject}
                                    />
                    }
                    {(heaterType == "AtHomeWirePilot") &&
                        <View style={{flex:1}}>
                            
                            <TypeWirePilot uObject={uObject}  newIcon={newIcon} hideMoreLink {...props} statuses={objStatuses} activeStatusesImages={activeStatusesImages}/>
                        </View>
                    }
                    </View> 
                </View>
                    
                {Object.keys(dependencies).length == 0 &&
                    <>
                        <View style={{flex:1,flexDirection:'row',padding:10}}>
                            <View style={{flex:2}}>
                                <Text style={{fontSize:20,color:textColor}}>{t("scenarios:SCHEDULE_HEATER_TITLE")}</Text>
                            </View>
                            <RightChevron callback= {_goProgram} color={textColor}/>                                
                        </View>
                        <View style={{opacity:(isActivated) ? 1 : 0.3}}>
                            <ProgramHeaterDay ranges={dayRanges} dayId={0}/>
                        </View>                         
                    </>    
                }
                {(dependencies.applications || dependencies.groups) &&  
                    <View style={{padding:20}}>
                        {dependencies.applications &&                     
                        <Text style={{color:textColor}}>
                            <Trans i18nKey="IS_IN_APPLICATION" values={{'isInApplicationStr':dependencies.applications.join(", ")}} count={dependencies.applications.length}>
                                hello object <Text>var is in Trans property values a key/val object</Text>
                            </Trans>
                        </Text>
                        }
                        {dependencies.groups && 
                            <Text style={{color:textColor}}>
                            <Trans i18nKey="IS_IN_GROUP" values={{'isInGroupStr':dependencies.groups.join(", ")}} count={dependencies.groups.length}>
                                hello object <Text>var is in Trans property values a key/val object</Text>
                            </Trans>
                        </Text>
                        }
                        <Text style={{marginTop:15,color:textColor}}>{t("NO_INDIVIDUAL_SCHEDULE")}</Text>
                    </View>
                }
                {(sel.typeName != "composite" && sel.typeName != 'AtHomeBoiler') &&
                            <Graph objectId={props.itemId} typeName={typeName}/>
                }                 
            </>
    )
}