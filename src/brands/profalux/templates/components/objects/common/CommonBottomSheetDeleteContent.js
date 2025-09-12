import '_brand/templates/components/objects/common/locales'
import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';


export const CommonBottomSheetDeleteContent = (props) => {

    const {nameToDelete, warningText, textColor, onDelete, onCancel,} = props;

      const { t, i18n } = useTranslation(); 
      const tns = "common";


    return (
      <View style= {{ backgroundColor: 'transparent', borderRadius: 8, padding: 10, marginBottom:20}}>
          <TouchableOpacity 
                style={{height:'65%', backgroundColor: '#cdcdcd', justifyContent: 'center', alignItems: 'center', 
                          borderRadius: 8, marginHorizontal:0, paddingTop: 10 
                      }}
                onPress={onDelete}
              >
                <View style={{justifyContent:'space-around', alignItems: 'center', flex:1}}>
                  <Text style={{color:textColor, fontSize:16, opacity:0.8, textAlign:'center'}}> {warningText} {nameToDelete} ?</Text>
                  <Text style={{color:'red', opacity: 0.7, fontSize:18, fontWeight:'400'}}>{t(tns+":"+"DELETE_CONFIRM")}</Text>
                </View>
          </TouchableOpacity>

          <TouchableOpacity 
                style={{height:'30%', backgroundColor: '#cdcdcd', justifyContent: 'center', alignItems: 'center', 
                          borderRadius: 8, marginHorizontal:0, paddingTop: 0, marginTop: 10 
                      }}
                onPress={onCancel}
              >
                <View style={{marginTop:0, marginBottom:0}}>
                  <Text style={{color:'blue', opacity: 0.7, fontSize:18, fontWeight:'400'}}>{t(tns+":"+"DELETE_CANCEL")}</Text>
                </View>
          </TouchableOpacity>
      </View>
    )
}