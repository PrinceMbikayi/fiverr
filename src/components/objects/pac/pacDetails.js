import React from 'react';
import {useContext,useState,useRef} from 'react'
import { ScrollView,View,Text,StyleSheet,TouchableHighlight} from 'react-native';
import { useStore,useSelector,useDispatch } from 'react-redux';
import styled from 'styled-components/native';
import { useTranslation } from 'react-i18next';
import { useNavigation,useRoute,StackActions } from '@react-navigation/native';

import Icon from 'react-native-vector-icons/MaterialIcons';
import {IconRoundButton} from '@components/ui/buttons/iconRoundButton';
import Carousel from 'react-native-snap-carousel';
import {SvgCss} from 'react-native-svg'
import {dataGetObject} from '_helpers/dataTools';
import * as ObjectHelpers from '_helpers/objects';
import { Assets} from '_helpers/assets';
import {airHomeIcons} from '_assets/icons/airhomeIcons';
import {updateStatus} from '_actions/objects'
import * as pacConfig from './pac_config';

// keep here if needed
//import { ScrollView } from 'r-eact-native-gesture-handler';

export const TypePacDetails = (props) => {
    const { t, i18n } = useTranslation();
    const { theme,itemId} = props;
  
    const navigation = useNavigation();
    const route = useRoute();
    const navigationParams = route?.params || {}; 
    
    const dispatch = useDispatch();

    const store = useStore();

    // not state of useState Hook
    const globalState = useSelector(state => state);
    const objectDatas = useSelector(state => dataGetObject(itemId,state));    
    const objStatuses = objectDatas.statusDictionary;

    console.log("objStatuses",objStatuses)

    // temperature
    const [initialIdx,setInitialIdx] = useState(4);
   
    const temperaturesItems = pacConfig.temperatures.reduce((r,v,i) => {

        r.push({
            label: v,
            value: i
         })
        
        return r
    },[]);


    const goBack = () => {
        console.log("ici")
        navigation.goBack();
    }

      const onSelect = (index) => {
          console.log(index)
      }

      const renderItemSmall  = ({item, index}) => {

      }

     const  _renderItem = ({item, index}) => {
        return (
            <RenderItemView>
                <RenderItemIconView>                    
                    <SvgCss xml={item.icon} width="100%" height="100%"  fill={modeIconColor}  viewBox="0 0 48 48" preserveAspectRatio="xMinYMin slice"/>                  
                </RenderItemIconView>
            </RenderItemView>
        );
    }

    const _renderTemperatureItem= ({item, index}) => {
        return (
            <RenderItemView style={{}}>
                <RenderTemperatureView>
                    <TemperatureText color={modeIconColor}>{item.label}</TemperatureText>
                </RenderTemperatureView>
            </RenderItemView>
        );
    }

    const TemperatureArrow = (props) => {
        const {iconName,way,callback,carousel} = props;
       
        const iconSize = 40
        return (
            <TouchableHighlight onPress={() => {if(callback)callback(way,carousel);}}
                                style={{borderRadius:iconSize,height:iconSize,width:iconSize}}
                                activeOpacity={0.6}
                                underlayColor="#DDDDDD"
            >
                 <Chevron name={props.iconName} size={iconSize} color={modeIconColor} style={{marginTop:0}}/>  
            </TouchableHighlight>            
        )
    }
    //chevron-left

    const PacHeader = () => {
        return (
            <>
            <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                <ObjectName>{objectDatas.name}</ObjectName>
            </View>
            <View style={{position:'absolute',right:0,top:10,height:50,width:50}}>
                    <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                    <TouchableHighlight
                        activeOpacity={0.6}
                        style={{height:50,width:50}}
                        underlayColor="#DDDDDD"
                        onPress={() => goBack()}>
                            <Icon name="close" size={30} color="#FFFFFF" style={{alignSelf:'center'}}/>
                       </TouchableHighlight>
                    </View>
                    
            </View> 
            
            </>
        )
    }



    // MODES && OPTIONS
    const setModeIconColor = (mode) => {
        _setModeIconColor(_getModeColor(mode))
    }

    const _getModeColor = (mode) => {     
        return (pacConfig.modeColors[mode] || pacConfig.modeColors.default)
    }
  
    const _carouselMode = useRef(null);
    const _carouselOptions = useRef(null);
    const _carouselTemperatures = useRef(null);

    const sliderWidth = 260;
    const itemWidth = 200;


    const getAirHomeIcon = (id) => {
        return airHomeIcons[id];
    }
    // PAC on / off

    const [power,setPower] = useState(true)

    console.log("objStatuses",objStatuses)
    //mode
    const initModeIndex = pacConfig.modes_entries.reduce(function(r,v,i){
            if(v.mode === objStatuses.mode){
                r = i;
            }
            return r
        },-1)
    
        console.log(pacConfig.modes_entries,objStatuses.mode,"-",initModeIndex,"-")

    const [modeIndex,setModeIndex] = useState(initModeIndex);
    //selectedMode
    const [selectedMode,setSelectedMode] = useState(objStatuses.mode)
    //show Temp
    const [showTemp,setShowTemp] = useState(true);
    //show Fans
    const [showFans,setShowFans] = useState(true);

    // configuration Button active status
    const [currentModeInfos,setCurrentModeInfos] = useState(pacConfig.modes_entries[initModeIndex])
    //configuration Items State ( on / off ) 
    const [configurationItemsStates,setConfigurationItemsStates] = useState({})
    
    const [currentTempIndex,setCurrrentTempIndex] = useState(12);

    const initColor = _getModeColor(pacConfig.modes_entries[initModeIndex].mode);
    console.log("intColor",initColor);
    const [modeIconColor,_setModeIconColor] = useState(initColor) 
    
    
    const onModeChange = (slideIndex) => {
        setModeIndex(slideIndex);
        setShowTemp(pacConfig.modes_entries[slideIndex].setTemp == true);       
        setShowFans(pacConfig.modes_entries[slideIndex].fanSpeed == true);
        setSelectedMode(pacConfig.modes_entries[slideIndex].mode);
        setCurrentModeInfos(pacConfig.modes_entries[slideIndex]);
        
        console.log("selectedMode",selectedMode)
        setModeIconColor(pacConfig.modes_entries[slideIndex].mode)
        tellStore(itemId,'mode',pacConfig.modes_entries[slideIndex].mode) ; 
    };

    const onChangeConfiguration = (command) => {
        console.log("onChangeConfiguration",command)
        const newVal = (configurationItemsStates[command] != true) ? true : false;
        let newState = {...configurationItemsStates};
        newState[command] = newVal;
        console.log("newState",newState)
        setConfigurationItemsStates(newState);
    }

    const onChangeTemperature = (way,carousel) => {
        // attention way c'est + / - 1 index par degré, ici le step est de 0.5
        console.log("TemperatureChange",way,carousel);
        if(way == "previous") {
            carousel.current.snapToPrev(true);
        } else {
            carousel.current.snapToNext(true);
        }
    }

    function tellStore(objectId,statusName,value){
        console.log(arguments)
        store.dispatch(updateStatus(objectId,statusName,value));
        
        //debouncedGreet(objectId)
      }



    const _modeCarouselWidth = 140;
    const _temperatureCarouselWidth = 160;
    const _optionsCarouselWidth = 60;

    const onPowerOff = () => {
        console.log('PowerOff')
        setPower(!power);

    }
    const onSchedule = () => {
        console.log('Schedule')
    }

    return (
        
            <>
            <PacHeaderView bgColor={modeIconColor}>
                <PacHeader/>
            </PacHeaderView>
            {power == true &&
                <View style={{  flex:1,flexDirection:'row',justifyContent:'space-between',
                                minHeight:50,padding:10,
                                backgroundColor:'white'}} >
                    <IconRoundButton iconName="schedule" iconSize={30} touchSize={50} iconColor={modeIconColor} callback={onSchedule}/>
                    <IconRoundButton iconName="power-settings-new" iconSize={30} touchSize={50} iconColor={modeIconColor} callback={onPowerOff}/>
                </View>
            }
            <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
            <View style={{backgroundColor:'white'}}>
            <ModesView bg={(selectedMode == 'heat') ? 'transparent':'transparent'}>
                <View style={{width:_modeCarouselWidth,height:_modeCarouselWidth}}>
                    <Carousel
                        ref={_carouselMode}
                        data={pacConfig.modes_entries}
                        firstItem={initModeIndex}
                        renderItem={_renderItem}
                        sliderWidth={_modeCarouselWidth}
                        itemWidth={_modeCarouselWidth}
                        loop
                        useScrollView={true}
                        onSnapToItem={onModeChange}
                    />  
                </View> 
            </ModesView>
           
            <FansView>               
                    <View style={[{width:_optionsCarouselWidth*3,height:_optionsCarouselWidth},
                                    (showFans == false) ? {height:1} : {}]}>
                        <Carousel
                            ref={_carouselOptions}
                            data={pacConfig.options_entries}
                            renderItem={_renderItem}
                            sliderWidth={_optionsCarouselWidth*3}
                            itemWidth={_optionsCarouselWidth}
                            loop
                            loopClonesPerSide={4} 
                            inactiveSlideScale={0.6}
                            inactiveSlideOpacity={0.3}                       
                        />  
                    </View>                                   
            </FansView>
            <View style={{height:80}}>
                <TemperaturesView bg={(selectedMode == 'heat') ? 'transparent':'transparent'} style={[(showTemp == false) ? {opacity:0} : {opacity:1}]}>
                    <TemperatureArrow   iconName="remove" 
                                        way="previous"
                                        callback={onChangeTemperature}
                                        carousel={_carouselTemperatures}
                    />
                    
                    <View style={[{width:_temperatureCarouselWidth,height:_temperatureCarouselWidth}]}>
                            <Carousel
                                ref={_carouselTemperatures}
                                data={temperaturesItems}
                                renderItem={_renderTemperatureItem}
                                sliderWidth={_temperatureCarouselWidth}
                                itemWidth={_temperatureCarouselWidth}
                                firstItem={currentTempIndex}                            
                                inactiveSlideScale={0.6}
                                inactiveSlideOpacity={0.3}                       
                            />  
                    </View> 
                    <TemperatureArrow   iconName="add" 
                                        way="next"
                                        callback={onChangeTemperature}
                                        carousel={_carouselTemperatures}
                    />
                </TemperaturesView>
            </View>
            </View>
            <ConfigurationView>
                <ConfigurationViewContent>
                    { pacConfig.configurationItemIds.map((itemId,index) => {
                        return <ConfigurationItem key={`item-${index}-${itemId}`}>
                                    <PacButton  disabled={!(currentModeInfos[itemId] == true)}
                                            id={itemId} 
                                            icon={getAirHomeIcon(itemId)}
                                            color={modeIconColor}
                                            inverseColor="white"
                                            disabledColor="#CCCCCC"
                                            callback={onChangeConfiguration}
                                            key={index.toString()}
                                            active={(configurationItemsStates[itemId] == true)}
                                        />
                                </ConfigurationItem>;                            
                        })
                    }
                    <ConfigurationItem>

                    </ConfigurationItem>
                                      
                </ConfigurationViewContent>
            </ConfigurationView>
            </ScrollView>
            
            {power == false &&
                <View style={{position:'absolute',top:120,paddingBottom:120,left:0,height:'100%',width:'100%',flex:1,backgroundColor:'white',alignItems:'center',justifyContent:'center'}}>
                    <IconRoundButton iconName="power-settings-new" iconSize={120} touchSize={120} iconColor={modeIconColor} callback={onPowerOff}/>
                </View>
            }
            </>
    )
}
//--------------------------------------------------
const PacButton = (props) => {

    const {buttonState,id,icon,disabled,active,color,inverseColor,disabledColor,callback} = props;
    const iconColor = (!disabled) ? color : "#ccc";
    const iconSize =  48;

    const onPressButton = () => {
        if (callback) {
            callback(id);
        }
    }

    const fillColor = (disabled) ? disabledColor : (active) ? inverseColor: iconColor;
    const bgColor = (disabled) ? "transparent" : (active) ? iconColor : "transparent";

     return (

         <>
            <TouchableHighlight disabled={disabled} activeOpacity={0.6}
                underlayColor="#DDDDDD" style={{borderRadius:iconSize}}
                onPress={onPressButton}                
                >
                <View style={{borderWidth:2,borderColor:fillColor,borderRadius:iconSize,backgroundColor:bgColor}}>
                    <View style={{width:iconSize,height:iconSize}}>
                        <SvgCss xml={icon} width="100%" height="100%"  fill={fillColor}  viewBox="0 0 48 48" preserveAspectRatio="xMinYMin slice"/>                  
                    </View>
                </View>
            </TouchableHighlight>
         </>
         
     )
}
//--------------------------------------------------

const PacHeaderView = styled.View`
    background-color:${props => props.bgColor}; 
    height:100px;
    min-height:100px;


`;
const ObjectName = styled.Text`
    color:white;
    font-size:20px;
    text-align:center;
    padding:20px;
    
`;

const CarouselWrapper = styled.View`
                            margin-top:0px;
                            flex:1;
                            align-items:center;
                            justify-content:center
                        `;


const ModesView = styled(CarouselWrapper)`
                  background-color:${props => props.bg}; 
                  border-color:transparent;
                    border-width:1;
                 
                `;

const TemperaturesView = styled(CarouselWrapper)`
    background-color:${props => props.bg}; 
    height:100px;
    flex:1;
    flex-direction:row;
    border-color:transparent;
    border-width:1;
    
`;
const TemperatureText = styled.Text`
                    color:${props => props.color}; 
                    font-size:40px;
                    font-weight:bold;
                    `;

const Chevron = styled(Icon)`
  
    
`;

const FansView = styled(CarouselWrapper)`
                    height:100px;
                    `;

const ConfigurationView = styled.View`
       flex:1;
       width:100%
    `;

const ConfigurationViewContent = styled.View`
        flex:1;
        width:100%;
        flex-direction:row;
        flex-wrap: wrap;
        align-items: flex-start;
        justify-content: space-evenly;
       `;
const ConfigurationItem = styled.View`
        width:25%;
       
        min-height:80px;
        margin-bottom:20px;
        align-items: center;
        justify-content: center;
       `; 


const RenderItemView = styled.View`
                border-radius: 5px;
                height:90%; 
                width:90%;               
                margin: 5%
    `;
  

const RenderItemIconView = styled.View`
            flex:1;
            align-items:center;
            justify-content:center;
            height:90%;
            width:90%;
            margin:5%;
`;
const RenderTemperatureView = styled(RenderItemIconView)`
                    height:100px;
    `;
  
  



const styles = StyleSheet.create({
    carouselWrapper:{
        marginTop:0,
        flex:1,
        alignItems:'center',
        justifyContent:"center"
    },
    temperaturesWrapper:{
        height:80,
       
    },
    fansWrapper:{
        height:100
    }, 
    configuration:{

    },
    time: {
      
      fontSize:20,
      opacity:0.4
    },
    selectedTime : {
        
        fontSize:32,
        fontWeight:'bold',
        position:'relative',
        opacity:1
    },
    scrollPickerContainer : {
       
        
    }
    ,
    item : {
       
        height:80
    },
    selector : {
       
    }
    
  });