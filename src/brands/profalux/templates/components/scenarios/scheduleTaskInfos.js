import React, { Component } from 'react';
import {withTranslation,i18next } from 'react-i18next';
import { View, Text ,Switch} from 'react-native';
import { ButtonWithStyle as Button } from '_components/ui/buttons/buttonWithStyle';
import { withTheme } from '_theming/themeProvider';
import styled from 'styled-components/native';
import { DividerText} from '_components/ui/divider-with-text';
import {WeekDays} from '_components/dates/weekDays'

class ScheduleTaskInfos extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activated:false,
      update:0
    };
  }

  /* use it like this 
<ScheduleTaskInfos  title={t("scenarios:WAKE_UP")} 
                                    taskId='Default'
                                    taskTime={specialsSchedularTasks.Default.taskTime}
                                    days={specialsSchedularTasks.Default.taskDays}
                                    buttonTitle="Modify"
                                    callback={move}

  */

 switchToggle = (value) => {
  
  const newValue = !this.state.activated;
  this.setState({activated:newValue});
  const x = this.props.activationToggleAction(this.props.taskId,newValue)
 
}

componentDidMount() {
  
  const _isActivated = (this.props.description == undefined) ? false : this.props.activated;
  this.setState({'activated':_isActivated})
}

componentDidUpdate(prevProps, prevState) {
  const newVal = this.state.update
 
}



showTime = () => {
  const {description,t,taskTime,theme} = this.props;

  const textColor = theme["schedule_widget_text_color"] || "#777";
  
  if(description && description["offset"]) {
        const eventText = t("scenarios:"+description.event.toUpperCase());
        const offsetNumber = Number(description.offset)
        const absOffset = Math.abs(offsetNumber);
        const hours = Math.floor(absOffset / 60.0);
        const mins = absOffset % 60.0;
        const offsetText = ((offsetNumber < 0 ) ? "-" : "+")+" "+( (hours > 0) ? hours + " h " : "")+mins+" min";
        return (
          <>
          <TimeText style={{fontSize:14}} color = {textColor}>{eventText}</TimeText>
          <TimeText style={{fontSize:18}} color = {textColor} >{offsetText}</TimeText>
          </>
        )
  } else {
    return (
      <TimeText style color={textColor}>{taskTime.slice(0, -3)}</TimeText>
    )
    
  }
  
}

getdays = () => {
  const {description,days,t,taskTime} = this.props;

  const retVal = (description && description["event"])?description.days.split(",") : days;
  console.log("retVal",retVal)

  return retVal;



}


dividerColor = "#999999"

  render() {
    const { t,theme } = this.props;
    const lineColor = theme.divider_on_body;
    const bgColor = theme['schedule_widget_background_color'] || "white"
    return (
      <View style={{padding:10}}>
        <DividerText label={this.props.title} color={this.dividerColor} lineColor="#CCCCCC" />
       
        <View style={{flex:1,flexDirection:'row',marginTop:10}}>
              <View style={{minWidth:80,width:80}}>
                  <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                      <View style={{height:70,width:70,backgroundColor:bgColor,justifyContent:'center',alignItems:'center',borderRadius:35}}>
                        <Switch
                                  trackColor={{ false: 'green' || theme.dark_body_darker, true: theme.primary }}
                                  thumbColor={this.state.isActive ? theme.onPrimary : "#CCC"}
                                  ios_backgroundColor={theme.dark_body_darker}                                  
                                  onChange={this.switchToggle}
                                  value={this.state.activated}
                          />
                      </View>                 
                  </View>
              </View>

              <View style={{flex:1,flexDirection:'column'}}>
                  <View style={{backgroundColor:bgColor,paddingBottom:10}}>
                      <View style={{marginBottom:10}}>
                          {
                            this.showTime()
                          }
                          
                      </View>
                      <View style={{height:60,flex:1,padding:10,backgroudColor:'red'}}>
                          <WeekDays editable={false} days={this.props.days} invertedColors />
                      </View>
                  </View>
                  
              </View>                        
        </View>

        <View style={{flex:1,flexDirection:'row',marginTop:5}}>
              <View style={{minWidth:80,width:80}}>
              </View>                   
              <View style={{flex:1,flexDirection:'row',justifyContent:'center'}}>
                  <Button   type="clear" title={t("scenarios:MODIFY")} onPress={() => {this.props.callback(this.props.taskId,this.props.associatedAction)}}
                                  titleStyle={{textDecorationLine: 'underline',color: this.dividerColor,fontSize:12}}>
                  </Button> 
              </View>
        </View> 
    </View> 
    );
  }
}

export default withTranslation()(withTheme(ScheduleTaskInfos));

const TimeText = styled.Text`
       
        font-size:32px; 
        color:${props => props.color || "#777" };
        text-align:center;
        margin-top:14px;
        margin-bottom:-12px;      
    `;