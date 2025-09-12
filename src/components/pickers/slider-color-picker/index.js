import React, { Component } from 'react';

import { connect } from "react-redux";

import {withTranslation,i18next } from 'react-i18next';

import {
    SliderHuePicker,
    SliderSaturationPicker,
    SliderValuePicker,
} from 'react-native-slider-color-picker';
import {
   
    Dimensions,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import tinycolor from 'tinycolor2';

const {
    width,
} = Dimensions.get('window');


import { withTheme } from '_theming/themeProvider';


class SliderColorPicker extends Component {
  constructor(props) {
    
    super(props);

    

    this.state = {
       oldColor:props.initColor
       
    };
    
  }

  


    // -------------------- callbacks -------------------------


    changeColor = (colorHsvOrRgb, resType) => {
      if (resType === 'end') {
          const newColor = tinycolor(colorHsvOrRgb).toHexString();
          console.log("newColor",newColor);
          this.setState({
              oldColor: newColor,
          });
          if(this.props.callback)this.props.callback(newColor)
      }
  }



  render() {
   
    const {
      oldColor,
  } = this.state;
    return (
              <View style={styles.container}>
                            <View style={{marginHorizontal: 24, marginTop: 20, height: 12, width: width - 48}}>
                                <SliderHuePicker
                                    ref={view => {this.sliderHuePicker = view;}}
                                    oldColor={oldColor}
                                    trackStyle={[{height: 12, width: width - 48}]}
                                    thumbStyle={styles.thumb}
                                    useNativeDriver={true}
                                    onColorChange={this.changeColor}
                                />
                            </View>
                            <View style={{marginHorizontal: 24, marginTop: 20, height: 12, width: width - 48}}>
                                <SliderSaturationPicker
                                    ref={view => {this.sliderSaturationPicker = view;}}
                                    oldColor={oldColor}
                                    trackStyle={[{height: 12, width: width - 48}]}
                                    thumbStyle={styles.thumb}
                                    useNativeDriver={true}
                                    onColorChange={this.changeColor}
                                    style={{height: 12, borderRadius: 6, backgroundColor: tinycolor({h: tinycolor(oldColor).toHsv().h, s: 1, v: 1}).toHexString()}}
                                />
                            </View>
                            <View style={{marginHorizontal: 24, marginTop: 20, height: 12, width: width - 48}}>
                                <SliderValuePicker
                                    ref={view => {this.sliderValuePicker = view;}}
                                    oldColor={oldColor}
                                    minimumValue={0.02}
                                    step={0.05}
                                    trackStyle={[{height: 12, width: width - 48}]}
                                    trackImage={require('react-native-slider-color-picker/brightness_mask.png')}
                                    thumbStyle={styles.thumb}
                                    onColorChange={this.changeColor}
                                    style={{height: 12, borderRadius: 6, backgroundColor: 'black'}}
                                />
                            </View>
                        </View>
                                
        )
  }
}

export default withTranslation()(withTheme(connect(mapStateToProps)(SliderColorPicker)));


function mapStateToProps(state,props){
    //console.log("mapStateToProps =>",props)
    return {
           
    }

  };




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


