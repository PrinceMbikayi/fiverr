import React, { Component } from 'react';
import { View, Text,Switch } from 'react-native';
import * as ObjectHelpers from '_helpers/objects';
import {withTranslation,i18next } from 'react-i18next';
import { useTheme} from '_theming/themeProvider';
import styled from 'styled-components/native';

import FormInput from '_components/forms/formInput';

class ScenarioNotify extends Component {
  constructor(props) {
    super(props);
    const scenario = ObjectHelpers.getObjectById(props.scenarioId)
    let notification = {active:false,title:'',text:'',severity:'WARNING'}
    if(scenario) {
        if(scenario.scriptActions) {
            notification = scenario.scriptActions.find(function(v,i){
                return v.type == 'notify'
            })
            notification = {active:true, ...notification}
        }
        
    }
    console.log("notification",notification)
    this.state = {
        notificationTitle:notification.title,
        notificationText:notification.text,
        isEnabled:notification.active
    };
  }

 //----------------------------------------
    onNotificationChange = (switchVal) => {
        this.setState({isEnabled:switchVal},this.onTellParent)
    }

    onInputTitleChangeHandler = (title) => {
        console.log("title",title)
        this.setState({notificationTitle:title},this.onTellParent)
    }

  onInputTextChangeHandler = (text) => {
    this.setState({notificationText:text},this.onTellParent)
  }

  onTellParent = () => {
      const notifObject = {active:this.state.isEnabled,title:this.state.notificationTitle,text:this.state.notificationText};
      console.log("notifObject",notifObject)
      if(this.props.callback) {
          this.props.callback(notifObject)
      }
      return 
  }

  render() {
    const { t } = this.props;
    return (
      <View>
        <View>
            <Switch trackColor={{ false: "#767577", true: "#81b0ff" }} thumbColor={this.state.isEnabled ? "#f5dd4b" : "#f4f3f4"}
                                ios_backgroundColor="#3e3e3e" onValueChange={this.onNotificationChange} value={this.state.isEnabled} /> 
            <Text>{t('scenarios:NOTIFICATION')}</Text>   
        </View>
        <StyledFormInput placeholder={t('scenarios:NOTIFICATION_TITLE')} value={this.state.notificationTitle} onChangeText={this.onInputTitleChangeHandler} />
        <StyledFormInput placeholder={t('scenarios:NOTIFICATION_TEXT')} value={this.state.notificationText} onChangeText={this.onInputTextChangeHandler} />
      </View>
    );
  }
}

export default withTranslation()(ScenarioNotify)

/**************  STYLED  ************************/
const StyledFormInput = styled(FormInput)`
    color:${props => props.color || "black" };
             
`;