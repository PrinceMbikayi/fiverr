import '_brand/templates/screens/addObject/locales'
import React from 'react';
import { View, Text, Image, StyleSheet} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '_theming/themeProvider';


export const RemoteNetworkOpeningInstructions = (props) => {

    const {remoteType} = props;
    const { t, i18n } = useTranslation();
    const tns = "addObject";

    const { theme } = useTheme();
    const borderColor = theme?.prflxBorderColor || 'orange';
    const bgWhitecolor = theme?.prflxContaintBgColor || 'white';
    const bgcolor = theme?.prflxbgColor || 'white';
    const lineWidgetBgColor = theme?.prflxVerticalMultiIconsBgColor || "white";
    const textColor = theme?.prflxTextColor || 'black'

    const aspectRatio = {
        "portable": 2.2,
        "wall": 2.2,
        "receptor": 1,
    }
    const imageFindRFConfig ={
        "portable": require('_brand/templates/screens/addObject/images/RF.png'),
        "wall": require('_brand/templates/screens/addObject/images/wallRemote-RF.png'),
        "receptor": require('_brand/templates/screens/addObject/images/receptor-button.png'),
    }
    const imageActionConfig ={
        "portable": require('_brand/templates/screens/addObject/images/zigbeeRemoteRStop.png'),
        "wall": require('_brand/templates/screens/addObject/images/wallRemote-1xR-stop.png'),
        "receptor": require('_brand/templates/screens/addObject/images/receptor-showbutton.png'),
    }

    const findButtonsText ={
        "portable": t(tns + ":" + "FIND_R_F"),
        "wall": t(tns + ":" + "FIND_R_F"),
        "receptor": t(tns + ":" + "LOCALIZE_RECEPTOR_BUTTON")
    }
    const pressButtonText = {
        "portable": t(tns + ":" + "CLIP_R_STOP"),
        "wall": t(tns + ":" + "CLIP_R_STOP"),
        "receptor": t(tns + ":" + "OPEN_NETWORK_WITH_RECEPTOR")
    }


        return(
            <View style={{flex:1}}>
                <View style={{ backgroundColor: 'transparent', padding: 0, flex:1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontSize: 16, color: textColor, fontWeight: '400', textAlign: 'center' }}>
                        {findButtonsText[remoteType]}
                    </Text>

                    <View style={{marginTop:20}}>
                        {remoteType === "receptor" ?
                            // <Image source={imageFindRFConfig[remoteType]} style={{width:250,height:110, resizeMode:'contain' }} />
                            <View style={{backgroundColor:'white',padding:10,borderColor:'orange',borderWidth:1,borderRadius:8, width:225,justifyContent:'center',alignSelf:'center'}}>
                                <Image 
                                    source={imageFindRFConfig[remoteType]}
                                    style={{height:100,width:100, resizeMode:'contain', alignSelf:'center',aspectRatio:2.2}}
                                    />
                            </View>
                            :
                            // <Image source={imageFindRFConfig[remoteType]} style={{aspectRatio: aspectRatio[remoteType], resizeMode:'contain' }} />
                            <View style={{backgroundColor:'white',padding:10,borderColor:'orange',borderWidth:1,borderRadius:8, width:225,justifyContent:'center',alignSelf:'center'}}>
                                <Image 
                                    source={imageFindRFConfig[remoteType]}
                                    style={{height:100,width:100, resizeMode:'contain', alignSelf:'center',aspectRatio:2.2}}
                                    />
                            </View>
                            

                        }
                    </View>
                </View>

                <View style={{ justifyContent: 'center',flex:1, alignItems: 'center', marginBottom: 10, marginTop: 20, backgroundColor: 'tranparent' }}>
                    <Text style={{ fontSize: 16, color: textColor, fontWeight: '400', textAlign: 'center', marginBottom: 15 }}>
                        {pressButtonText[remoteType]}
                    </Text>

                    <View>
                        { remoteType === "receptor" ?
                            // <Image source={imageActionConfig[remoteType]} style={{width:250,height:110, resizeMode:'contain' }} />
                            <View style={{backgroundColor:'white',padding:10,borderColor:'orange',borderWidth:1,borderRadius:8, width:225,justifyContent:'center',alignSelf:'center'}}>
                                <Image 
                                    source={imageActionConfig[remoteType]}
                                    style={{height:100,width:100, resizeMode:'contain', alignSelf:'center',aspectRatio:2.2}}
                                    />
                            </View>
                            :
                            // <Image source={imageActionConfig[remoteType]} style={{aspectRatio: 1.2, height:100,width:100, resizeMode:'contain' }} />
                            <View style={{backgroundColor:'white',padding:10,borderColor:'orange',borderWidth:1,borderRadius:8, width:225,justifyContent:'center',alignSelf:'center'}}>
                                <Image 
                                    source={imageActionConfig[remoteType]}
                                    style={{height:100,width:100, resizeMode:'contain', alignSelf:'center',aspectRatio:2.2}}
                                    />
                            </View>
                        }
                    </View>
                </View>

                {remoteType === "receptor" ?
                    <View style={{ marginTop: 5, marginBottom: 35 }}>
                        <Text style={[styles.text, {color:textColor, marginVertical:2}]}>
                            1 - {t(tns + ":" + "FIVE_SECONDS_PRESS")}
                        </Text>
                        <Text style={[styles.text, {color:textColor, marginVertical:2}]}>
                            2 - {t(tns + ":" + "ONE_IMPULSION")}
                        </Text>
                        <Text style={[styles.text, {color:textColor, marginVertical:2}]}>
                            3 - {t(tns + ":" + "FIVE_SECONDS_PRESS")}
                        </Text>
                    </View>
                    :
                    <View style={{ justifyContent: 'center', alignItems: 'center', marginBottom: 10, marginTop: 20, backgroundColor: 'tranparent' }}>
                        <Text style={{ fontSize: 16, color: textColor, fontWeight: '400', textAlign: 'center' }}>
                            {t(tns + ":" + "SHUTTERS_MAKE_MOVE")}
                        </Text>
                    </View>
                }

            </View>
        )
}

const styles = StyleSheet.create({
    text: {
        fontSize: 16,
        fontWeight: '400',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        flexWrap: 'wrap',
        lineHeight: 20,
        marginVertical: 10
    }
});

