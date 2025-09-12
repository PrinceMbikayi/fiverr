import React from 'react';
import { View,Pressable} from 'react-native';
import styled from 'styled-components/native';
//-----------------------------------------------------
import { useTheme } from '_theming/themeProvider';
import Button from '_brand/templates/components/ui/Button';

/**
 * 
 * @param {object} props 
 * @param {boolean} props.isSelected
 * @param {callback} [props.callback]
 * 
 * @returns 
 */
export const CheckBox = (props) => {

    const { theme,baseColors} = useTheme();
    const {isSelected,toggleCallback} = props;
    const cbColor = theme.success_medium;
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




const largeButtonAnswer = (props) => {
    const {index,label,icon = null,description = null,response,isSelected,onAnswerSelect,theme,design = {}} = props;
   

    const pressMe = () => {
        onAnswerSelect(response,index)
    }
    const styledTheme = {'textColor':theme?.textColor || 'orange'};

    const buttonColor = isSelected ? (design?.active?.button?.style?.color || "red") : "transparent"
    //const titleColor = isSelected ? "white" : (design?.active?.label?.style?.color || buttonColor)

    const titleColor = design?.[(isSelected)? "active" : "regular"]?.label?.color;


    return (
        <Button onPress={pressMe}  icon={icon} altStyle={!isSelected} bgColor={buttonColor} title={label} titleColor={titleColor} containerStyle={{borderColor:"green"}}/>
    )
    /*
    return (
        <Pressable onPress={pressMe} style={{width:'100%'}}>
            <AnswerWrapper>                    
                    <View style={{width:24}}>
                        <CheckBox isSelected={isSelected}/>
                    </View>
                    <View style={{width:16}}/>
                    <View style={{flex:1}}>
                        <AnswerText theme={styledTheme}>{label}</AnswerText>
                        {description  && 
                        <DescriptionText>{description}</DescriptionText>
                        }                       
                    </View>              
            </AnswerWrapper>
        </Pressable>
    
    )*/

}


export default largeButtonAnswer

const AnswerText  = styled.Text`
    color:${props => props.color || props.theme.textColor ||'black'};
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