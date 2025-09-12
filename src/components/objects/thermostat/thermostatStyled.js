import styled from 'styled-components/native'

const StyledMainView = styled.View`
                    flex: 1;
                    min-height:150px;
                   
                `;
const IconCell =  styled.View`
                     flex:${props => props.flex || 1};
                   
                    align-items:center;
                    justify-content:center;
`;
const AutoCenteredView = styled.View`
                    flex:1;
                    padding:4px;
                    align-items:center;
                    justify-content:center;
                    ${({ flex }) => flex && `
                        background-color:yellow;
                    `}
`;
const ModeText = styled.Text`
        font-size:10px;
        margin-top:4px;
        text-transform:uppercase;
        color: ${props => props.color || "#777777"}; 
        
`;

const BoostText = styled.Text`
        font-size:18px;        
        color: ${props => props.color || "#777777"}; 
        ${({ label }) => label && `
                         font-size:8px;      
                    `}

`;
const SetPointText = styled.Text`
      
        color: ${props => props.color || "#000000"};
        font-size: ${props => props.fontSize || 42}px; 
        margin-top:-12px;
        ${({ platform }) => (platform == "ios") && `
          
           padding-top:0px;
           margin-top:-18px
       `}  
`;
const SetPointDegreeSup = styled.Text`
        font-size:14px;         
        color: ${props => props.color || "#000000"};
        align-self:flex-start;
        
        `;
const SetPointUnit = styled.Text`
        font-size:14px;         
        color: ${props => props.color || "#FF0000"};       
        margin-top:-8px;
        
`;

const SetPointTextLabel = styled.Text`
        font-size:10px;  
        text-transform:uppercase;      
        color: ${props => props.color || "#000000"};
        margin-bottom:2px;
        
`;

export {
    StyledMainView,
    IconCell,
    AutoCenteredView,
    ModeText,
    BoostText,
    SetPointText,
    SetPointDegreeSup,
    SetPointUnit,
    SetPointTextLabel
}