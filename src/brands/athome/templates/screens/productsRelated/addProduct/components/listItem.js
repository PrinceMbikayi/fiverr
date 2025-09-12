

import React from 'react';
import { View,Image, TouchableHighlight } from 'react-native';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/native';
import { useTheme} from '_theming/themeProvider';

import {itemListTitle as Title ,itemListDescription as Description} from '../../../../styled'



const ListItem = (props) => {

  const navigation = props.navigation; // v5
  const route = props.route; // v5
  const { t, i18n } = useTranslation();
  
  const {key,leftAvatar: avatar,title,titleStyle,chevron,subtitle,subtitleStyle,onPress,bottomDivider,containerStyle={}} = props


  

   
    return (
          
                <ContainerView key={key} style={containerStyle} onPress={onPress} underlayColor="#DDDDDD">
                    <>
                    <View  style={{flex:1}}>
                        <Title>{title}</Title>
                        <Description>{subtitle}</Description>
                    </View>
                    <Avatar source={avatar?.source}/>
                    </>
                </ContainerView>
           
    
    )

}

export default ListItem;

const Avatar = (props) => {
    return (
      
            <AvatarWrapper>
                <Image source={props.source}  style={{width:'100%',height:'100%'}}resizeMode="contain"/>
            </AvatarWrapper>
      
    )
}



const ContainerView = styled.TouchableHighlight`
    padding:16px;
    border-radius:16px;
    margin-bottom:8px;
    flex-direction:row;
    background-color:${props => props.bgColor || 'green'};   
    `;
const AvatarWrapper = styled.View`
width:48px;
height:48px; 
background-color:white; 
padding:4px;
margin-left:8px;

`;
const AvatarWrapper2 = styled.View`
        width:48px;
        height:48px; 
        border-radius:24px;       
        background-color:white; 
        padding:4px;
        
    `;