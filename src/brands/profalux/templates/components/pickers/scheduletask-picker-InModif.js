// import React, {useState, useEffect, useRef, Component } from 'react';
// import { View, Text ,StyleSheet,TouchableOpacity, Pressable} from 'react-native';

// import { withTheme } from '_theming/themeProvider';
// import { connect } from "react-redux";
// import RNPickerSelect from 'react-native-picker-select';
// import styled, { useTheme } from 'styled-components/native';
// import {SvgCss} from 'react-native-svg';
// import {withTranslation,i18next } from 'react-i18next';


// import * as ObjectHelpers from '_helpers/objects';
// import * as ScenarioHelpers from '_helpers/scenarios';
// import {DelayPicker} from '_brand/templates/components/ui/pickers/delayPicker';
// import {SunPicker} from '_brand/templates/components/ui/pickers/sunPicker';
// import { appIcons } from '_assets/icons/appIcons';


// //-------------------------------------------------------------
// const _rawDatas= [
//     {'label':'4/h-','value':(-4*60)},
//     {'label':'3/h-','value':(-3*60)},
//     {'label':'2/h-','value':(-90)},
//     {'label':'60/mn-','value':(-1*60)},
//     {'label':'45/mn-','value':(-1*45)},
//     {'label':'30/mn-','value':(-1*30)},
//     {'label':'15/mn-','value':(-1*15)},
//     {'label':'10/mn-','value':(-1*10)},
//     {'label':'5/mn-','value':(-1*5)},
//     {'label':'0','value':(-1*0)},
//     {'label':'5/mn+','value':(1*5)},
//     {'label':'10/mn+','value':(1*10)},
//     {'label':'15/mn+','value':(1*15)},
//     {'label':'30/mn+','value':(1*30)},     
//     {'label':'45/mn+','value':(1*45)},
//     {'label':'60/mn+','value':(1*60)},
//     {'label':'2/h+','value':(2*60)},
//     {'label':'3/h+','value':(3*60)},
//     {'label':'4/h+','value':(4*60)},
//   ];

  

// const TabButtonComponent = (props) => {
   
//     const {iconColor} = props;
//     return (

//         <Pressable 
//             onPress={()=>{props.callback(props.index)}}
//             style={{    
//             backgroundColor: props.selected ? 'white' : 'transparent',
//             flex:1, padding:8,borderRadius:10, width:'90%', justifyContent:'center', alignItems:'center', flexDirection:'row',
//         }}>
//         <Text style={{color:props.textColor}}>{props.label}</Text>
//     </Pressable>
//     )      
// }

// const tabButtonComponentStyle = {
//     flex:1,
//     width:"100%",
//     borderRightWidth:1,
//     borderBottomWidth:1,
//     alignItems:'center',
//     justifyContent:'center'
// }


// //-------- COMPONENT REALLY START HERE

// const  ScheduleTaskPicker = (props)=> {

//     const {itemId, taskObject, initTime='13:00:00', initDays} = props;

//     const my_ref = useRef();
//     const inputRefs = {
//         location:null
//     };

//    const [currentTabIndex, setCurrentTabIndex] = useState(0);
//    const [currentSelections, setCurrentSelections] = useState({'regularTime':initTime,'sunrise':9,'sunset':9});
//    const [selectionChanged, setSelectionChanged] = useState(false);
//    const [pickerSelections, setPickerSelections] = useState([]);
//    const [initialTime, setInitialTime] = useState(initTime);
//    const [days, setDays] = useState(initDays);
//    const [isOnOff, setIsOnOff] = useState(false);
//    const [scenarios, setScenarios] = useState({});
//    const [objectId, setObjectId] = useState(itemId);
//    const [isEnabled, setIsEnabled] = useState(true);
//    const [taskName, setTaskName] = useState(props.taskName);
//    const [active, setActive] = useState('hour');
   

//     useEffect(()=> {
    
//     },[]);

//     const tabsPickerIds = ["regularTime",'sunrise','sunset'];

//     const getCurrentPickerId = () => {
//             return this.tabsPickerIds[this.state.currentTabIndex]
//         }


//     const getDescription = (tObj) => {
//         if(tObj == undefined)return {};

//         let taskDescription =  tObj.description ||  tObj?.statusDictionary?.__json_description;
//         if(typeof taskDescription == 'string')taskDescription = JSON.parse(taskDescription);
//         return taskDescription;
//     }

//     const onSelectTab = async(index) => {
//             this.setState({currentTabIndex:index},() => {
//             //console.log("onSelectTab",index,this.state,this.getCurrentPickerId())
//             this.tellParent(this.getCurrentPickerId());
//         })
        
        
//     }
    

//     const pickerMap = (selectionKey) =>    {

//         let pickerDatas = {labels:[]};
//         _rawDatas.map((item,index) => {
//             let labelDatas = item.label.split('/');
//             pickerDatas.labels.push(labelDatas[0]+' '+this.props.t('scenarios:'+labelDatas[1]));
//             if(labelDatas[0] == 0) {        
//                 pickerDatas.labels[index] = this.props.t('scenarios:'+selectionKey);
//             }
//             return {'label':labelDatas[0]+' '+this.props.t('scenarios:'+labelDatas[1]) ,'value':item.value}
//         });

//         //console.log("pickerDatas",pickerDatas)
//         return pickerDatas
//     } 

//     useEffect(()=> {
//         const {taskObject,weathersList} = this.props;
//         const description = this.getDescription(taskObject);
//         if(weathersList.length > 0 && (description?.schedulerId)) {
//             const foundIndex = weathersList.findIndex(element => element.value == description?.schedulerId);            
//             if(foundIndex) {
//                 const foundLocation = weathersList[foundIndex];               
//                 this.setState({'location':foundLocation.value})
//             }
//         }       
//         if(description?.event) {
//             this.onSelectTab(this.tabsPickerIds.indexOf(description?.event));             
//         }     
//     },[]);


//         const pickersDatas = {
//             'sunrise' : pickerMap("SUNRISE"),
//             'sunset' : pickerMap("SUNSET")
        
//         }

//         const getPickerDatas =(id) => {

//             if(pickerDatas == undefined){
//                 pickersDatas = {
//                     'sunrise' : pickerMap("SUNRISE"),
//                     'sunset' : pickerMap("SUNSET")                
//                 }
//             }

//             return pickersDatas[id]
//         }

//         // sunrise and sunset callback
//         pickerSelectionCallback = (index,pickerId) => {
           
//          //  console.log("check here ::: pickerSelectionCallback ",index,pickerId,this.state.currentTabIndex)
//            if(this.state.currentTabIndex == 0 && pickerId != "regularTime")return true;
//             let newSelections = {...this.state.currentSelections}          
//             newSelections[pickerId] = index           
//             this.setState({'currentSelections':{...newSelections}},() => { this.tellParent(pickerId)});
//         }
    
//         timeSelectionCallback = (value,pickerId) => {           
//             let newSelections = {...this.state.currentSelections}
//             newSelections[pickerId] = value;           
//             this.setState({'currentSelections':newSelections},() => { this.tellParent(pickerId)});             
//         }

//     onLocationChange = (value) => {
//             this.setState({
//             location: value,
//         },() => this.tellParent(this.getCurrentPickerId()));
//     }

//     //-------------
   
//     tellParent = (pickerId) => {

//         const datasToParent = this.formatSendbackDatas(pickerId);
//         /*
//         console.log("-------- tellParent "+pickerId+" -------------");
//         console.log(this.state.currentSelections)
//         console.log('data to parent = ',datasToParent)
//         console.log("-------- /tellParent -------------");
//         */
//         if(this.props.callback) {
//             if(pickerId == this.getCurrentPickerId() ) {
//                 this.props.callback(datasToParent,pickerId,this.getCurrentPickerId())
//             }            
//         }        
//     }

//     formatSendbackDatas = (pickerId) => {    
        
//         // Harold Modif:  Get the user weather to attach to the picker
//         const weathers = ObjectHelpers.getWeatherObjects(); 
//         let userWeather ;  
//         if(weathers.length !=0) {
//             userWeather = weathers[weathers.length -1]
//             console.log("PICKER_SELECTED_DATA_WEATHER:", userWeather)
//         }
        
//         switch(pickerId) {
//             case 'regularTime' :
//             case 'otherTime':
//                return this.formatTime(pickerId)
//                break;
//             case 'sunrise':
//             case 'sunset':
//                 const event = pickerId;
//                 console.log("formatSendbackDatas",pickerId,this.state.currentSelections);
//                 const offset = _rawDatas[this.state.currentSelections[pickerId]].value;
//                 //return  {'event':event,'offset':offset,'weatherId':this.state.location}

//                 //Harold Modif patch id meteo
//                 return  {'event':event,'offset':offset,'weatherId':userWeather.id}

//         }
//         return -1
//     }

//     formatTime = (pickerId) => {
//         const currentTimeAsArray = this.state.currentSelections[pickerId].split(":");
//         const retTime = currentTimeAsArray.reduce(function(r,v,i){
//                                 v = parseInt(v)
//                                 r+= ((v < 10)? "0":"")+v+':';
//                                 return r
//                             },"").slice(0, -1);

//         return {time:retTime}
//     }


//     onPressHour = ()=>{
//         console.log("Hello Day range")
//         this.setState({'active':'hour'})
//     }
//     onPressSunrise = ()=>{
//         console.log("Hello ")
//         this.setState({'active':'sunrise'})
//     }
//     onPressSunset = ()=>{
//         console.log("Hello Sun set")
//         this.setState({'active':'sunset'})
//     }

//     //ANCHOR Render
//   render() {
//       const {theme,t} = this.props
//       const textColor = theme["schedule_widget_text_color"] || theme["screen--color--text"];
//     return (
//         <>
//         <View>
//             <View style={{flex:1,flexDirection:'column', paddingHorizontal:10}}>

//                 <View style={{flex:1,flexDirection:'row', backgroundColor:'#d6d6d6', justifyContent:'space-around', alignItems:'center', marginTop:20, borderRadius:10,padding:2}}>
//                     <TabButtonComponent callback={this.onSelectTab} index={0} selected ={(this.state.currentTabIndex == 0)} label = "Heure" textColor={textColor}/>
//                     <View style={{borderRightWidth:0.8, height:'50%', borderColor:textColor, marginHorizontal:3}}></View>
//                     <TabButtonComponent callback={this.onSelectTab} index={1} selected ={(this.state.currentTabIndex == 1)} label = "Aube" textColor={textColor}/>
//                     <View style={{borderRightWidth:0.8, height:'50%', borderColor:textColor, marginHorizontal:3}}></View>
//                     <TabButtonComponent callback={this.onSelectTab} index={2} selected ={(this.state.currentTabIndex == 2)} label = "Crépuscule" textColor={textColor}/>
    
//                 </View>
//                     {this.state.isMounted &&
//                     <View id = "tabContents" style={{flex:2,height:200}}>
//                         <View  style={[{height:"100%", backgroundColor:'white'}, this.state.currentTabIndex != 0 ? styles.hidden :{}]}>
//                             <View style={{}}>
//                                 <DelayPicker initTime={this.state.initialTime} pickerId="regularTime" hideSeconds  updateCallback={this.timeSelectionCallback} />
//                             </View>                        
//                         </View>
//                         <View  style={[{height:"100%"}, this.state.currentTabIndex != 1 ? styles.hidden :{}]}>
//                             <SunPicker pickerDatas={this.pickersDatas['sunrise']} pickerId="sunrise" initialPosition={9} callback={this.pickerSelectionCallback}/>
//                         </View>
//                         <View  style={[{height:"100%"}, this.state.currentTabIndex != 2 ? styles.hidden :{}]}>
//                             <SunPicker pickerDatas={this.pickersDatas['sunset']} pickerId="sunset" initialPosition={9} callback={this.pickerSelectionCallback}/>
//                         </View>
//                     </View>
//                     }
//             </View>           
//        </View>
//        <View style={{flex:1,flexDirection:'row',height:40}}>
//           {this.state.currentTabIndex > 0 && 
//            <>
//             <View style={{minWidth:80,alignItems:'center',justifyContent:'center'}}>
//                     <SvgCss xml={appIcons["mapLocation"]} width="24" height="24" fill={textColor}/>
//             </View>           
//             <View style={{minWidth:240,alignItems:'center',justifyContent:'center'}}>
//                 <RNPickerSelect placeholder={{
//                                     label: t("scenarios:SELECT_WEATHER"),
//                                     value: null,  
                                                            
//                                 }}                                
//                                 value={this.state.location}                                
//                                 items={this.props.weathersList}                                
//                                 style={{    inputAndroid: {...pickerSelectStyles.inputAndroid,color:textColor},
//                                             inputIOS:{...pickerSelectStyles.inputIOS,color:textColor}}}                                                                    
//                                 onValueChange={this.onLocationChange}                            
//                                 ref={el => {
//                                     this.inputRefs.location = el;
//                                 }}
//                                 textInputProps={{"color":textColor}}                                    
//                     />
//             </View>
//             </>
//           }
//         </View>       
//         {this.props.children}
//        </>
//     );
//   }
// }

// export default withTranslation()(withTheme(connect(mapStateToProps)(ScheduleTaskPicker)))


// function mapStateToProps(state){
   
//     let locations = [];
//     const weathers = ObjectHelpers.getWeatherObjects();   
//     if(weathers) {
//         locations = weathers.reduce(function(r,v,i){
//             r.push({'label':v.name,'value':v.id})
//             return r
//         },[])
//     }
    
//     console.log("CHECK_WEATHER_LIST :", locations)
//     return {
//         'weathersList':locations
//     }
//   };



// const TabButton = styled.View`
   
// `;

// const styles = StyleSheet.create({
//     hidden: {
//         width:0,
//         height:0,
//         borderWidth:0,
//         borderColor:'red'
//     }
// });
// const pickerSelectStyles = StyleSheet.create({
//     inputIOS: {
//       fontSize: 16,
//       paddingVertical: 10,
//       paddingHorizontal: 10,      
//       paddingRight: 30, // to ensure the text is never behind the icon
//       marginTop:    0,
//       width:'100%',
//       color:'red'
//     },
//     inputAndroid: {
//       fontSize: 16,
//       paddingHorizontal: 10,
//       paddingVertical: 8,
//       borderWidth: 0.5,
//       borderColor: 'purple',
//       borderRadius: 8,
//       color: 'green',
//       paddingRight: 30, // to ensure the text is never behind the icon
//     },
//   });