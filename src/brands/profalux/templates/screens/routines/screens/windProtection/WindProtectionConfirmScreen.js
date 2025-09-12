import '_brand/templates/screens/routines/locales'
import React, {useState, useEffect} from 'react';
import { Text, View, SafeAreaView, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';

import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '_theming/themeProvider'
import { HeaderWithBack } from '_brand/templates/components/headers/header-with-back';
import {EcoCard} from '_brand/templates/components/objects/common/EcoCard'
import { getObjectById } from '_helpers/objects';
import { MyButton } from '_brand/templates/components/ui/MyButton';
import { myToast } from '_brand/templates/components/ui/myToast';
import WindSock from '_brand/images/icons/app/profaluxIconJs/WindSock'
import { useWindProtection } from '_brand/templates/screens/routines/hook/useWindProtection'

export const WindProtectionConfirmScreen = (props)=>{
    const {} = props
    const { t, i18n } = useTranslation();
    const tns = "routine";
    const navigation = useNavigation();

    const { theme } = useTheme();
    const bgcolor = theme?.prflxbgColor || 'white';
    const headerBgColor = theme?.prflxHeaderBackground || '#FFFFFF'
    const textColor = theme?.prflxTextColor || 'black'


    const useWindProtect = useWindProtection();
    const { 
            windProtectionIdentity, createWindProtection, updateWindProtection
    } = useWindProtect;
    


    const [isClicked, setIsClicked] = useState(false);
    const [loading, setLoading] = useState(false);


     useEffect(()=> {
     
     },[isClicked]);

    const goBack = () => {
        navigation.goBack()
      }

    const endCreation = async()=>{
        if(!windProtectionIdentity?.windProtectionId) {
            const result =  await createWindProtection().catch((err) => console.log("SERVER_ERROR_ON_WIND_PROTECTION_CREATION : ",err));
            console.log('SERVER_RESPONSE_ON_WIND_PROTECTION_CREATION', result);
        }
        if(windProtectionIdentity?.windProtectionId) {
            const result =  await updateWindProtection().catch((err) => console.log("SERVER_ERROR_ON_WIND_PROTECTION_UPDATE : ",err));
            console.log('SERVER_RESPONSE_ON_WIND_PROTECTION_UPDATE', result);
        }
    }



    return(
        <SafeAreaView style={{ height: '100%', backgroundColor: 'white' || bgcolor }} >
            <View style={{ flex: 1, backgroundColor: bgcolor, }}>
                <View style={{ backgroundColor: 'transparent' || headerBgColor, alignItems: 'center', justifyContent: 'flex-end' }}>
                    <HeaderWithBack
                        title= {windProtectionIdentity?.windProtectionName}
                        backSVG centeredP
                        goBack={{ action: goBack }}
                        noShadow 
                    />
                </View>

                <View style={{flex:1, justifyContent:'space-between', alignItems:'center', padding:20, marginTop:20,  opacity: loading ? 0.3 : 1}} >
                    <View style={{alignItems:'center', justifyContent:'flex-start', backgroundColor:'transparent', flex:1}}>
                        <View>
                            <EcoCard titlePart1={"Protection"} titlePart2={'vent'} fontSize ={14} iconSize={33} Picto={WindSock}/>
                        </View>
                        <View>
                            {!windProtectionIdentity?.windProtectionId &&
                                <Text style={{fontSize:16,fontWeight:'400',marginTop:40, textAlign:'center',color:textColor}} >
                                    {t(tns + ":" + "WIND_PROTECTION_CONGRATS")}
                                </Text>
                            }
                            {windProtectionIdentity?.windProtectionId &&
                                <Text style={{fontSize:16,fontWeight:'400',marginTop:40, textAlign:'center',color:textColor}} >
                                    {t(tns + ":" + "WIND_PROTECTION_UPDATE_CONGRATS")}
                                </Text>
                            }
                        </View>
                    </View>

                    <View style={{ minWidth: 200, marginTop: 30 }}>
                        <MyButton onPress={endCreation} title={t(tns + ":" + "END")} disabled={isClicked ? true : false}/>
                    </View>

                </View>

                {loading &&
                        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' }}>
                            <View style={{ marginVertical: 50 }}>
                                <ActivityIndicator size="large" color='#3E495E' style={{ transform: [{ scaleX: 4 }, { scaleY: 4 }] }} />
                                <Text style={{ marginTop: 60, color: textColor, fontSize: 14, fontWeight: "500" }}>{t(tns + ":" + "ROUTINE_CONFIGURATION_LOADING")}</Text>
                            </View>
                        </View>
                    }
                <View style={{width:'100%', height:50, backgroundColor:'transparent'}}/>
            </View>
        </SafeAreaView>
    )
}