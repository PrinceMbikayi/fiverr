import React, { Component } from 'react';
import { connect } from "react-redux";
import { View,Text } from 'react-native';

import {withTranslation,i18next } from 'react-i18next';
import styled from 'styled-components/native';

import { withTheme } from '_theming/themeProvider';
import {ActionSwitch} from '_components/scenarios/actionSwitch'
import * as ScenarioHelpers from '_helpers/scenarios';
import * as level2Funcs from '_helpers/level2options';

class TypePlugActions extends Component {
  constructor(props) {
    
    super(props);

    let actionsSwitches = {
      "ONOFF":{actionNames: ['OFF','ON'],value:true,"label":"ON_OFF"}           
    }

    if(this.props.scenarioId != -1) {
      actionsSwitches = level2Funcs.initSwitches(this.props.scenarioId,actionsSwitches);
    }


    this.state = {
      actionsSwitches: {... actionsSwitches}
    };

  }

  async componentDidMount() {   
    if(this.props.callback) {
      this.props.callback(this.state.actionsSwitches);  
    }
  }


    // -------------------- callbacks -------------------------

        
    onSwitchToggle = async(switchId) => {    
       
      const res = await level2Funcs.onSwitchToggle(switchId,this);      
      this.props.callback(this.state.actionsSwitches);  
    }
    // -------------------------------------------------

  render() {
    const { t,theme } = this.props;
    return (
                <SwitchesWrapper borderColor={theme.divider_on_body}>
                    <>
                      <Text>voilà</Text>
                      <ActionSwitch actionText={t('scenarios:ON_OFF')+ " "} stateValue ={this.state.actionsSwitches.ONOFF.value} stateName="ONOFF" callback={this.onSwitchToggle}/>
                    </>
                </SwitchesWrapper>                   
        )
  }
}

export default withTranslation()(withTheme(connect(mapStateToProps)(TypePlugActions)));


function mapStateToProps(state){
    return {}
  };



const SwitchesWrapper = styled.View`
    border-color:${props => props.borderColor}; 
    border-top-width:1px;
    border-bottom-width:1px;
    padding-bottom:10px;
`;



