import React from 'react';
import {useEffect,useState,useRef} from 'react';
import { View, Text} from 'react-native'; // be careful it's used in Styled Component

import { get as lodashGet} from 'lodash';
import styled from 'styled-components/native';

//import {updateStatus,updateMeStatus,updateGroupStatus} from '_actions/objects';
import { useTheme } from '_theming/themeProvider';
import { WidgetIconButton } from '@components/ui/buttons/widgetIconButton';
import { Assets} from '_helpers/assets';
import {useAppGlobal} from '_helpers/appGlobalProvider';
import {StatusPanel} from '_components/objects/@common/testAutomation/statusPanel';
//--- Appium -----
import {buildTestId} from '_helpers/appium';

//--- templates ---
//import Template from '_brand/templates/components/objects/toggleOnOff';
//import SwitchToggleOnOff from '_brand/templates/components/objects/toggles/SwitchToggleOnOff';

import PropTypes from "prop-types";

const testIt = (statusName,prevProps,nextProps) => {

        const path = 'uObject.statuses.'+statusName;
        const prev = lodashGet(prevProps,path);
        const next = lodashGet(nextProps,path);
       
        const retVal = (next == prev);
       //const  retval = (prevProps?.uObject?.statuses?.[statusName] === nextProps?.uObject?.statuses?.[statusName])
        return retVal 
}

const areEqual = (prevProps, nextProps) => {

    
    /*****************************
     * the component will be reRendered when 
     * objectDatas or widgetReferenceDatas will update
     * even if true is return
     * that's the expected behaviour
     */
   

    const toTest = ["status"];
    let noRerender = true;
    for(i=0;i < toTest.length;i++) {
        if(testIt(toTest[i],prevProps,nextProps) == false) {
            noRerender = false;
            break;
        }
    }
    //console.log("ToggleOnOffComp -------------------> areEqual 2",prevProps?.uObject?.name,  noRerender)
    return noRerender;
    
    // info : no render -> return true;
}




const ToggleOnOffComp = (props) => {    
    
    const { itemId,newIcon,uObject} = props;    
    //const uObject = useObject(itemId);
    const {objectDatas,widgetReferenceDatas,isComposite,name,connected,statuses,status,updateStatus,getStatus : getMyStatus,execute,toggle,activeStatusesImages  = []} = uObject;
    const {typeName : realTypeName} = objectDatas;
    
   //const a = uObject.executeAction()
  
 

    useEffect(()=> {
       // refresh
    },[uObject.status])
   
    const {theme} = useTheme();
    const {getObjectMapped} = useAppGlobal();
    
    const [typeName,setTypeName] = useState(getObjectMapped(widgetReferenceDatas.typeName));   
    const [currentStatusesImages,setCurrentStatusesImages] = useState([]);
  
    const [test,setTest] = useState(0);
    const testRef=useRef(0);
    const expectedStatusRef = useRef(null)

    //const itemDatas = useSelector(state => getObjectById(state,itemId));   
    //const referenceItemDatas  = useSelector(state => getWidgetReference(state,itemId));
    const itemDatas = objectDatas;
   
    const referenceItemDatas  = widgetReferenceDatas;
    const referenceStatus = referenceItemDatas?.statusDictionary?.status;    
    const [checkOnState,setCheckOnState] = useState(referenceStatus);    
    const mountedRef = useRef(0);
   

    //---------------------------------------------------------
    const updateVisualStatus = (val) => {
       
        setCheckOnState(val);
       
        if(referenceItemDatas != undefined) {
            const renderAsTypeName = getObjectMapped(referenceItemDatas?.typeName)
            const sImages = Assets.getStatusesIcons(referenceItemDatas?.id,val,renderAsTypeName) || [];          
            setCurrentStatusesImages(sImages);
            setTest(test+1);
            testRef.current = testRef.current+1;
        }      
    }


    const getItemProp = (propName) => {
        return referenceItemDatas?.[propName]
    }
   //---------------------------------------------------------------------
   
    useEffect(() => {  
    
       if(expectedStatusRef.current == null)updateVisualStatus(status);
       if(expectedStatusRef.current != null && expectedStatusRef.current == status) {      
            expectedStatusRef.current = null;
       }
    }, [status]);
    
    
    
    //------------ APPIUM ----------------------------
    const generatedAppiumRefId = itemDatas.typeName+"_"+itemDatas.id;    
    const soId = buildTestId(generatedAppiumRefId);    
    const [addAutoId,setAddAutoId] = useState(soId)

    /*
    const doTestId = (autoId) => {
        if(Platform.OS == 'ios') return autoId;
        const appIdentifier = getBundleId();
        const prefix = `${appIdentifier}:id/`;
        const androidAutoId = `${prefix}${autoId}`;
        return androidAutoId;
    }
    */


    useEffect(() => 
    {   
        mountedRef.current = 1;
        updateVisualStatus(checkOnState); 
       // const autoId = buildTestId(props.automatedTestId); //(props.automatedTestId !== undefined) ? {'testID':doTestId(props.automatedTestId.autoId),'accessibilityLabel':props.automatedTestId.autoId}: {}
      
        //setAddAutoId(autoId)
        return () => {}
    },[]);


    useEffect(() => {  
       // refresh
    }, [objectDatas]);







    const togglePlug = async() => { 
        
           // not complete toggle();
           const testStatus = expectedStatusRef.current || status;
            const nextStatus = (testStatus == "on") ? "off" : "on";
            console.log("done!","it toggled to ",nextStatus);
            updateVisualStatus(nextStatus)       
            //setCheckOnState(nextStatus);
            const action = updateStatus(getItemProp('id'),"forcedStatus",nextStatus);
            console.log("forcedStatus",action);
            expectedStatusRef.current = nextStatus;
            updateStatus('status',nextStatus);
            updateStatus('forcedStatus',nextStatus);
           // dispatch(action);
            /*     
            (async () => {dispatch(updateStatus(getItemProp('id'),"forcedStatus",checkOnState));}
            )();
            */
          
            const actionName = (nextStatus == 'on')? 'ON' : 'OFF'; 
            console.log("actionName",actionName)
            //Api.executeAction(itemId,actionName);
            execute(actionName);
            console.log("after execute")
           
    }


    return (
            <>
                {/*<StatusPanel autoTestId={props?.automatedTestId} itemId={itemId} />  */}
                <StyledMainView>
                    <View><Text>PPPPP</Text></View>
                    {/* <Template  checkOnState={checkOnState} 
                                        activeStatusesImages={currentStatusesImages} 
                                        onPress={togglePlug}
                                        typeName={typeName} 
                                        itemId={itemId}
                                        addAutoId={addAutoId}/>  */}
                    
                                   
                </StyledMainView>
            </>
    )
}


/*
ToggleOnOffComp.propTypes = {
    prop1: PropTypes.string.isRequired,
    prop2: PropTypes.bool,
    prop3: PropTypes.shape({
      p1: PropTypes.string
    })
  };

*/

/**
 * My Testo inline
 * @param {{}} props
 * @param {string} props.message - voilà
 */
const MemoizedToggleOnOff = React.memo(ToggleOnOffComp,areEqual);
/*
testo.propTypes = {
    prop1: PropTypes.string.isRequired,
    prop2: PropTypes.bool,
    prop3: PropTypes.shape({
      p1: PropTypes.string
    })
  };
  */




export default  MemoizedToggleOnOff
  
//export default React.memo(ToggleOnOffComp,areEqual)

//export default ToggleOnOffComp


const StyledMainView = styled.View`
                    flex: 1; 
                    min-height:150px;
                `;


