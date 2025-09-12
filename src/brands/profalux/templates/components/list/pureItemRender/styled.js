import styled from 'styled-components/native'



export const StyledCardView = styled.View`
                          margin-top:10px;
                          background-color:${props =>props.bodyBgColor || 'orange'};
                          min-height:80px;
                          /*width:${props => props.widthSize};*/
                          flex-direction:column;
                          border-radius:16px;
                          border-color:orange;
                          border-width: 1px;
                          flex:1
                          
                   
                `;

export const StyledCardGeneralInnerWrapper = styled.View`
        flex:1;
        flex-direction:row;
        border-radius:16px;
        /*background-color:yellow;*/
        background-color:${props =>props.bodyBgColor || 'yellow'};
        max-height:${props => props.heightPercent}%;
        min-height:${props => props.heightPercent}%;
        height:100%
        /*width:${props => props.widthPercent}%;*/
`;
export const StyledInnerCardView = styled.View`   
        margin:5px;
        margin-right:5px;
        background-color:${props => props.bodyBgColor || 'transparent'};
        /*background-color:${props => 'white'||props.bodyBgColor || 'transparent'};*/
        /*min-width:${props => props.widthPercent}%;*/
        border-top-left-radius:16px;
        border-bottom-left-radius:16px;
        flex:1;
       
 
`;
export const StyledHeaderView = styled.View`
                        /*margin-top:5px;*/
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
        /*margin-right:2px;*/
        background-color:${props => props.bgColor || 'transparent'};
        /*background-color:red;*/
        max-height:${props => props.heightPercent}%;
        min-height:${props => props.heightPercent}%;
        width:25px;
        /*width:${props => props.widthPercent}%;*/
        align-items: center;
        justify-content: center;
        border-top-right-radius:11px;
        border-bottom-right-radius:11px;
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
          font-size:14px;
          position:absolute;
          top:30;
          left:200;
          padding:4px;
          margin-top:4px;
          margin-bottom:4px;
          color:#999;
          text-align:center;
    
`;