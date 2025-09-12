import '_brand/templates/components/objects/common/locales'
import React, {useState,useEffect, useRef} from 'react';
import { View,Text,StyleSheet, Platform, Dimensions} from 'react-native';
import { useSelector,useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '_theming/themeProvider';
import styled from 'styled-components/native';
import { useObject } from '_hooks/object';

///// harold 
import { LightPlugWidget } from '_brand/templates/components/objects/light/components/LightPlugWidget';
import {iconsJs} from '_brand/utils/iconsJs';
import { BottomDeleteSheet } from '_brand/templates/components/objects/common/BottomDeleteSheet';
import { deleteObject } from '_api/objects';
import * as Actions from '_actions/objects';
import Slider from '@react-native-community/slider';
import { MultiPurposeWidgetLine } from "_brand/templates/components/objects/common/MultiPurposeWidgetLine";
import Toast from 'react-native-root-toast';
//--- Appium -----
import {buildTestId} from '_helpers/appium';
import { ColorPicker, TriangleColorPicker} from 'react-native-color-picker'
import {toHsv, fromHsv } from 'react-native-color-picker'
import {useScenario} from '_brand/templates/screens/routines/hook/useScenario'




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



const COLORS = [
    'red',
    'purple',
    'blue',
    'cyan',
    'green',
    'yellow',
    'orange',
    'black',
    'white',
  ];

const BACKGROUND_COLOR = 'rgba(0,0,0,0.9)';

const { width } = Dimensions.get('window');

const CIRCLE_SIZE = width * 0.8;
const PICKER_WIDTH = width * 0.9;

export const LightDetails = (props) => {
    const { t, i18n } = useTranslation(); 
    const tns = "common";
    const { itemId,luminoPleasure, setKebab, traits} = props;
    const uObject = useObject(itemId);
    console.log("Light Detail :", uObject)


    const gloIsConnected = useSelector(state=> state?.network?.isConnected);
    const gloServerIsDown = useSelector(state=> state?.network?.serverIsDown);
    const netInfoIsConnected = (gloIsConnected == true && gloServerIsDown == false);
    
    const {objectDatas,widgetReferenceDatas,statuses,name,connected,status,updateStatus,getStatus : getMyStatus,execute,toggle,hasAction,activeStatusesImages = []} = uObject;  
    const widgetReferenceId = widgetReferenceDatas?.id || objectDatas?.id
    const itemDatas = objectDatas;
    const initColor = uObject?.objectDatas?.statusDictionary?.color;
    //console.log("TypeLight props",props)


    const [initialColor,setInitialColor] = useState();
    const [currentColor,setCurrentColor] = useState(initColor);


    const [dimAction,setDimAction] = useState("");
    const [hasColor,setHasColor] = useState(hasAction("COLOR"));
    const [hasLevel,setHasLevel] = useState(hasAction("LEVEL"));
    const [hasTemp,setHasTemp] = useState(hasAction("TEMP"));
    //const [hasTemp,setHasTemp] = useState(false)

    const uScenario = useScenario();
    const { isRoutine, actionsByItemId } = uScenario;

    useEffect(()=> {
        console.log("USE SCENARIO:",actionsByItemId)
    },[actionsByItemId]);
    

  /////// Harold  
    const dispatch = useDispatch();
    const {theme} = useTheme();  
    const navigation = useNavigation();
    const route = useRoute();
    const navigationParams = route?.params || {};

    const testColor = theme?.onBody||'yellow';
    const borderColor = theme?.prflxBorderColor||'orange';
    const bgcolor = theme?.prflxContaintBgColor||'white';
    const lineWidgetBgColor = theme?.prflxVerticalMultiIconsBgColor||"white";
    const textColor = theme?.prflxTextColor||'black'

    const dimValue = Number(uObject?.statuses?.level);
    useEffect(() => {
        console.log("LAMP DIM STATE LEVEL :",dimValue);

    },[dimValue]);
    
    useEffect(() => {

        if(setKebab){
            setKebab(options)
        }
    },[]);

    const options = [
        {
            id:"modify",
            title:`${t(tns+":"+"KEBAB_MODIFY")}`,
            iconJSName: iconsJs.modifyIcon.name,
            action:()=>kebabUpdateAction()
        },
        {
            id:'delete',
            title:`${t(tns+":"+"KEBAB_DELETE")}`,
            iconJSName: iconsJs.deleteIcon.name,
            action:()=>kebabDeleteAction()
        },
    ]
    const actionSheetRef = useRef(null);
    const kebabDeleteAction = ()=>{
        actionSheetRef.current?.present()
        //  actionSheetRef.current?.show()
    }

    const kebabUpdateAction = ()=>{
        // variable "itemPicked" below, is what the GroupModifyScreen needs to be transfered via route params
        const typeName = uObject?.objectDatas?.typeName;
        (typeName === 'composite')  ? 
                                        navigation.navigate('GroupModifyScreen', {itemPicked:itemId})
                                    :
                                        navigation.navigate('ProductSettings',{'typeName':typeName,itemId:itemId});
    }
    

     /////// Fin harold


    useEffect(() => {    
        console.log("SHOW STATUS COLOR :", initColor )  
        setInitialColor(initColor || "#FFFFFF")      
     }, [initColor]);


     useEffect(()=> {
        console.log("CURRENT  color changed",currentColor)
     },[currentColor])

     useEffect(() => {      
       
     }, [hasTemp,hasColor,hasLevel]);




     const colorRef = useRef();
     const prevRef = useRef();

    const handleColorChange = (color)=>{
        //const colorConv = Number(color).toString(16)
        const hexColor = fromHsv(color);
        colorRef.current = hexColor;
        console.log("Hello MEEEEE COLOR g :", hexColor)
        console.log("INITIAL COLOR RRRR :", colorRef.current, prevRef.current)
        //execute("COLOR",{mArgs:[{name:'color',value:hexColor}]});
            setCurrentColor(hexColor); 
            prevRef.current = hexColor;     
            //execute("COLOR",{mArgs:[{name:'color',value:color}]});

    }
    const handleColorEnd = async(color)=>{
        //const colorConv = Number(color).toString(16)
        const hexColor = fromHsv(color);
        console.log("Handle COLOR SEND :", color)
        //console.log("INITIAL COLOR RRRR :", colorRef.current, prevRef.current)
        
        const result = await execute("COLOR",{mArgs:[{name:'color',value:hexColor}]});
        //console.log("RESULT :", result)
        //setInitialColor(hexColor); 

    }
      


     
    //------------ APPIUM ----------------------------
    const generatedAppiumRefId = itemDatas?.typeName+"_"+itemDatas?.id;
    
    const soId = buildTestId(generatedAppiumRefId);
    
    const [addAutoId,setAddAutoId] = useState(soId)


    const onSlidingHandler = (value) => {
        console.log("dim completed",value);
         const val = Math.round(value)
 
         execute("DIM",{mArgs:[{name:'level',value:val}]});
         //console.log("res LEVEL",res);
     }


     const handleCancel = ()=>{
        console.log('Delete canceled');
        actionSheetRef.current?.dismiss();
    }
    
    const handleDelete = async()=>{
        // alert("Really wanna delete?")
        console.log("Deleted itemId :", itemId)
         const res = await deleteObject(itemId).catch((err) => { console.log(err) });
         if (res.errCode == 200) {  
            Toast.show(
                `${t(tns+":"+"TOAST_DELETE")}`,
                { 
                    backgroundColor: 'black', 
                    textColor: 'white', 
                    textStyle:{fontSize:16, fontWeight:'600'},
                    containerStyle:{width:'80%', height:100, justifyContent:'center', alignItems:'center', borderRadius:10, borderColor:borderColor, borderWidth:2}, 
                    //position: Toast.positions.CENTER,
                    position:-350,
                    duration:3000,  
                    onHide:()=>navigation.goBack()
                }
            );        
            navigation.goBack()
            const action = Actions.objectDelete(itemId);    
            dispatch(action)
         }
         //console.log('item deleted ', itemId);
         actionSheetRef.current?.dismiss();
     }

    return (
        <>

            <View style={[styles.bodyWrapper,{backgroundColor:bgcolor, margin:10, borderColor:borderColor}]}>
                <View style={[
                    styles.bodyWrapper,
                    {backgroundColor:(connected == false || !netInfoIsConnected)? theme['card--color--deactivated-overlay'] : 'transparent', 
                    borderColor:'transparent',
                    zIndex:(connected == false || !netInfoIsConnected)? 1: 0,
                    position:'absolute',
                    opacity:0.6,
                    width:'100%',height:'100%',
                    }]}/>
                        <View style={{justifyContent:'center', alignItems:'flex-start', paddingTop:20}}>
                            {/* <LightsWidget itemId = {itemId}/> */}
                            <LightPlugWidget itemId = {itemId} iconSize = {52} isLight isRoutine={isRoutine}/>
                        </View>
                            <View style={{alignItems:'center', justifyContent:'center', flex:1, backgroundColor:'transparent',  borderRadius:7}}>
                                {hasColor  &&
                                    //style={{width:150,height:150}}
                                    <View style={{flex:1, marginTop:-20, width:250,height:400}}>
        
                                        <Text style={{position:'absolute', top:'80%', left:'0%',color:textColor, fontSize:16, fontWeight:'400' ,zIndex:1, textAlign:'center'}}>{t(tns+":"+"SELECT_COLOR")}</Text>

                                          <TriangleColorPicker
                                                color={currentColor}
                                                onColorSelected={color => handleColorEnd(color)}
                                                
                                                //onEndColor = {(hsvColor)=>handleColorEnd(hsvColor)}
                                                onColorChange = {(hsvColor)=>handleColorChange(hsvColor)}
                                                style={{flex: 1}}
                                                //hideSliders={true}
                                                //hideControls={true}
                                            />
                                                                                    
                                    </View>
                                }
                                    <View style={{flexDirection:'row', marginBottom:20, marginTop:20}}>
                                        <View>
                                            <MultiPurposeWidgetLine 
                                                icons={[iconsJs.sunMinIcon]} 
                                                iconSize={25}
                                                isPressable ={false} 
                                                iconBgColor ={'transparent'}
                                                iconColor = 'white'
                                                //iconWrapperStyle = {{ marginRight:(Platform.OS === 'ios')? 10 : -2 }}
                                            />
                                        </View>
                                        <View>
                                            <Slider
                                                style={{width: 255, height: 30, marginLeft:15}}
                                                minimumValue={0}
                                                maximumValue={100}
                                                step ={1}
                                                value = {!isNaN(dimValue)? dimValue : 0}
                                                minimumTrackTintColor="orange"
                                                //minimumTrackTintColor="#FFFFFF"
                                                maximumTrackTintColor="#787880"
                                                onSlidingComplete={onSlidingHandler}
                                            />

                                        </View>
                                        <View>
                                            <MultiPurposeWidgetLine 
                                                icons={[iconsJs.sunMaxIcon]} 
                                                iconSize={30}
                                                isPressable ={false} 
                                                iconBgColor ={'transparent'}
                                                iconColor = 'white'
                                                iconWrapperStyle = {{marginLeft:(Platform.OS === 'ios')? 10 : -2}}
                                            />
                                        </View>
                                    </View>
                            </View>
                            <BottomDeleteSheet 
                                myRef= {actionSheetRef}
                                handleCancel={handleCancel}
                                handleDelete = {handleDelete}
                            /> 
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    bodyWrapper:{
        flexDirection:'column',
        justifyContent:'center',
        borderWidth:1, 
        borderRadius:12,
    },
    bodyStyle:{
        backgroundColor:'transparent',
        flex:1,flexDirection:'row',
        alignItems:'center', 
        justifyContent:'flex-start',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 16,
      },
      currentColor: {
        width: 80,
        height: 40,
        borderRadius: 20,
        marginBottom: 24,
        borderWidth: 2,
        borderColor: 'white',
      },
})

//export default React.memo(TypeLight,areEqual)

const StyledMainView = styled.View`
                    flex: 1;
                    height:150px;
                    width:150px;                          
                `;