
import React from 'react';
import {useEffect,useState} from 'react';
import { View,Image,TouchableWithoutFeedback } from 'react-native';
import styled,{ThemeProvider} from 'styled-components/native';
import { useTheme } from '_theming/themeProvider';

export const QrCodeVDPWidgetView = (props) => {    

    const {imageSource,family_name,comment} = props;
    
    const {theme,baseColors} = useTheme();
    const iconColor = theme['card--color--icon'];
 
   
    const onDefaultImageError = () => {

    }

      
  

    //const imageSource = require('./assets/default-image.png');
    const imgWidth = 100;
    const [myHeight,setMyHeight] = useState(imgWidth+20);
    const textColor = theme['card--color--text'];
    const styledTheme = {'textColor':textColor};

    
    return (
        <ThemeProvider theme={styledTheme}>
            <View style={{flex:1}} > 
                <StyledMainView>             
                    <View style={{flex:1,width:'100%',height:myHeight,marginTop:15,marginBottom:15,paddingLeft:30,paddingRight:30}}>
                        <ContentWrapperView>
                            <View style={{width:imgWidth+15,alignContent:'flex-start'}}>
                               <Image source={imageSource} no_OnError={onDefaultImageError} style={{height: imgWidth, width: imgWidth,borderRadius:imgWidth/2}} />
                            </View>
                            <View style={{flex:1,flexDirection:'column'}}>
                                 <NameText>{family_name}</NameText>
                                 <CommentText>{comment}</CommentText>
                            </View>
                        </ContentWrapperView>
                        
                    </View>                       
                </StyledMainView>   
        </View>
        {/* 
            <View style={{height:10,width:'100%',flex:1}}></View>  
                <View style={{flex:1,flexDirection:'row',height:80,justifyContent:'center',alignItems:'center'}}>
                { openActions.indexOf("GATE") != -1 && 
                    <View style={{width: '50%',padding:10,zIndex:8}}>
                        <CustomUnlock  iconThumb="gate" iconRight="padlock" actionName="GATE" callback={openIt} />
                    </View>
                }
                { openActions.indexOf("STRIKE") != -1 &&
                <View style={{width: '50%',padding:10}}>
                    <CustomUnlock  iconThumb="door" iconRight="padlock" actionName="STRIKE" callback={openIt}/>
                </View>
                }                   
            </View>   
        */} 
       </ThemeProvider>  
    )
}

const StyledMainView = styled.View`
                    flex: 1; 
                    min-height:100px; 
                    width:100%;  
                          
                `;
const ContentWrapperView = styled.View`
                flex: 1;
               
                flex-direction:row; 
                background-color:#c0e2c0;
                padding:15px;
                border-radius:15px; 
                align-items:center;                
            `;
const NameText = styled.Text`
     color:${props => props.theme.textColor || 'red'}; 
     font-weight:bold; 
     padding-bottom:10px; 
     font-size:18px;                    
`;
const CommentText = styled.Text`
     color:${props => props.theme.textColor || 'yellow'}; 
                 
`;
// background-color:#c0e2c0;