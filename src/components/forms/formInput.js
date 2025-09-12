import React from 'react';
import PropTypes from 'prop-types';
import { useState, useRef } from 'react';
import { Input } from 'react-native-elements';
import { StyleSheet, View } from 'react-native'

import Icon from 'react-native-vector-icons/Ionicons';

import { useTheme } from '_theming/themeProvider';

import InputWrapper from '_brand/templates/components/forms/inputWrapper'


const FormInput = React.forwardRef(
(
  {
  iconName,
  iconColor,
 
  keyboardType,
  name,
  id,
  placeholder,
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
    console.log("focus",inputRef.current)
    inputRef.current.focus();
  }

  const {theme} = useTheme();

  const inputColor = rest.color || theme.neutral_lighter;
  const bgColor = rest.bgColor || "red"
  

  const [isFocused, setIsFocused] = useState(false);
  const onFocus = (e) => {
    setIsFocused(true);
  }
  const onBlur = (e) => {
    setIsFocused(false);
  }

      const inputRef = useRef("input");

   return  (
    <View>
       <InputWrapper  placeholder={placeholder} borderColor={"red"||inputColor}  isFocused={isFocused} bgColor={"red"||bgColor}>
        <Input
          {...rest}
          onFocus={onFocus}
          onBlur={onBlur}
          leftIconContainerStyle={styles.iconStyle}
          placeholderTextColor='black'
          name={name}
          value={value}
          id={id}
          placeholder={""}
          autoCapitalize='none'
          autoCorrect={false}  
          ref={inputRef}
          inputStyle={[styles.inputStyle,{color:"black"||inputColor,fontSize:16}]}
          inputContainerStyle={[styles.inputContainer,(rest.inputContainerStyle) ? rest.inputContainerStyle : {}]}
          paddingRight={0}
          secureTextEntry={passwordVisible}
          rightIcon={passwordToggle  ? <Icon name={visibleIconName} size={28} color={iconColor} onPress={_changeVisibility}/> : null }
          rightIconContainerStyle={styles.iconStyle}
          {...addTestId} {...testUndefined}
        />
      </InputWrapper>
    </View>
  )
})

const styles = StyleSheet.create({
  inputContainer: {
    borderBottomColor:'yellow',
    borderBottomWidth:0,
    padding:0,
    backgroundColor:'transparent',
    marginBottom:0,

   
    
  },
  iconStyle: {
    marginRight: 10,
   
  },
  inputStyle: {
    padding:0,
    fontSize:16,   
    lineHeight:16
    
  }
})
export default FormInput