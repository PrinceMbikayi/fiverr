import React, { Component } from 'react';
import {useContext,useState,useEffect} from 'react'
import { connect } from "react-redux";
import { View,Text,StyleSheet,Dimensions } from 'react-native';
import {withTranslation,i18next } from 'react-i18next';
import styled from 'styled-components/native';



import { withTheme } from '_theming/themeProvider';
import {ActionSwitch} from '_components/scenarios/actionSwitch';
import * as ScenarioHelpers from '_helpers/scenarios';

import * as level2Funcs from '_helpers/level2options';

import SliderColorPicker from '_components/pickers/slider-color-picker';

class TypeLightActions extends Component {
  constructor(props) {
    
    super(props);

    let actionsSwitches = {
      "ONOFF":{actionNames: ['OFF','ON'],value:true,"label":"ON_OFF"}           
    }

   console.log("TypeLightActions",this.props.scenarioId)
    if(this.props.scenarioId != -1) {

      actionsSwitches = level2Funcs.initSwitches(this.props.scenarioId,actionsSwitches);
      
    }

    console.log("actionsSwitches ===>",actionsSwitches)

    this.state = {
        actionsSwitches: {... actionsSwitches},
        oldColor:"#FFFF00"
       
    };
   
  }

  async componentDidMount() {  
    if(this.props.callback) {
      this.props.callback(this.state.actionsSwitches);  
    }
    
   //
  }


    // -------------------- callbacks -------------------------

        
    onSwitchToggle = async(switchId) => {    
       
      const res = await level2Funcs.onSwitchToggle(switchId,this);      
       this.props.callback(this.state.actionsSwitches);  
    }
    // -------------------------------------------------
    onSatValPickerChange({ saturation, value }) {
      this.setState({
        sat: saturation,
        val: value,
      });
    }
  
    onHuePickerChange({ hue }) {
      this.setState({
        hue,
      });
    }

    onColorChanged = (newColor) => {
      console.log("onColorChanged =>",newColor)
      this.setState({oldColor:newColor})
      console.log("this.props.callback",this.props.callback)
      this.props.callback({type:'action',content:{'actionName':"COLOR",mArgs:[{name:"color",value:newColor.toUpperCase()}]}})
    }

    



  render() {
    const { t,theme } = this.props;
    const {
      oldColor,
  } = this.state;
    return (
                <SwitchesWrapper borderColor={theme.divider_on_body}>
                    <>
                      <ActionSwitch actionText={t('scenarios:ON_OFF_LIGHT')+ " "} stateValue ={this.state.actionsSwitches.ONOFF.value} stateName="ONOFF" callback={this.onSwitchToggle}/>
                      
                      <View>
                        <View>
                          <View style={{flexDirection:'row'}}>
                            <View style={{flexGrow:2 }}>
                              <Text style={{color:'white'}}>Voilou</Text>
                            </View>                           
                            <View style={{alignSelf:'flex-end',width:80,height:30,backgroundColor:oldColor,borderWidth:1,borderColor:'white'}}/></View>
                          </View>                        
                          <SliderColorPicker initColor={oldColor} callback={this.onColorChanged}/>                         
                      </View>
                   
                    </>
                </SwitchesWrapper>                   
        )
  }
}

export default withTranslation()(withTheme(connect(mapStateToProps)(TypeLightActions)));


function mapStateToProps(state){
    return {}
  };



const SwitchesWrapper = styled.View`
    border-color:${props => props.borderColor}; 
    border-top-width:1px;
    border-bottom-width:1px;
    padding-bottom:10px;
`;

const styles = StyleSheet.create({
  container: {
      flex: 1,
      alignItems: "center",
  },
  thumb: {
      width: 20,
      height: 20,
      borderColor: 'white',
      borderWidth: 1,
      borderRadius: 10,
      shadowColor: 'black',
      shadowOffset: {
          width: 0,
          height: 2
      },
      shadowRadius: 2,
      shadowOpacity: 0.35,
  },
});


