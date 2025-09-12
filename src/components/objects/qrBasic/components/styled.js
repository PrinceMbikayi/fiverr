import styled,{ThemeProvider} from 'styled-components/native';

export const ViewerTitle = styled.Text`
        color:${props => props.theme.textColor || 'yellow'}; 
        text-align:left;
        font-weight:bold; 
        font-size:24px;
        margin-bottom:15px;    
`;

export const ViewerText = styled.Text`
    color:${props => props.theme.textColor || 'yellow'}; 
    text-align:left;  
    font-size:14px;  
    margin-bottom:10px;      
`;

export const Body= styled.View`
    width:100%;    
    padding:15px;
    flex:1;    
`;
export const TextInput = styled.TextInput`
    color:${props => props.color || props.theme.textColor || "black"}; 
    text-align:left;  
    font-size:14px; 
    padding-top:10px;
    padding-bottom:10px;
    border-radius:14px;
    background-color:#DDDDDD;
    padding-left:10px;
    padding-right:10px;
    margin-top:10px;
    margin-bottom:10px;
`;

export const Label = styled.Text`
    color:${props => props.theme.textColor || 'yellow'}; 
    text-align:left;  
    font-size:18px; 
    font-weight:bold;       
`;

export const VSpacer = styled.View`
    height:${attrs => attrs.height|| 20}px;
`;


export const IconWrapper = styled.View`
      background-color:${props => props.bgColor || "white"};
      border-radius:${props => props.size/2}px;
      height:${props => props.size}px;
      width:${props => props.size}px;
      align-items:center;
      justify-content:center;
`;