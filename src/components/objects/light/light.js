import React from 'react';
import {useContext,useState,useEffect} from 'react';
import { View,Text, Pressable } from 'react-native';
import { useStore,useSelector,useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/native';

import { useTheme } from '_theming/themeProvider';
import { CircularPicker } from '_components/pickers/circular-picker'
import PureIconRender from '_components/pureIconRender';
import {StyledIconWrapperView} from '_components/ui/styled/icons';
import {VSlider} from '@components/ui/sliders/vSlider';
import { useObject } from '_hooks/object';

import {StatusPanel} from '_components/objects/@common/testAutomation/statusPanel';

//--- Appium -----
import {buildTestId} from '_helpers/appium';


const areEqual = (prevProps, nextProps) => {
    /*****************************
     * the component will be reRendered when 
     * objectDatas or widgetReferenceDatas will update
     * even if true is return
     * that's the expected behaviour
     */
    /*
    console.log("AAAAB -------> areEqual",prevProps,nextProps);
    if(prevProps.luminoPleasure != nextProps.luminoPleasure) return false;
    return true;
    */

    




    let noReRender = (prevProps.luminoPleasure === nextProps.luminoPleasure)
    if(noReRender) {
        noReRender = (prevProps.uObject?.status === nextProps.uObject?.status)
    }
    //console.log("AAAAD ---->",noReRender)
    return noReRender;
    // info : no render -> return true;
}

/**
 * return Type Light Widget
 * 
 * @param {Object} props
 * @param {object} props.statuses object statusDictionary
 * @param {number} props.itemId
 * @param {array} props.actions
 * @param {number} props.widgetReferenceId (if a group is rendered)
 * @param {array} props.activeStatusesImages
 * @param {string} props.luminoPleasure  a color
 * 
 * 
 */
export const TypeLight = React.memo((props) => {
    const { t, i18n } = useTranslation(); 
    const { itemId,luminoPleasure} = props;
    const uObject = useObject(itemId);
    const {objectDatas,widgetReferenceDatas,statuses,name,connected,status,updateStatus,getStatus : getMyStatus,execute,toggle,hasAction,activeStatusesImages = []} = uObject;  
    const widgetReferenceId = widgetReferenceDatas?.id || objectDatas?.id
    const itemDatas = objectDatas;
    console.log("TypeLight props",props)
    
    const {theme} = useTheme();   
    const dispatch = useDispatch();


    const toggleLight = () => {
        //console.log('go');
        const actionName = (statuses.status == 'on')? 'OFF' : 'ON';
        const expectedStatus = (actionName == 'OFF') ? 'off' : 'on';
        updateStatus('status',expectedStatus);
       
        // Needed for composite
        if(widgetReferenceId !=  itemId) {
            //mean it's a composite
           // const updateFirstItemId = (widgetReferenceId!= undefined) ? widgetReferenceId : props.firstItem.id
            updateStatus('status',expectedStatus,widgetReferenceId);
            //dispatch(updateStatus(updateFirstItemId,'status',expectedStatus))
        }
        execute(actionName);

    }

    const iconSize = 60;
    const iconFillColor = theme["card--color--icon"]
    const [initialColor,setInitialColor] = useState("#FFFFFF");
    const [colorDestination,setColorDestiation] = useState('#FFFFFF');
    const initialLuminosity = statuses?.luminosity || 50 ;
    const initialTemperature = statuses?.temperature || 50;

    const [dimAction,setDimAction] = useState("");
   
    const [hasColor,setHasColor] = useState(hasAction("COLOR"));
    const [hasLevel,setHasLevel] = useState(hasAction("LEVEL"));
    const [hasTemp,setHasTemp] = useState(hasAction("TEMP"));
    //const [hasTemp,setHasTemp] = useState(false)
    useEffect(() => {    
        console.log("aïe caramba")  
        setInitialColor(statuses?.color || "#FFFFFF")      
        const actions = widgetReferenceDatas.actions;
        const myAction = actions?.reduce((r,v,i)=> {
           
            if(v.name == "LEVEL" || v.name =="DIM") {
                r = v.name
            }
            return r
        },"")
        setDimAction(myAction)
        console.log("je refais la lumière")
     }, []);

     useEffect(() => {      
       
     }, [hasTemp,hasColor,hasLevel]);


     useEffect(() => {   
         console.log("useEffect luminopleasure >>>",luminoPleasure)
         if(luminoPleasure) setInitialColor(luminoPleasure);         
       
        
     }, [luminoPleasure]);

     




     useEffect(()=> {
       
        setInitialColor(statuses?.color)
     },[statuses.color])

     useEffect(()=> {
        //console.log("initial  color changed",initialColor)

        //setInitialColor(props.statuses.color)
     },[initialColor])
     
   


    const colorCallback = (val) => {
        

        const currColor = statuses.color || "not set";     
        if(val.toUpperCase() != currColor.toUpperCase()) {           
             
            execute("COLOR",{mArgs:[{name:'color',value:val}]});
        } else {
           // console.log("no execution identical colors")     
            //console.log("So no updateColor for "+itemId)
        }        
    }


    const dimCallback = (value) => {       
        //console.log("dim",value)
    }

    const dimComplete = async (value) => {
       // console.log("dim completed",value);
        const val = Math.round(value)

        const res = await execute(dimAction,{mArgs:[{name:'level',value:val}]});
        //console.log("res LEVEL",res);
    }

    const tempCallback = (value) => {
        //console.log("Warmth",value)
    }

    const tempComplete = async (value) => {
        //console.log("temp completed",value);
        const val = Math.round(value)
        const res = execute("TEMP",{mArgs:[{name:'level',value:val}]}); 
        //console.log("res TEMP",res);
    }

    const downColor ="#CCCCCC";
    const upColor ="transparent";
    const [isDown,setIsDown] = useState(false);
    const onPressIn = () => {setIsDown(true);};
    const onPressOut = () => {setIsDown(false);};

     
    //------------ APPIUM ----------------------------
    const generatedAppiumRefId = itemDatas.typeName+"_"+itemDatas.id;
    
    const soId = buildTestId(generatedAppiumRefId);
    
    const [addAutoId,setAddAutoId] = useState(soId)


    return (
            <>
            {/*<StatusPanel autoTestId={props?.automatedTestId} itemId={itemId} />  */}
            <View style={{flex:1,flexDirection:'row',paddingTop:10,height:220,paddingBottom:20}}>
                <View style={{flex:2,height:200,alignItems:'center',justifyContent:'center'}}>
                    <>
                    <View style={{width:200/0.8,height:200/0.8}}>
                        {hasColor  &&
                        <CircularPicker initialColor={initialColor}  callback={colorCallback} {...(props.luminoPleasure && { luminoPleasure: props.luminoPleasure })}/>
                        }
                        <StyledIconWrapperView size={iconSize*(1.2)} backgroundColor={theme['card--color--icon--wrapper--background']} >
                            <Pressable style={{borderRadius:iconSize*1.2/2,backgroundColor:(isDown)?downColor:upColor}} onPress={()=>{toggleLight()}}  onPressIn={onPressIn} onPressOut={onPressOut} {...addAutoId}>
                                <PureIconRender size={iconSize} img={"light.svg" } fill={iconFillColor} activeStatusesImages={activeStatusesImages}/>
                            </Pressable>
                        </StyledIconWrapperView>
                    </View>
                    </>
                </View>
                    { (hasLevel == true || hasTemp == true) &&
                    <View style={{flex:1,flexDirection:'row'}}>
                        { hasLevel == true && 
                            <View style={{flex:1,maxWidth:40,backgroundColor:theme['card--color--icon--wrapper--background'],paddingTop:5,paddingRight:15,paddingBottom:5,paddingLeft:15,borderRadius:12,alignItems:'center'}}>
                                <VSlider 
                                    tintColor="#BBBBBB"
                                    maxTintColor="#000000"
                                    cursorTintColor="#BBBBBB"

                                    type="light"
                                    minimumTrackTintColor='#1fb28a'
                                    maximumTrackTintColor='#d3d3d3'
                                    thumbTintColor='#FF0000' 
                                    callback={dimCallback} 
                                    onSlidingComplete={dimComplete}
                                    iconSize={24} 
                                    iconTop="light-up"
                                    iconBottom ="light-down"
                                    value={initialLuminosity}
                                />
                        </View> 
                        }
                        <View style={{flex:1,width:40,backgroundColor:'transparent',padding:5,borderRadius:12,alignItems:'center'}}>
                            <VSlider 
                                tintColor="#BBBBBB"
                                maxTintColor="#000000"
                                cursorTintColor="#BBBBBB"


                                minimumTrackTintColor='#1fb28a'
                                maximumTrackTintColor='#d3d3d3'
                                thumbTintColor='#2bff00' 
                                callback={tempCallback} 
                                onSlidingComplete={tempComplete}                           
                                gradientTrack={true}
                                height={180}
                                value={initialTemperature}
                            />
                        </View>    
                    </View>
                }
            </View>
            </>
    )
},areEqual)

//export default React.memo(TypeLight,areEqual)

const StyledMainView = styled.View`
                    flex: 1;
                    height:150px;
                    width:150px;                          
                `;