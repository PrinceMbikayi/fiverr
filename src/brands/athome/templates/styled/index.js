
import styled from 'styled-components/native';

//const semiBoldFamily = "Source Sans Pro_semibold";
const semiBoldFamily = "Source Sans Pro";

export const H1  = styled.Text`
    font-size:26px;
    font-weight:bold;
`;
export const H2  = styled.Text`
    font-size:20px;
    line-height:27px;   
    font-family:${semiBoldFamily}; 
    font-weight:600;
`;
export const P = styled.Text`
    font-size:16px;
    line-height:24px;
    font-weight:normal;
`;

export const itemListTitle = styled.Text`
    font-size:18px;
    line-height:25px;   
    font-family:${semiBoldFamily}; 
     font-weight:600;  
`;
export const itemListDescription = styled.Text`
    font-size:14px;
    line-height:20px;   
    
`;


export const VSeparator = styled.View`
     height:${props => props.height || '16'}px; 
`;

//-------------------------------------------
export const PageBody = styled.View`
    flex:1;
    /*
    background-color:white;
    border-top-left-radius:32px;
    border-top-right-radius:32px;*/
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