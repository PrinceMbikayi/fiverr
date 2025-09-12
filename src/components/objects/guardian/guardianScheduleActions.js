import React, { Component } from 'react';
import { connect } from "react-redux";


import {withTranslation,i18next } from 'react-i18next';
import styled from 'styled-components/native';

import { withTheme } from '_theming/themeProvider';
import {ActionSwitch} from '_components/scenarios/actionSwitch';
import * as level2Funcs from '_helpers/level2options';



class TypeAtHomeModuleGateActions extends Component {
  constructor(props) {    
    super(props);
  
   let actionsSwitches = {
    "S1OPEN":{actionNames: ['OPEN S1','OPEN S1'],value:true,"label":"OPEN_GATE_FULL"},
   
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
       console.log("onSwitchToggle",this.state,this.props.callback)  
       this.props.callback(this.state.actionsSwitches);  
    }
    // -------------------------------------------------

  render() {
    const { t,theme } = this.props;
    return (
                <SwitchesWrapper borderColor={theme.divider_on_body}>
                  <ActionSwitch actionText={t('scenarios:OPEN_GATE_FULL')} stateValue ={this.state.actionsSwitches.S1OPEN.value} stateName="S1OPEN" callback={this.onSwitchToggle} hideToggle/>
                </SwitchesWrapper>                   
        )
  }
}

export default withTranslation()(withTheme(connect(mapStateToProps)(TypeAtHomeModuleGateActions)));


function mapStateToProps(state){
    return {}
  };

// -------- styles and styled ------------------------
const SwitchesWrapper = styled.View`
    border-color:${props => props.borderColor}; 
    border-top-width:1px;
    border-bottom-width:1px;
    padding-bottom:10px;
`;
