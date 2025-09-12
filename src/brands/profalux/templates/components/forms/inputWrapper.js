import React from 'react';
import { View} from 'react-native';
import styled,{ThemeProvider} from 'styled-components/native';
import { useTheme } from '_theming/themeProvider';



//--- brand ----
// style={{transform:[{scale: 0.5}]}}

function InputWrapper(props) {

    const {isFocused,value} = props;


    const borderColor =  props.borderColor || "green";   
    const {theme,baseColors} = useTheme();
    const {bgColor} = props || "red";
    

    const focusedColor = '#6BC16F' ;

   const styledTheme = {
                        borderColor:isFocused? "gray"||focusedColor :"gray"||borderColor,
                        borderWidth:1,radius:8,topHeight:2,
                        labelColor:isFocused? "white"||focusedColor :"gray"||borderColor,
                        labelBackgroundColor:'white'||bgColor,
                        placeholderColor: props.placeholderTextColor || "grey"
                    };


    return ( 
        <View style={{backgroundColor:'transparent',marginBottom:8}} >
            <ThemeProvider theme={styledTheme}>
                <WrapperCentral style={{backgroundColor:'white',padding:0}}>
                    {props.children}
                </WrapperCentral>          
            </ThemeProvider>
           </View>
     );
}


export default InputWrapper;


const Wrapper = styled.View`
    border-radius:10px;
    border-width:2px;
    border-color:gray;
`;



const WrapperTop = styled.View`
  
    height:12px;
    flex-direction:row;
    border-color:yellow;
    min-height:${attrs => attrs.theme.topHeight}px;
    overflow:visible;
`;
const TopLeft = styled.View`
  
    border-top-left-radius:${attrs => attrs.theme.radius}px;
    border-width:${attrs => attrs.theme.borderWidth}px;
    border-bottom-width:0;
    border-right-width:0;
    border-color:${attrs => attrs.theme.borderColor};
    width:20px;
`;
const TopRight = styled.View`
  
    border-top-right-radius:${attrs => attrs.theme.radius}px;
    border-width:${attrs => attrs.theme.borderWidth}px;
    border-bottom-width:0;
    border-left-width:0;
    border-color:${attrs => attrs.theme.borderColor};
    flex:1;
`;

const WrapperCentral = styled.View`
  
   
    border-width:${attrs => attrs.theme.borderWidth}px;
    border-bottom-width:0px;
    border-top-width:0px;
    background-color:transparent;
    border-radius:20px;
    border-color:${attrs => attrs.theme.borderColor};    
    align-items:center;
    justify-content:center;
`;
const WrapperBottom = styled.View`  
    border-bottom-left-radius:${attrs => attrs.theme.radius}px;
    border-bottom-right-radius:${attrs => attrs.theme.radius}px;
    border-width:${attrs => attrs.theme.borderWidth}px;
    border-top-width:0;  
    border-color:${attrs => attrs.theme.borderColor};
    height:12px;
    min-height:${attrs => attrs.theme.radius}px;
    margin-bottom:${attrs => attrs.theme.radius}px;
`;


const Label = styled.Text`
  font-size:${attrs => attrs.fontSize}px; 
  padding-left:0px;
  padding-right:0px;
 
  color:${attrs => attrs.theme.labelColor};
  background-color:yellow;
  overflow:visible;
  z-index:4;
`;
