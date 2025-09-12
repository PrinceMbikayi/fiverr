import styled from 'styled-components/native'



export const StyledCardView = styled.View`
                          margin-top: 10px; 
                          margin:10px;
                          background-color:${props => props.bodyBgColor || '#777'};
                          min-height:150px;
                          flex:1;
                   
                `;
export const StyledHeaderView = styled.View`
                        background-color:${props => props.bgColor || 'white'};;
                        max-height:50px;
                        min-height:50px;
                        align-items: center;
                        justify-content: center;
                        flex:1;
                      
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