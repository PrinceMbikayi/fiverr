import { Platform } from 'react-native';
import styled from 'styled-components/native';

//const semiBoldFamily = ;
const semiBoldFamily = (Platform.OS == 'android') ? "Source Sans Pro_semibold" : "Source Sans Pro";

export const H1  = styled.Text`
    font-size:26px;
    font-weight:bold;
    color:${props => props.color || props.theme.textColor ||'black'};
`;
export const H2  = styled.Text`
    font-size:20px;
    line-height:27px;   
    font-family:${semiBoldFamily}; 
    font-weight:600;
    color:${props => props.color || props.theme.textColor ||'black'};
`;

export const H3 = styled.Text`
    font-size:16px;
    line-height:22px;   
    font-family:${semiBoldFamily}; 
    font-weight:600;
    color:${props => props.color || props.theme.textColor ||'black'};
`;
/**
 * 
 * @param {string} [color] 
 * 
 */
export const P = styled.Text`
    font-size:14px;
    line-height:22px;
    font-weight:normal;
    color:${props => props.color || props.theme.textColor ||'black'};
    text-align:${props => props.theme.textAlign ||'left'};
`;

export const HR = styled.View`
    border-bottom-width:1px;
    border-bottom-color:${props => props.color || props.theme.textColor || 'black'};
`;

export const itemListTitle = styled.Text`
    font-size:18px;
    line-height:25px;   
    font-family:${semiBoldFamily}; 
     font-weight:600;
     color:${props => props.color || props.theme.textColor ||'black'};  
`;
export const itemListDescription = styled.Text`
    font-size:14px;
    line-height:20px; 
    color:${props => props.color || props.theme.textColor ||'black'};  
    
`;


export const VSeparator = styled.View`
     height:${props => props.height || '16'}px; 
`;


export const ViewPagerStep =  styled.Text`
    font-size:14px;
    font-weight:bold;     
    color:${props => props.color ||'black'};
    margin-top:24px;
    margin-bottom:8px; 
`;
//-------------------------------------------
export const PageBody = styled.View`
    flex:1;
    background-color:white;
    border-top-left-radius:32px;
    border-top-right-radius:32px;
    padding-top:10px;

`;
export const OverBody = styled.View`
   
    position:absolute;
    background-color:green;
    height:60px;
    width:100%;
    border-top-left-radius:32px;
    border-top-right-radius:32px;
     background-color:transparent;
    border-color:white;
    border-width:10px;
    border-bottom-width:0;
    z-index:6;

`;


//--------------------------------------
