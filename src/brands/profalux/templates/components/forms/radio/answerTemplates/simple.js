import React from 'react';
import { View,Pressable, Text} from 'react-native';
import styled from 'styled-components/native';
//-----------------------------------------------------
import { useTheme } from '_theming/themeProvider';
import { color } from 'react-native-reanimated';

/**
 * 
 * @param {object} props 
 * @param {boolean} props.isSelected
 * @param {callback} [props.callback]
 * 
 * @returns 
 */
export const CheckBox = (props) => {

    const { theme} = useTheme();
    const bgcolor = theme?.prflxbgColor || 'white';
    const textColor = theme?.prflxTextColor || 'black'


    const {isSelected,toggleCallback} = props;
    const cbColor = textColor
    //const cbColor = theme.success_medium;
    const borderColor = (isSelected) ? cbColor : cbColor;
    const fillColor = (isSelected) ? cbColor : 'transparent';
    const size = 24;
    const innerSize = 14;

    const CB = () => {
        return (
            <View style={{width:size,height:size,borderRadius:size/2,borderWidth:2,borderColor:borderColor,marginRight:8,justifyContent:'center'}}>
                <View style={{width:innerSize,height:innerSize,borderRadius:(innerSize)/2,backgroundColor:fillColor,alignSelf:'center'}}></View>
            </View>
        )
    }


    return (
        <>
        {toggleCallback 
        ?  <Pressable onPress={toggleCallback}><CB/></Pressable>
        :  <CB/>
        }
        </>
    )
}




const SimpleAnswer = (props) => {
    const {index,label,description = null,response,isSelected,onAnswerSelect,theme,icon} = props;
    
    const { myTheme } = useTheme();
    const bgcolor = myTheme?.prflxbgColor || 'white';
    const textColor = myTheme?.prflxTextColor || '#3E495E';

    
    const pressMe = () => {
        
        onAnswerSelect(response,index)
    }
    const styledTheme = {'textColor':textColor || 'blue'};
   // const styledTheme = {'textColor':theme?.textColor || 'blue'};
    return (
        <Pressable onPress={pressMe} style={{width:'100%'}}>
            <AnswerWrapper>                    
                    <View style={{width:24}}>
                        <CheckBox isSelected={isSelected}/>
                    </View>
                    <View style={{width:16}}/>
                    {icon}
                    {icon && <View style={{width:8}}/>}
                    <View style={{flex:1}}>
                        {/* <AnswerText theme={styledTheme}>{label}</AnswerText> */}
                        <Text style={{color:textColor, fontSize:14, fontWeight:'400'}}>
                            {label}
                        </Text>
                        {description  && 
                        <DescriptionText>{description}</DescriptionText>
                        }                       
                    </View>              
            </AnswerWrapper>
        </Pressable>
        
    )

}


export default SimpleAnswer

const AnswerText  = styled.Text`
    color:${props => props.color || '#3E495E' || props.theme.textColor };
    font-size:16px;
    font-weight:normal;  
`;

const DescriptionText  = styled.Text`
    font-size:16px;
    margin-right:0px;
    font-weight:400;  
   
`;

const AnswerWrapper = styled.View`
   
    margin-bottom:16px;
    flex-direction:row;
`;