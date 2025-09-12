import '_brand/templates/components/objects/common/locales'
import React, {useState,useEffect, useRef} from 'react';
import { View,Text,StyleSheet, Platform, Dimensions} from 'react-native';
import { useSelector,useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '_theming/themeProvider';
import styled from 'styled-components/native';
import { useObject } from '_hooks/object';
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
import { CommonHomogeneousLightPlugWidget } from '../../widget/components/CommonHomogeneousLightPlugWidget';
import { CommonBottomSheetDeleteContent } from '_brand/templates/components/objects/common/CommonBottomSheetDeleteContent';
import {useGlobalModal} from '_components/ui/globalModal'




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

export const HomgeneousLightGroupDetail = (props) => {

    const globalModal = useGlobalModal(); 
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
        //actionSheetRef.current?.present()
        onOpenSelect()
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
        //setInitialColor(props.statuses.color)
        //console.log("INITIAL COLOR :", initialColor)
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


     const onCancelPressed = () => {
        console.log('CANCEL_DELETE :');
        globalModal.close();
      }
    
      const onOpenSelect = () => {  
          const content = (
            <View style={{width:'100%', height: 200}}>
              <CommonBottomSheetDeleteContent 
                  nameToDelete={`${t(tns+":"+"THIS_GROUP")}`} 
                  warningText={`${t(tns+":"+"WARNING_DELETE")}`}
                  textColor={textColor} 
                  onDelete={handleDelete} 
                  onCancel={onCancelPressed} 
              />
            </View>
                )
          globalModal.setContent(content,{type:'bottom'});    
          globalModal.toggle();
      }

     const handleCancel = ()=>{
        console.log('Delete canceled');
        actionSheetRef.current?.dismiss();
    }
    
    const handleDelete = async()=>{
        globalModal.close();
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
         //actionSheetRef.current?.dismiss();
     }

     const setColor = (color)=>{
        const hexColor = Number(color).toString(16);
        console.log("SET COLOR :", hexColor)
        execute("COLOR",{mArgs:[{name:'color',value:`#${hexColor}`}]});
        //const result = await execute("COLOR",{mArgs:[{name:'color',value:hexColor}]});
     }
     const handleColorConfirm = async(color)=>{
        console.log("COLOR CONFIRM :", color)
        const res = await execute("COLOR",{mArgs:[{name:'color',value:color}]});
        setServerColor(color)
        //const result = await execute("COLOR",{mArgs:[{name:'color',value:color}]});
     }

 
    const handleHueSaturation = (value)=>{
        const color = fromHsv(value)
        console.log("HAA COLOR : ", color)
        execute("COLOR",{mArgs:[{name:'color',value:color}]});
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
                            {/* <LightPlugWidget itemId = {itemId} iconSize = {52} isLight/> */}
                            <CommonHomogeneousLightPlugWidget 
                                itemId = {itemId} 
                                iconSize = {40} 
                                titlePaddingBottom ={20} 
                                titleFontWeight = {'600'}
                                titleFontSize = {18}
                                isLight
                            />
                        </View>
                            <View style={{alignItems:'center', justifyContent:'center', flex:1, backgroundColor:'transparent',  borderRadius:7}}>
                                {hasColor  &&
                                    <View style={{flex:1, marginTop:-20, width:250,height:400}}>
                                        <Text style={{color:textColor, position:'absolute', top:'80%', left:'0%',color:textColor, fontSize:16, fontWeight:'400' ,zIndex:1, textAlign:'center'}}>{t(tns+":"+"SELECT_COLOR")} </Text>

                                          <TriangleColorPicker
                                                color={currentColor}
                                                onColorSelected={handleColorEnd}
                                                
                                                //onEndColor = {(hsvColor)=>handleColorEnd(hsvColor)}
                                                onColorChange = {handleColorChange}
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
                                                iconColor = 'orange'
                                                //iconWrapperStyle = {{ marginRight:(Platform.OS === 'ios')? 10 : -10 }}
                                            />
                                        </View>
                                        <View>
                                            <Slider
                                                style={{width: 220, height: 30, marginLeft:15}}
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
                                                iconColor = 'orange'
                                                //iconWrapperStyle = {{marginLeft:(Platform.OS === 'ios')? 10 : -15}}
                                            />
                                        </View>
                                    </View>
                            </View>
                            {/* <BottomDeleteSheet 
                                myRef= {actionSheetRef}
                                handleCancel={handleCancel}
                                handleDelete = {handleDelete}
                            />  */}
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