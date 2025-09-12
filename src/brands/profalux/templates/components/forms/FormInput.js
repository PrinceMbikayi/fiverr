import React from 'react';
import { useState, useRef } from 'react';
import { Input } from 'react-native-elements';
import { StyleSheet, View, TextInput} from 'react-native'

import Icon from 'react-native-vector-icons/Ionicons';

import { useTheme } from '_theming/themeProvider';



const FormInput = React.forwardRef(
(
  {
  iconName,
  iconColor,
 
  keyboardType,
  name,
  id,
  placeholder,
  autoCapitalize,
  value,
  secureTextEntry,
  passwordToggle,
  addTestId,
  testUndefined,
   ...rest
},ref) => {

  let [visibleIconName, changeVisibleIconName] = useState('md-eye');
  let [passwordVisible, changePasswordVisible] = useState(secureTextEntry);
  
  function _changeVisibility(){
   
    let newVal = !passwordVisible;   
    changePasswordVisible(newVal)
    let aaa = passwordVisible ? 'md-eye-off':'md-eye';
    changeVisibleIconName(aaa);
  }



  const focus = () =>{
    inputRef.current.focus();
  }

  const {theme} = useTheme();

  const borderColor = theme?.prflxBorderColor||'orange';
  const bgcolor = theme?.prflxContaintBgColor||'white';
  const lineWidgetBgColor = theme?.prflxVerticalMultiIconsBgColor||"white";
  const textColor = theme?.prflxTextColor||'black'

  const inputColor = textColor || theme.neutral_lighter;
  const bgColor = bgcolor || "red"

  

  const [isFocused, setIsFocused] = useState(false);
  const onFocus = (e) => {
    setIsFocused(true);
  }
  const onBlur = (e) => {
    setIsFocused(false);
  }

      const inputRef = useRef("input");

   return  (
    <View style={{paddingVertical:20,marginVertical:5, paddingHorizontal:10, height:44, justifyContent:'center',alignItems:'center', borderColor:"#b9b9bd", borderWidth:1, width:'100%', borderRadius:20, backgroundColor:'white'}}>
       {/* <InputWrapper  placeholder={placeholder} borderColor={inputColor}  isFocused={isFocused} bgColor={"red"||bgColor}> */}
        <Input
          {...rest}
          autoFocus={false}
          onFocus={onFocus}
          //onBlur={onBlur}
          leftIconContainerStyle={styles.iconStyle}
          placeholderTextColor='grey'
          name={name}
          value={value}
          id={id}
          placeholder={placeholder}
          autoCapitalize={autoCapitalize ||'none'}
          autoCorrect={false}  
          ref={inputRef}
          no_no_style={{marginTop:6,height:44}}
          no_style={{height:44, borderColor:"#b9b9bd", borderWidth:1, width:'100%', borderRadius:20, backgroundColor:'white', paddingHorizontal:10}}
          inputStyle={[styles.inputStyle,{color:inputColor,fontSize:16}]}
          inputContainerStyle={[styles.inputContainer, {borderColor:'transparent', height:50}, ,(rest.inputContainerStyle) ? rest.inputContainerStyle : {}]}
          paddingRight={0}
          secureTextEntry={passwordVisible}
          rightIcon={passwordToggle  ? <Icon name={visibleIconName} size={28} color={iconColor} onPress={_changeVisibility}/> : null }
          rightIconContainerStyle={styles.iconStyle}
          {...addTestId} {...testUndefined}
        />
    </View>
  )
})

const styles = StyleSheet.create({
  inputContainer: {
  //borderBottomColor:'yellow',
  borderBottomWidth:0,
  borderTopWidth:1,
  padding:0,
  backgroundColor:'transparent',
  marginBottom:0, 
  },
  iconStyle: {
  marginRight: 0,
  marginTop:12
   
  },
  inputStyle: {
  padding:0,
  fontSize:16,   
  lineHeight:16,
  marginTop:8
    
  }
})
export default FormInput