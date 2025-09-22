import React, {useState, useEffect}  from 'react';
import { SafeAreaView,View,Text , StyleSheet, Pressable, Dimensions} from 'react-native';
import { useNavigation,useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useTranslation } from 'react-i18next';
import {getKey,setKey} from '_services/storage';

import {ThemeProvider} from 'styled-components/native';
import { useTheme } from '_theming/themeProvider';
import { MultiPurposeLine } from "_components/list/multiPurposeLine";

import { useObject } from '_hooks/object';

import VuesaxBoldRecordCircle from '_brand/images/icons/app/VuesaxBoldRecordCircle';
import VuesaxOutlineStar from '_brand/images/icons/app/VuesaxOutlineStar';

import RightChevron from '_brand/images/icons/app/ArrowRight1';
import { VerticalSlider } from '../components/VerticalSlider';



export const ShutterLevel2Details = (props) => { 

    const {setSettings, itemId} = props;
    const { t, i18n } = useTranslation();
    const tns = "rollingShutter";
    // Retrieve shutter object data
    const shutterObjectAllInfos = useObject(itemId);
    // console.log("Shutter Object 11441 :", shutterObjectAllInfos);
    const shutterLevel = Number(shutterObjectAllInfos.statuses.level);
    console.log('LEVEL :', shutterLevel)

    const [levelPercent,setLevelPercent] = useState(0);
    const [favPositionButtonMessage, setFavPositionButtonMessage] = useState('Allez au favori');
    const [favoritePosition, setFavoritePosition] = useState(0);
    const [isFavoritePosition, setIsFavoritePosition] = useState(false);
    const [favBtnClicked, setFavBtnClicked] = useState(false);
    const [levelEqualsFavPosition, setLevelEqualsFavPosition] = useState(false);


    const {theme,baseColors} = useTheme();
    const iconColor = theme['card--color--icon'];

    const textColor = theme['card--color--text'];
    const styledTheme = {'textColor':textColor};
    const [bgColor, setBgColor] = useState('transparent');

    const defaultProperties = { 'fullTouchable':true,
    'actionType':"navigate",
    'color':"white",
    'titleStyle':{fontWeight:'600'},
    'subtitleStyle':{fontWeight:"400",opacity:0.75,fontSize:14}
};


//const bottomModalRef = useRef();

    // Navigation params for setting icon redirection
    const navigation = useNavigation();
    const route = useRoute();
    const navigationParams = route?.params || {};
        
    // Show the setting icon on header of level 2 widget 
    useEffect(()=> {
        //setLevelPercent(shutterLevel);
        if(setSettings) {
            setSettings(settingsAction)
        }
    },[]);

        // Action function to navigate to the right widget setting page 
        const settingsAction = () => {
            // ie: navigate to ProductSettings for object of type name = typeName and with id: itemId
            navigation.navigate('ProductSettings',{'typeName':shutterObjectAllInfos?.objectDatas?.typeName,itemId:itemId});       
        }


    useEffect(()=> {
        setLevelPercent(shutterLevel);
        const getData = async () => {
            try {
              const value = await getKey('userFavoritePosition')
              if(value !== null) {
                setFavoritePosition(JSON.parse(value));
                setIsFavoritePosition(true);
              }else{
                setIsFavoritePosition(false);
                setFavoritePosition(JSON.parse(null));
            }
            } catch(e) {
              // error reading value
            }
          };
          getData();
          if(favoritePosition === shutterLevel){
            setLevelEqualsFavPosition(true);
          }else{ setLevelEqualsFavPosition(false);}
          console.log('USER FAVORITE =', favoritePosition );
          console.log("USER FAV EQUALS LEVEL ? : ", levelEqualsFavPosition);

          if(isFavoritePosition === true && favoritePosition !== null){
            if(levelEqualsFavPosition === true){
                setFavPositionButtonMessage('removefavorite');
            }else{setFavPositionButtonMessage('gotofavorite');}
            
          }else{setFavPositionButtonMessage('addfavorite')}

    },[isFavoritePosition, levelEqualsFavPosition, shutterLevel, favoritePosition, favPositionButtonMessage]);






    const WIDTH = Dimensions.get('window').width - 42;


    // Handle on change value from slider
    const onValueChangeHandler = async (slideValue) =>{
        console.log('sliV', slideValue);
        let val = Math.round(slideValue);
        if(val < 0)val = 0;
        if(val > 100)val = 100;
        console.log("Slider moves to value = ", val);
        setLevelPercent(val);
        //console.log("State levelPercent moves  to value = ", levelPercent);
       shutterObjectAllInfos.execute("LEVEL",{mArgs:[{name:'level',value:val}]});
    }


      const removeItemToStorage = async (name) => {
        try {
          await AsyncStorage.removeItem(name);
        } catch (error) {
          console.log(error);
        }
      };


    const handleFavbuttonPress = () =>{
        if(favPositionButtonMessage === 'removefavorite'){
            removeItemToStorage('userFavoritePosition');
            setFavoritePosition(false);
        };

        if(favPositionButtonMessage === 'addfavorite'){
            setKey('userFavoritePosition', shutterLevel);
            setFavoritePosition(true);
        };

        if(favPositionButtonMessage === 'gotofavorite'){
            shutterObjectAllInfos.execute("LEVEL",{mArgs:[{name:'level',value:favoritePosition}]});
            setIsFavoritePosition(true);
            setLevelEqualsFavPosition(true);
        };
    };

    const handleStop = () =>{
        console.log("Stop pressed");
        shutterObjectAllInfos.execute('STOP');
    }


    // RENDER TOP BOTTOM
    const Top = () => {
        return (
            <ThemeProvider theme={styledTheme}>    
                <View style={{marginTop:4,alignItems:'center'}}>
              
                    <RoundView size={514} bgColor={bgColor}>

                    </RoundView>   
                </View>
            </ThemeProvider>      
        )
    }

    const Bottom = () => {
        return (
            <View style={{paddingLeft:16,paddingRight:16}}>
                <MultiPurposeLine   {...defaultProperties}
                                    title={t(tns+":"+"PROGRAMMING")}
                                    subTitle={t(tns+":"+"OPEN") + t(tns+":"+"UNTIL") + "23:00"} 
                                    fullTouchable={false}
                                    nosubtitleAppart  />
            </View>        
        )
    }


    const send = () =>{
        shutterObjectAllInfos.execute("FAV_SET_1",{oArgs:[{name:'level',value:20}]})
    }
    const receive = ()=>{
        const callFav = shutterObjectAllInfos.execute("FAV_CALL_1");
        console.log('CALL FAVORITE FROM SERVER :', callFav);
    }

    return(

        <SafeAreaView style={{flex:1, backgroundColor:'#1D1E2C'}}>

            {/* BODY */}
            <SafeAreaView style={{flex:1, backgroundColor:'white', borderBottomEndRadius:32, borderBottomStartRadius:32, minHeight:514}}>

                {/* minWidth:230, maxHeight:614  */}
                <View style={{flex:1, backgroundColor:'white', justifyContent:'center', minHeight:314, alignItems:'center'}}>
                        {/* Shutter icon and text render */}
                        <View style ={{backgroundColor:'transparent', minWidth:90,maxHeight:100, alignItems:'stretch', justifyContent:'center', position:'absolute', left:65, top:200}}>
                            <View style={{marginLeft:65, marginBottom:8}}>
                                {/* <IconJsRender IconJSImportedName={VoletEntrouvert} size={23}/> */}
                            </View>

                            <View style={{marginTop:0, justifyContent:'flex-end'}}>
                                <Text style={{fontSize:13, color:'#757575'}}>{t(tns+":"+"SHUTTER_OPENED_AT")}</Text>
                                <Text style={{fontSize:18, fontWeight:'bold', marginLeft:50}}>{shutterLevel}%</Text>
                            </View>
                        </View>

                        {/* Slider Render */}
                        <View style={{backgroundColor:'transparent', height:300, width:40, marginLeft:40}}>
                            <VerticalSlider 
                                sliderHeight = {300} 
                                minValue={0} 
                                maxValue={100} 
                                step ={1}
                                sliderValue ={levelPercent}
                                ajarPosition = {0.2}
                                ajarPercentage = {0.8}
                                onValueChange = {onValueChangeHandler}
                            />
                        </View>
                </View>


                {/* Buttom buttons render */}
                <View style={{alignItems:'center', backgroundColor:'transparent', justifyContent:'flex-start', alignItems:'center', marginTop:-100}}>
                        <Pressable 
                            onPress={handleStop}
                            style={{flexDirection:'row', justifyContent:'space-evenly', alignItems:'center' , minWidth:104, minHeight:46, 
                            borderRadius:16, borderColor:'#494B6F', borderWidth:2, backgroundColor:'#494B6F', marginBottom:8, marginTop:32}}
                            >
                                <View>
                                    <IconJsRender IconJSImportedName={VuesaxBoldRecordCircle} size={16} iconColor='white'/>
                                </View>
                                <Text style={{fontSize:16, fontWeight:'bold', color:'#FFFFFF'}}>{t(tns+":"+"STOP")}</Text>
                        </Pressable>

                        <Pressable 
                                onPress={handleFavbuttonPress}
                                style = {[ styles.favoritePositionButton,
                                            (isFavoritePosition === true && favoritePosition !== null) ? 
                                                (levelEqualsFavPosition === true) ? styles.removeFavoritePosition : styles.goToFavoritePosition   
                                            : styles.addFovoritePosition   
                                    ]}
                            >
                            <View>
                                <IconJsRender 
                                    IconJSImportedName={VuesaxOutlineStar} 
                                    size={16} 
                                    iconColor = {isFavoritePosition === true ? (levelEqualsFavPosition===true) ? 'red' : 'green'
                                                                            : 'blue'}
                                    />
                            </View>
                            <Text 
                                style={{
                                    fontSize:16, fontWeight:'bold', 
                                    color:'#B5B7CF'
                                    }}
                                    >
                                        {
                                            isFavoritePosition ? 
                                                (levelEqualsFavPosition) ? t(tns+":"+"REMOVE_FAVORITE") : t(tns+":"+"FAVORITE")
                                            : t(tns+":"+"ADD_FAVORITE")}
                            </Text>
                        </Pressable>
                        {/* Ajout for set Fav server */}
                        <View style={{justifyContent:'center', alignItems:'center', flexDirection:'row', flex:1}}>
                        <Pressable onPress={send}>
                            <View style={{marginBottom:40, borderColor:'black', width:80, height:40, borderWidth:2, padding:3}}>
                                <Text>Set Fav</Text>
                            </View>
                        </Pressable>
                        <Pressable onPress={receive}>
                            <View style={{marginBottom:40, borderColor:'black', width:80, height:40, borderWidth:2, padding:3}}>
                                <Text>call Fav</Text>
                            </View>
                        </Pressable>
                        </View>
                </View>
            </SafeAreaView>


            {/* FOOTER */}
            <SafeAreaView style={{flex:1, backgroundColor:'#1D1E2C', marginTop:0}}>
                    <View style={{marginTop:24, marginLeft:21}}><Text style ={{color:'#B5B7CF', fontSize:14, fontWeight:'bold'}}>{t(tns+":"+"PROGRAMMING")}</Text></View>
                <View style={{marginTop:5, flexDirection:'row'}}>
                    <Text style={{fontSize:16, fontWeight:'bold', color:'#FFFFFF', marginLeft:21}}>{t(tns+":"+"OPEN")}</Text>
                    <Text style={{fontSize:16, color:'#FFFFFF', marginLeft:5}}>{t(tns+":"+"UNTIL")} 23:00</Text>
                    <Pressable 
                    style={{backgroundColor:'transparent', width:24, height:24, marginLeft:WIDTH-160, marginBottom:8}}
                    onPress={()=>console.log("Right Chevron clicked")}
                    >
                    <RightChevron color='white'/>
                    </Pressable>
                </View>
                <Pressable
                    onPress={()=> console.log('Hello chevron')}
                    style={{
                        borderBottomColor: 'white',
                        borderBottomWidth: 1,
                        marginTop:15,
                        width:WIDTH,
                        marginLeft:21
                    }}
                />
            </SafeAreaView>
            
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    favoritePositionButton:{
        //backgroundColor:'red', 
        flexDirection: 'row', 
        justifyContent:'space-evenly', 
        alignItems:'center' , 
        minWidth:172, 
        minHeight:46, 
        borderRadius:16, 
        borderColor:'#B5B7CF', 
        borderWidth:2, 
        marginBottom:49
    },
    goToFavoritePosition:{
        borderColor:'green',
    },
    removeFavoritePosition:{
        borderColor:'red',
    },
    addFovoritePosition:{
        borderColor:'blue'
    }
});


















