import '_screens/account/locales';
//import './_locales'
//------- then FC -------------------------
import React, {useContext,useEffect,useState,useRef,useCallback} from 'react';
import { Text,View,Image,ScrollView,SafeAreaView,Platform} from 'react-native'; // use in styled components
import { useSelector,useDispatch } from 'react-redux';

import { useNavigation,useRoute,StackActions } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import DeviceInfo from 'react-native-device-info';
//-----------------------------------------------------
import { useTheme } from '_theming/themeProvider';

//import {PageBody,OverBody} from '../../../styled/index';
//import {PageBody,OverBody} from '../../styled';

import Slider from '@react-native-community/slider';




const StepSlider= (props) => {
   

    const {containerStyle = {},id :sliderId ,onChange,onComplete} = props;
    const sliderRef = useRef(null);
    const [value, setValue] = useState(0);
   
    const { theme,changeTheme,themeID,baseColors} = useTheme();
   
   const navigation = useNavigation();
   const route = useRoute();
   const navParams = route?.params || {}; 
  

    const {bgColor,headerBackgroundColor,headerTextColor} = baseColors;

    const textColor = 'white' || baseColors.textColor


    const maximumTrackTintColor = "grey";
    const minimumTrackTintColor = "white";

    const onValueChange = (val) => {
        console.log("val",val);
        setValue(val);
        if(onChange) {
            onChange(sliderId,val)
        }
    }

    const onSlidingComplete = (val) => {
        if(onComplete) {
            onComplete(sliderId,val)
        }
    }

    const getColor = (step) => {
        return (step <= value) ? minimumTrackTintColor : maximumTrackTintColor;      
    }

    const thumbImage = (Platform.OS == 'ios') ? require('./thumbImage.png') : require('./thumbImage-android.png');

    return (
           <View style={[{backgroundColor:'transparent'},containerStyle]}>
                     <View style={{flexDirection:'row',justifyContent:'space-between',width:'100%',height:4,paddingLeft:16,paddingRight:16,marginBottom:-22}} zIndex={-1} pointerEvents="none">
                        <View style={{width:'19%',backgroundColor: getColor(1),borderRadius:2}}></View>
                        <View style={{width:'19%',backgroundColor:getColor(2),borderRadius:2}}></View>
                        <View style={{width:'19%',backgroundColor:getColor(3),borderRadius:2}}></View>
                        <View style={{width:'19%',backgroundColor:getColor(4),borderRadius:2}}></View>
                        <View style={{width:'19%',backgroundColor:getColor(5),borderRadius:2}}></View>
                    </View>
                    <View>
                        <Slider
                            style={{width: '100%', height: 40}}
                            minimumValue={0}
                            maximumValue={5}
                            step={1}
                            minimumTrackTintColor="#00000000"
                            maximumTrackTintColor="#0000000"
                            ref={sliderRef}
                            onValueChange={onValueChange}
                            onSlidingComplete={onSlidingComplete}
                            thumbImage={thumbImage}
                            />
                    </View>                   
                </View>
        )
}

export default StepSlider

