import '../_locales'

import React, { Component } from 'react';
import { useState,useEffect } from 'react';
import { View, Text, ScrollView,SafeAreaView} from 'react-native';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/native';
import { useTheme} from '_theming/themeProvider';
import {HeaderWithBack} from '_components/headers/header-with-back';

import ListItem from './components/listItem';
import {H1,P} from '../../../styled';


const AddProductScreenSelect = (props) => {

    const {list,selectProduct} = props;
    const navigation = props.navigation; // v5
    const route = props.route; // v5

    const { t, i18n } = useTranslation();
    const {theme,baseColors} = useTheme();
    const title = t("addProduct:ADD_A_PRODUCT");   
    
    const {bgColor,textColor} = baseColors;
    const titleColor = textColor;

    const headerBackgroundColor = theme.primary_2_darker;
    const headerTextColor = theme.neutral_lighter;
    return (
      <SafeAreaView style={{flex:1,flexDirection:'column',backgroundColor: headerBackgroundColor || theme['color--bg']}}>      
         <View style={{minHeight:64,alignItems:'center',justifyContent:'flex-start',backgroundColor:headerBackgroundColor}}>
            <HeaderWithBack title={title}  style={{}} nobackDoClose bgColor={headerBackgroundColor} color={headerTextColor} noShadow/>
        </View>
        <MainView bgColor={"white"}>        
          <View>
          {
          list.map((l, i) => (

            <ListItem
              key={i}
              leftAvatar={{ source:l.avatar_url,rounded:false,fadeDuration:0}}
              transition={false}
              title={l.name}
              titleStyle={{color:titleColor}}
              chevron={true}
              subtitle={l.shortDescription}
              subtitleStyle={{color:titleColor}}
              onPress={()=>{selectProduct(l.productId)}}
              bottomDivider
              containerStyle={{backgroundColor:getBgColor({"theme":theme,"productId":l.productId})}}
            />
          ))
        }
        </View>
        <View style={{height:16}} />
      </MainView>
      </SafeAreaView>
    )

}

export default AddProductScreenSelect;

const getBgColor = (theme,productId) => {
    console.log("productId",productId)
    const color1 = theme.additional_2_lighter;
    const color2 = theme.additional_3_lighter;
    const color3 = theme.primary_1_lighter;
    const color4 = theme.additional_1_lighter;
    const colors = {
                        "QR-BASIC" : color1,"DOORKEEPER":color1,
                        "CAT_HEATER":color2,
                        "CAT_MOTOR":color3,
                        "CAT_SECURITY":color4
                
                }

    return colors?.[productId] || "#BBB"
}



const MainView = styled.ScrollView`
      background-color:${props => props.bgColor || 'green'};
      padding:16px;
     
     
    `;

