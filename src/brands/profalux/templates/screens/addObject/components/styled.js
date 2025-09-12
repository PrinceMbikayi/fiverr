import styled from 'styled-components/native'



export const StyledCardView = styled.View`
                          margin-top:15px;
                          background-color:${props => props.bodyBgColor || 'orange'};
                          min-height:25px;
                          flex:1;
                          flex-direction:column;
                          border-radius:16px;
                          border-color:orange;
                          border-width: 2;
                          
                   
                `;

export const StyledCardGeneralInnerWrapper = styled.View`
        flex:1;
        flex-direction:row;
        border-radius:16px;
        background-color:${props => props.bodyBgColor || 'yellow'};
        max-height:${props => props.heightPercent}%;
        min-height:${props => props.heightPercent}%;
        height:100%
        width:${props => props.widthPercent}%;
`;
export const StyledInnerCardView = styled.View`   
        /*margin:5px;*/
        background-color:${props => props.bodyBgColor || 'transparent'};
        min-width:${props => props.widthPercent}%;
        border-radius:16px;
        flex:1;
       
 
`;
export const StyledHeaderView = styled.View`
                        margin-top:5px;
                        background-color:${props => props.bgColor || 'transparent'};
                        max-height:${props => props.heightPercent}%;
                        min-height:${props => props.heightPercent}%;
                        width:100%;
                        align-items: center;
                        justify-content: center;
                        flex:1;
                        border-radius:16px;
                      
                `;
export const StyledSideView = styled.View`
        background-color:${props => props.bgColor || 'transparent'};
        max-height:${props => props.heightPercent}%;
        min-height:${props => props.heightPercent}%;
        width:${props => props.widthPercent}%;
        align-items: center;
        justify-content: center;
        flex:1;
        border-radius:16px;
`;

export const H1Input = styled.TextInput`
                         background-color:white;
                         font-size:16px;
                         font-weight:bold;
                        
                   
                `;
export const H1 = styled.Text`
          
          background-color:transparent;
          font-size:16px;
          font-weight:bold; 
`;

export const DisconnectedViewOverlay = styled.View`
          position:absolute;
          width:100%;
          height:100%;         
          background-color:${props => props.bgColor || "#FF0000CC" };
         
`;
export const DisconnectedText = styled.Text`
          
          font-size:12px;
          font-size:14px;
          padding:4px;
          margin-top:4px;
          margin-bottom:4px;
          color:#999;
          text-align:center;
    
`;