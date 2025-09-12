import '_brand/templates/components/objects/common/locales'
import React, {useState, useEffect, useRef}  from 'react';
import { SafeAreaView,View,Text , StyleSheet} from 'react-native';
import { useNavigation,useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '_theming/themeProvider';
import { useObject } from '_hooks/object';
import {iconsJs} from '_brand/utils/iconsJs';
import { MultiPurposeWidgetLine } from "_brand/templates/components/objects/common/MultiPurposeWidgetLine";
import { BottomDeleteSheet } from '_brand/templates/components/objects/common/BottomDeleteSheet';
import { deleteObject } from '_api/objects';
import * as Actions from '_actions/objects';
import Toast from 'react-native-root-toast';
import {removeItemFromUserFav} from '_brand/utils/removeItemFromUserFav';
import {executeAction} from '_brand/templates/components/objects/common/utils/executeAction'
import { RenderGroupIconByState } from "_brand/templates/components/objects/common/RenderGroupIconByState";
import { CommonBottomSheetDeleteContent } from '_brand/templates/components/objects/common/CommonBottomSheetDeleteContent';
import {useGlobalModal} from '_components/ui/globalModal'


export const GroupShuttersDetailView = (props) =>{
    const {itemId, setKebab} = props;

    const [currentActive, setCurrentActive] = useState();
    const [stateIcon, setStateIcon] = useState([])

    const globalModal = useGlobalModal(); 
    const uObject = useObject(itemId);
    console.log(uObject)
    const typeName = uObject?.objectDatas?.typeName;

    const shutterLevel = uObject?.statuses?.level
    const status = uObject?.statuses?.status;
    const typeNature = uObject?.statuses?.__user_typeNature;
    const traits = uObject?.objectDatas?.traits;
    console.log("TYPE_NAURE :", uObject);

    const groupStatus = uObject?.objectDatas?.statusDictionary?.groupStatus
    const uniType = uObject?.objectDatas?.uniType
    const groupTypeName = uObject?.objectDatas?.groupTypeName
    const groupComponentTypes = uObject?.objectDatas?.componentTypes || []

    const components = uObject?.objectDatas?.components;


    const { t, i18n } = useTranslation();
    const tns = "common";

    const navigation = useNavigation();
    const route = useRoute();
    const navigationParams = route?.params || {};
    const {theme} = useTheme();  
    const testColor = theme?.onBody||'yellow';
    const borderColor = theme?.prflxBorderColor||'orange';
    const bgcolor = theme?.prflxContaintBgColor||'white';
    const lineWidgetBgColor = theme?.prflxVerticalMultiIconsBgColor||"white";
    const textColor = theme?.prflxTextColor||'black'

    // Deal with 368 homogeneous group icon
    let picto868;
    if(typeNature == "store"){
        picto868 = [iconsJs.store868Icon]
    } else if (typeNature == "bso"){
        picto868 = [iconsJs.bso868Icon]
    }else{picto868 = [iconsJs.vr868Icon]}

    let iconsCol1;
    let iconsCol2;

    const stopIcon = [iconsJs.stopIcon]

    if(!traits?.includes("Position")){
        // case: 868
       iconsCol1 =[
            iconsJs.favIcon,
       ];
   }else {
       iconsCol1 =[
        iconsJs.favIcon,
       iconsJs.ajarIcon,
       ];
   }
    if(!traits?.includes("Position")){
        // case :868
       iconsCol2 = [
           iconsJs.upIcon,
           iconsJs.stopIcon,
           iconsJs.downIcon,
       ];
   }else {
       iconsCol2 = [
        iconsJs.upIcon,
        iconsJs.open75perIcon,
        iconsJs.open50perIcon,
        iconsJs.open25perIcon,
        iconsJs.downIcon
    ];
   }
   
   // case : BSO
   const iconsCol3 = [
    iconsJs.bsoLame90degIcon,
    iconsJs.bsoLame67degIcon,
    iconsJs.bsoLame45degIcon,
    iconsJs.bsoLame22degIcon,
    iconsJs.bsoLame0degIcon,
]

   let iconDisplay = [iconsJs.groupShuttersIcon];

   useEffect(()=> {
    console.log('GROUP_STATUS_CHANGED_DETAIL :', groupStatus);
},[groupStatus]);
   
    useEffect(()=>{
        console.log("CHECK TYPES :", groupComponentTypes)
    },[groupComponentTypes])

    useEffect(()=>{

    },[stateIcon])
    
    useEffect(()=>{

    },[currentActive])

    useEffect(()=>{
        console.log("TRAITS CHECKS Details SERVER:", traits)
        console.log("TRAITS CHECKS Details STORE:",traits)
    },[traits])
 



    const handleOnPress = (iconId) => {
        setCurrentActive(iconId);
        executeAction(iconId, uObject)
    }

    const handleOnLongPress = (iconId)=>{
        if(iconId == "FAV_CALL_1/FAV_CALL_1/"+`${itemId}`){
            setCurrentActive(iconId);
            uObject.execute("FAV_SET_1");
            setTimeout( ()=>{
                setCurrentActive();
                Toast.show(
                    "Favorite position set ",
                    { 
                        backgroundColor: 'black', 
                        textColor: 'white', 
                        textStyle:{fontSize:16, fontWeight:'600'},
                        containerStyle:{width:'80%', height:100, justifyContent:'center', alignItems:'center', borderRadius:10, borderColor:borderColor, borderWidth:2}, 
                        position:-350,
                        duration:3000,  
                        onHide:()=>{}
                    }
                );
            },1000);
        }
    }

    const kebabUpdateAction = ()=>{
        // variable "itemPicked" below, is what the GroupModifyScreen needs to be transfered via route params
        const typeName = uObject?.objectDatas?.typeName;
        (typeName === 'composite')  ? 
                                        navigation.navigate('GroupModifyScreen', {itemPicked:itemId})
                                    :
                                        navigation.navigate('ProductSettings',{'typeName':typeName,itemId:itemId});
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
            removeItemFromUserFav(itemId)
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
                    //onHide:()=>navigation.goBack()
                }
            );        
            navigation.goBack()
            const action = Actions.objectDelete(itemId);    
            dispatch(action)
        }
        //console.log('item deleted ', itemId);
        //actionSheetRef.current?.dismiss();
    }

    const sendCurrentActive = (id) =>{
        setActive(id);
    }

    const onPressHandler = (id)=>{
        console.log("Coucou :", id )
    }


    //////////-------- Dealing with kebab menu
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
    //////////////////////////
    const actionSheetRef = useRef(null);
    const kebabDeleteAction = ()=>{
        //actionSheetRef.current?.present()
        onOpenSelect()
    }
    // Show the setting icon on header of level 2 widget 
    useEffect(() => {

        if(setKebab){
            setKebab(options)
        }
    },[]);


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


     return(
        <SafeAreaView style={styles.mainBody}>
            <View style={[styles.bodyWrapper,{flex:1, backgroundColor:bgcolor, borderColor:borderColor}]}>
                <View style={styles.topBody}>       
                    <RenderGroupIconByState 
                        iconColor={textColor}
                        iconSize={73}
                        groupId={itemId}
                        groupTypeName={groupTypeName}
                        uniType={uniType}
                        componentTypes={groupComponentTypes}
                        groupStatus={groupStatus}
                    />
                </View>

                <View style={styles.middleBody}>
                    <View>

                        <View>               
                            <MultiPurposeWidgetLine 
                                itemId={itemId}
                                icons={iconsCol1} 
                                iconSize={52}
                                onPress = {handleOnPress} 
                                onLongPress = {handleOnLongPress}
                                active = {sendCurrentActive}
                                iconWrapperStyle = {[styles.iconDisplay, {borderColor:textColor}]}
                                iconGroupWrapperStyle = {[styles.groupIconWrapper,{backgroundColor:lineWidgetBgColor, borderColor:textColor}]}
                                isShadow = {true}
                            />
                        </View>
                        {!groupComponentTypes.includes("Rolling_Shutter_Profalux") &&

                            <View style={{marginTop:20}}>               
                                <MultiPurposeWidgetLine 
                                    itemId={itemId}
                                    icons={stopIcon} 
                                    iconSize={52}
                                    onPress = {handleOnPress} 
                                    onLongPress = {handleOnLongPress}
                                    active = {sendCurrentActive}
                                    iconWrapperStyle = {[styles.iconDisplay, {borderColor:textColor}]}
                                    iconGroupWrapperStyle = {[styles.groupIconWrapper,{backgroundColor:lineWidgetBgColor, borderColor:textColor}]}
                                    isShadow = {true}
                                />
                            </View>
                        
                        }
                    </View>

                    <View>               
                        <MultiPurposeWidgetLine 
                                itemId={itemId}
                                icons={iconsCol2} 
                                iconSize={52}
                                onPress = {handleOnPress} 
                                onLongPress = {handleOnPress}
                                active = {sendCurrentActive}
                                iconWrapperStyle = {[styles.iconDisplay, {borderColor:textColor}]}
                                iconGroupWrapperStyle = {[styles.groupIconWrapper,{backgroundColor:lineWidgetBgColor, borderColor:textColor}]}
                                isShadow = {true}
                                />
                    </View>
                    {
                        traits?.includes('Rotation') &&
                        <View>               
                            <MultiPurposeWidgetLine 
                                    itemId={itemId}
                                    icons={iconsCol3} 
                                    iconSize={52}
                                    onPress = {handleOnPress} 
                                    onLongPress = {handleOnPress}
                                    active = {sendCurrentActive}
                                    iconWrapperStyle = {[styles.iconDisplay, {borderColor:textColor}]}
                                    iconGroupWrapperStyle = {[styles.groupIconWrapper,{backgroundColor:lineWidgetBgColor, borderColor:textColor}]}
                                    isShadow = {true}
                                    />
                        </View>
                    }
                </View>

                <View style={styles.footView}>
                    <View style={{flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
                        <Text style={[styles.textStyle,{color:textColor,textAlign:'center'}]}>{t(tns+":"+"PRESS_FAV_HINT")}</Text>
                        <MultiPurposeWidgetLine 
                                    icons={[iconsJs.favIcon]} 
                                    isPressable={false}
                                    iconSize={25}
                                    onPress = {handleOnPress} 
                                    onLongPress = {handleOnPress}
                                    active = {sendCurrentActive}
                                    iconWrapperStyle={[styles.iconDisplay]}
                                    />
                    </View>
                    <Text style={[styles.textStyle,{color:textColor}]}>{t(tns+":"+"PRESS_FAV_ACTION")}</Text>
                </View>
            </View>

            {/* <BottomDeleteSheet 
                    myRef= {actionSheetRef}
                    handleCancel={handleCancel}
                    handleDelete = {handleDelete}
                    />  */}
        </SafeAreaView>
    );

}

const styles = StyleSheet.create({
    mainBody:{
        flex:1,
        borderRadius:10,
        margin:10
    },
    bodyWrapper:{
        flex:1,
        flexDirection:'column',
        justifyContent:'flex-start',
        padding:23,
        borderWidth:2, 
        borderRadius:12,
    },
    topBody:{
        backgroundColor:'transparent',
        alignItems:'flex-start',
    },
    middleBody:{
        backgroundColor:'transparent',
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        flexDirection:'row',
        marginTop:31,
        padding:5
    },
    iconDisplay:{
        flexDirection:'column',
        margin:3,
        borderWidth:2,
        borderRadius:5,
        //backgroundColor:'white'
    },
    groupIconWrapper:{
        marginHorizontal:12.5,
        borderRadius:12,
        borderWidth:1,
       // marginBottom:100

    },
    footView:{
        marginTop:57,
        marginBottom:54,
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'center'
    },
    textStyle:{
        marginTop:2,
        fontSize:16,
    }
    

});