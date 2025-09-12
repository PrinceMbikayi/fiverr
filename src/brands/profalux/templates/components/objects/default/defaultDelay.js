import React, { Component } from 'react';
import { connect } from "react-redux";
import { View,SafeAreaView,Pressable,Alert } from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';
import { ButtonWithStyle as Button } from '_components/ui/buttons/buttonWithStyle';
import {withTranslation,i18next } from 'react-i18next';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { withTheme } from '_theming/themeProvider';
import * as level2Funcs from '_helpers/level2options';
import {DelayPicker} from '_brand/templates/components/ui/pickers/delayPicker';

class TypeDefaultDelay extends Component {
  constructor(props) {
    
    super(props);

    console.log("XXXXXXXXXXXX TypeDefaultDelay",props)

    let {itemId,taskName,taskObject,initTime,template,title} = props.navigationParams;
    
    let cleanTime = initTime+"";
    if(cleanTime.charAt(0) == "+") {
        cleanTime = cleanTime.substring(1);       
        const rebuildTime = ['h','m','s'].reduce(function(r,v,i){
            const splitted = cleanTime.split(v);
            if(splitted.length == 1 ) {
                r.push(0)
            } else {
                r.push(splitted[0]);
                cleanTime = splitted[1]
            }
            return r;
        },[]).join(":")
        cleanTime = rebuildTime
    }
    

    this.state = {
       
        timeSelection:{},
        initialTime:cleanTime,
        isOnOff:false,       
        objectId:props.itemId,
       
        isMounted:true,
        taskName:taskName,
        taskObject:taskObject,
        notification:{active:false},
        actionsSwitches:{
            
        },
        actions:{},
        headerTitle:title,
        delayDuration:'+20m',
        launchButtonActive:true
    };

  }

    async componentDidMount() {
    
        this.setState({'isOnOff':true}) // should be defined by object actions availabilities
        this.setState({isMounted:true})
    }
    toggleSwitch = (e) => {       
        this.setState({isEnabled:e})
    }

    cancel = () => {
        this.props.navigation.goBack();
    }

    validate = async() => {
       
        const {objectId,taskName} = this.state
        const timeSelection = {time: this.state.delayDuration};
        console.log("Validate Delay")
        this.setState({'launchButtonActive':false});
       
        // build actions array
        const switches = this.state.actionsSwitches;

        let scriptActions = [];
        if(switches) {
            scriptActions = Object.keys(switches).reduce(function(r,v,i) {
                const obj = switches[v];               
                r.push({'type':'call','objectId':objectId.toString(),'action':obj.actionNames[Number(obj.value)],'mArgs':[],'oArgs':[]});
                return r;
            },[])
        }
        const actions = this.state.actions;
        let hasColor = false
        if(actions) {
           // console.log(actions);
            nonSwitchActions = Object.keys(actions).reduce(function(r,v,i) {
                //console.log("v",v,actions);  
                if(v == "COLOR")hasColor = true            
                r.push({'type':'call','objectId':objectId.toString(),'action':v,'mArgs':actions[v].mArgs,'oArgs':[]});
                return r;
            },[])
        }

        if(hasColor && 1 == 2) {
            scriptActions = scriptActions.reduce((r,v,i) => {
                    if(v.action != "ON")r.push(v)
                    return r;
            },[])
        }


        scriptActions = [...scriptActions,...nonSwitchActions];


        if(this.state.notification.active) {
            scriptActions.push({'type':'notify','severity':'WARNING','title':this.state.notification.title,'text':'il y a un serpent dans ma botte'})
        }
       
        const days = [0,0,0,0,0,0,0];        
        // then save       
        const res = await level2Funcs.saveOptions(objectId,taskName,timeSelection,days,scriptActions)
        this.setState({'launchButtonActive':true});
       
        if(res.status == 'error') {
            this.taskCreationErrorAlert();
        }
    }

    taskCreationErrorAlert = () => {
        Alert.alert(
            this.props.t('scenarios:SCHEDULE_TASK_CREATION_FAILED'),
            this.props.t('scenarios:SCHEDULE_TASK_CREATION_FAILED_DESCRIPTION'),
            [                  
              { text: 'OK', onPress: () => console.log('OK Pressed') }
            ],                
          );
    }

    // -------------------- callbacks -------------------------
    timeSelectionCallbackWrong = (data) => {
        //console.log("timeSelectionCallback",data)
        this.setState({timeSelection:data},(()=>{console.log(this.state)}))
    }


    timeSelectionCallback = (val) => {
        //console.log('In PARENT',val)
        const splitted = val.split(":");
        const duration =  "+"+((parseInt(splitted[0]) > 0) ?  splitted[0]+"h" : "") +
                          ((parseInt(splitted[1]) > 0) ?  splitted[1]+"m" : "") +
                          ((parseInt(splitted[2]) > 0) ?  splitted[2]+"s" : "");
  
        //console.log("duration",duration)                 
        this.setState({delayDuration:duration});
    };

    onScheduleTaskPickerChange = (data) => {       
        this.setState({timeSelection:data})
    }
    onDaysCallbackChange = (newDays) => {        
          this.setState({'days':level2Funcs.onDaysCallbackChange(newDays)})
    }
    onNotifyChange = (values) => {      
        this.setState({notification:values})
    }    
    onSwitchToggle = (switchId) => {         
       level2Funcs.onSwitchToggle(switchId,this);
    }

   onActionsCallback = (datas) => {
       /*
       console.log("onActionsCallback",datas);
       const newActionsSwitches = {...this.state.actionsSwitches,...datas}
       this.setState({'actionsSwitches':newActionsSwitches})
        */
       console.log("onActionsCallback de defaultDelay",datas)
       switch(datas.type) {
           case 'action' :
            let cActions = {...this.state.actions};
            const actionName = datas.content.actionName;
            cActions[actionName]= datas.content
            this.setState({'actions':{...cActions}});  
            break;
            
        default :
            // no type so switches
            const newActionsSwitches = {...this.state.actionsSwitches,...datas}
            this.setState({'actionsSwitches':newActionsSwitches})
       }
       console.log("onActionsCallback",datas);
      







   }

   //----------------------------------------------------
    goBack = () => {       
        this.props.navigation.goBack();
    }

    // -------------------------------------------------

    onPressIn = () => {

    }

    onPressOut = () => {

    }




    

  render() {
    const { t,theme } = this.props;
    
    const _backgroundColor = theme["details_body_color"] || theme["card--color--bodybg"];
    const textColor = theme["schedule_widget_text_color"] || "#777";


    return (
        <SafeAreaView style={{flex:1,backgroundColor:_backgroundColor}}>
            <StyledHeaderView>
                <H1>{this.state.headerTitle}</H1>
                <View style={{position:'absolute',right:0,height:'100%',width:50}}>
                    <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                        <Pressable
                            onPressIn={this.onPressIn} onPressOut={this.onPressOut}
                            onPress={() => this.goBack()}>
                            <Icon name="close" size={30} color="#000000" style={{alignSelf:'center'}}/>
                       </Pressable>
                    </View>                    
                </View>               
            </StyledHeaderView> 
            <KeyboardAwareScrollView alwaysBounceVertical={false}>
                <View style={{minHeight:200,borderColor:"#777",borderWidth:1}}>
                    <DelayPicker initTime={this.state.initialTime}  hideLabels updateCallback={this.timeSelectionCallback}/>
                </View>              
                <View style={{padding:15}}>                  
                    {
                        // coming from TypeDynamicSchedule
                        this.props.renderActions({itemId:this.state.objectId,callback:this.onActionsCallback})
                    }              
                    <View style={{flex:1,flexDirection:'row',maxWidth:400, alignSelf:'center',marginTop:30}}>
                        <View style={{flex:1}}>
                                <Button title={t("CANCEL")} onPress={this.cancel} buttonStyle={{backgroundColor:theme.primary}} titleStyle={{color:theme.onPrimary,textTransform:"uppercase"}}></Button>
                        </View>
                        <View style={{width:15}}></View>
                        <View style={{flex:1}}>
                                <Button    disabled={!this.state.launchButtonActive} title={t("scenarios:START_DELAY")} onPress={this.validate} buttonStyle={{backgroundColor:theme.primary}} titleStyle={{color:theme.onPrimary,textTransform:"uppercase"}}></Button>
                        </View>                    
                    </View>
                </View>            
            </KeyboardAwareScrollView>           
        </SafeAreaView>
        )
  }
}

export default withTranslation()(withTheme(connect(mapStateToProps)(TypeDefaultDelay)));


function mapStateToProps(state){
    return {}
  };



const StyledHeaderView = styled.View`
        background-color:white;
        max-height:50px;
        min-height:50px;
        align-items: center;
        justify-content: center;
        flex:1;
        `;

const H1 = styled.Text`
    background-color:white;
    font-size:16px;
    font-weight:bold;
    `;



