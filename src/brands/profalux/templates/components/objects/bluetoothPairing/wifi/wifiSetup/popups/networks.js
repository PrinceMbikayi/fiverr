
import React from 'react';
import {useState} from 'react';
import {View, ScrollView,Text, StyleSheet, ActivityIndicator} from 'react-native';
import {useTranslation} from 'react-i18next';
import ModalContainer from '_brand/templates/components/ui/modal/modalContainer';
import Answers from '_brand/templates/components/forms/radio';
import {H1, H1PopUp, H3, P, VSeparator, IllustrationVSeparator} from '_brand/templates/styled';
import Button from '_brand/templates/components/ui/Button';
//import CircleLoader from '_images/lotties/circleLoader';
import WifiIcon from '_brand/images/icons/app/profaluxIconJs/WifiIcon'
import {EcoCard} from '_brand/templates/components/objects/common/EcoCard'
import { MyButton } from '_brand/templates/components/ui/MyButton';
import {useTheme} from '_theming/themeProvider';



export const FoundNetworks = (props) => {
    const {t} = useTranslation();
    const tns = 'addObject';

    const {theme} = useTheme();
    const bgColor = theme?.prflxbgColor || 'white';
    const textColor = theme?.prflxTextColor || "#3E495E"

    const {networksDatas,  onCancel, onValidate, onCancelWithoutNetwork, waitingResponse, productType} = props;


    const formatNetworks = (networks) => {
        const formattedNetworks = networks.map((network) => {
            return {
                id: network.ssid,
                label: network.ssid,
                value: network.ssid,
                isSelected: false,
            };
        });
        console.log("formattedNetworks",JSON.stringify(formattedNetworks));
        return formattedNetworks;
    }

    const [selectedNetwork, setSelectedNetwork] = useState(null);
    const [networksAsAnswers, setNetworksAsAnswers] = useState(formatNetworks(networksDatas));

   

    const onAnswerSelect = (selectedAnswer) => {
        console.log("onAnswerSelect",selectedAnswer);
        setSelectedNetwork(selectedAnswer);
    }
   


    console.log("FoundNetworks Props",JSON.stringify(props));
    const title = 'WIFI_CHOOSE_NETWORK_POPUP_TITLE'
    const description = 'WIFI_NETWORKS_DISCOVERED';

    const onDoValidate = () => {
        console.log("onDoValidate",selectedNetwork);
        if (selectedNetwork) {
            onValidate(selectedNetwork);
        } else {
            //onCancelWithoutNetwork();
        }
    }

    
    return (
        <ModalContainer>
            <>
                <View style={{marginBottom: 10}}>
                    <Text style={[styles.title,{color:textColor}]}>
                            {t(tns + ':' + title)}
                    </Text>
                </View>
                <View style={{marginBottom: 10}}>
                    <Text style={[styles.text,{color:textColor}]}>
                            {t(tns + ':' + description)}
                    </Text>
                </View>
                <ScrollView style={{height: '60%', marginTop: 24}}>
                    <Answers datas={{answers:networksAsAnswers}} onAnswerSelect={onAnswerSelect} />
                </ScrollView>
                <View style={{flexDirection: 'row', justifyContent:"space-evenly",backgroundColor:'transparent', marginTop: 10}}>
                    {/* <Button title={t('CANCEL')}  noBorder  altStyle  onPress={onCancel}  justWidth  />
                    <Button title={t('VALIDATE')}  altStyle  onPress={onDoValidate} justWidth /> */}
                    <View style={{ width: '30%', marginTop: 0}}>
                        <MyButton onPress={onCancel} title={t(tns + ":" + "CANCEL")} />
                    </View>
                    <View style={{ width: '30%', marginTop: 0}}>
                        <MyButton onPress={onDoValidate} title={t(tns + ":" + "VALIDATE")} />
                    </View>
                </View>
            </>
        </ModalContainer>
    )
}

export const ScanNetworks = (props) => {
    const {t} = useTranslation();
    const tns = 'addObject';

    const {theme} = useTheme();
    const bgColor = theme?.prflxbgColor || 'white';
    const textColor = theme?.prflxTextColor || "#3E495E"

    const {networksDatas, onAnswerSelect, onCancel, onValidate, onCancelWithoutNetwork, waitingResponse, productType} = props;
    const description = 'WIFI_NETWORKS_DISCOVERED'
    return (
        <ModalContainer>
            <>
                <View style={{height:'80%', justifyContent:'center',alignItems:'center'}}>
                    <View style={{marginTop:20}}>
                        <EcoCard titlePart1={t(tns + ":" + "WIFI")} titlePart2={''} fontSize ={14} iconSize={33} Picto={WifiIcon}/>
                    </View>
                    
                    <View style={{marginTop: 20, marginBottom: 50}}>
                        <Text style={[styles.text,{color:textColor}]}>
                             {t(tns + ':' + "WIFI_SCANNING")}
                        </Text>
                    </View>
                    <View style={{marginTop: 0, marginBottom:0}}>
                        <ActivityIndicator size="large" color={textColor} style={{transform: [{scaleX: 2}, {scaleY: 2}]}} />
                    </View>   
                </View>
            </>
        </ModalContainer>
    )
}

const styles = StyleSheet.create({
title:{fontSize: 20, fontWeight: '600', textAlign: 'center'},
  text: {
    fontSize: 16,
    fontWeight: '400',
    marginVertical: 10,
    textAlign: 'center',
  },
});

