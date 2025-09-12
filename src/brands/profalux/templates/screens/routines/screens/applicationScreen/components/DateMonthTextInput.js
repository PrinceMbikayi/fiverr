import '_brand/templates/screens/routines/locales'
import React, {useState, useEffect, useRef} from 'react';
import { Text,TextInput, View, Pressable, ScrollView, SafeAreaView, StyleSheet, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '_theming/themeProvider'
import { getDaysOfWeekInShort, getMonthByNumber } from '_brand/templates/screens/routines/utils/index'


export const DateMonthTextInput = (props)=>{
    const {text, dateNumber, monthNumber, onClick, editable} = props   

    console.log('PROPS_DATE_MONTH :', dateNumber, monthNumber);

    const { t, i18n } = useTranslation();
    const tns = "routine";
    let currentLang = i18n.language;

    const { theme } = useTheme();
    const textColor = theme?.prflxTextColor || 'black'
    const month = getMonthByNumber(currentLang, monthNumber);
    const value = `${dateNumber} ${month}`


    return(
        <View style={{flex:1, flexDirection:'row', justifyContent:'flex-end',alignItems:'center', }}>
            <View style={{paddingRight:10, backgroundColor:'transparent', justifyContent:'space-evenly', alignItems:'flex-start'}}>
                    <Text style={{fontSize:16,minWidth:200, fontWeight:"400", color:textColor, backgroundColor:'transparent', textAlign:'right' }}>
                    {text}
                    </Text>
            </View>
            <TouchableOpacity onPress={onClick}  style ={{marginLeft:0}}>
                <View style={{marginBottom:5}}>
                    <TextInput 
                        pointerEvents='none'
                        value = {value}
                        editable={editable}
                        //defaultValue = {date ? moment(date).format('DD MMMM') : ''}
                        textAlign="center"
                        style={{padding:5, backgroundColor:'#EDEDED', 
                                fontSize:16, borderRadius:7,minWidth:150, color:textColor
                            }}
                        >
                    </TextInput>
                </View>
            </TouchableOpacity>
            
        </View>
    )

}