import '_brand/templates/components/objects/common/locales'
import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '_theming/themeProvider'


export const GlobalToast = (props) => {

  const {toastTitle,titleColor, toastBody, toastBgColor, bodyTextColor,buttons} = props;

  let buttonsLenght = buttons ? buttons.length : 0;

  const { t, i18n } = useTranslation(); 
  const tns = "common";

  const { theme } = useTheme();
  const borderColor = theme?.prflxBorderColor || 'orange';
  const textColor = theme?.prflxTextColor || 'black';

    return (
      <View style= {{backgroundColor: toastBgColor||'#F2F2F2',opacity:0.9, borderRadius:14, padding: 0, justifyContent:'center', alignItems:'center'}}>
         <View>
            <Text style={{color:titleColor || textColor, fontSize:17, fontWeight:'600', marginTop:10, backgroundColor:'transparent'}}> 
              {toastTitle} 
            </Text>
         </View>
         <View style={{marginTop:5, marginBottom:15, backgroundColor:'transparent'}}>
            <Text style={{color:bodyTextColor || textColor, fontSize:14, fontWeight:'400', textAlign:'center'}}> {toastBody} </Text>
         </View>
        {buttons &&
          <View style={{flexDirection:'row', backgroundColor:'transparent', borderTopWidth:1, borderTopColor:"#CCC"}}>
            {
              buttons.map((button, index) => (
                <TouchableOpacity 
                    key={button.id} 
                    style={{margin:0, flex:1, borderRightWidth:(buttonsLenght >1 && index != buttonsLenght-1) ? 2 : 0, borderColor:"#CCC", backgroundColor:'transparent', justifyContent:'center', alignItems:'center', padding:10}}
                    onPress={button.action}
                  >
                    <Text style={{color:button.textColor || "#007AFF", fontSize:16, fontWeight:'400', textAlign:'center'}}> 
                      {button.text} 
                    </Text>
                </TouchableOpacity>
              )) 
            }
          </View> 
        }

      </View>
    )
}