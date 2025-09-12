import React, { Component } from 'react';
import { connect } from "react-redux";
import {Text} from 'react-native';

import {withTranslation,i18next } from 'react-i18next';
import styled from 'styled-components/native';

import { withTheme } from '_theming/themeProvider';


import * as ScenarioHelpers from '_helpers/scenarios';

import * as level2Funcs from '_helpers/level2options';



class TypeAtHomeModuleShutterActions extends Component {
  constructor(props) {
    
    super(props);


  }

  init  = () => {
      //console.group("Shutter init",this.props)
      if(this.props.callback) {
          this.props.callback({type:'action',content:{actionName:this.props.associatedAction}});
      }
  }



  async componentDidMount() {   
    if(this.props.callback) {
        this.init();
    }
  }

    // -------------------- callbacks -------------------------

   
    // -------------------------------------------------

  render() {
    const { t,theme,associatedAction } = this.props;
    const associatedActionText = 'scenarios:'+associatedAction+'_SHUTTER';

    return (
                <SwitchesWrapper borderColor={theme.divider_on_body}>
                    <>
                        <ActionInfoText color={theme.onBody}>{t(associatedActionText)}</ActionInfoText>
                    </>
                </SwitchesWrapper>                   
        )
  }
}

export default withTranslation()(withTheme(connect(mapStateToProps)(TypeAtHomeModuleShutterActions)));


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
const ActionInfoText = styled.Text`
   color:${props => props.color}; 
   font-size:20px;   
   margin-top:10px;
`;





