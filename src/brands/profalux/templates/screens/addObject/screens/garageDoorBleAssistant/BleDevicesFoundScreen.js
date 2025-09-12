import '_brand/templates/screens/addObject/locales'
import React from 'react';
import { View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '_theming/themeProvider';
import { CardImageArrow } from '_brand/templates/screens/addObject/components/addBoxComponents/CardImageArrow';
import { MyButton } from '_brand/templates/components/ui/MyButton';

export const BleDevicesFoundScreen = (props) => {
    const {devices,onNext, handleEquipmentNotVisible} = props

    const navigation = useNavigation();
    const { t, i18n } = useTranslation();
    const tns = "addObject";
    const { theme } = useTheme();
    const bgcolor = theme?.prflxbgColor || 'white';
    const textColor = theme?.prflxTextColor || 'black'
    console.log('BONN');

    const handleNext = (device) => () => {
        console.log("handleNext called with device:", device);
        onNext(device);
    }

    return (
        <View style={{ backgroundColor: 'transparent', justifyContent: 'space-evenly', alignItems: 'center' }}>
            <Text style={{ fontSize: 16, fontWeight: '400', color: textColor, margin: 10, textAlign:'center' }} >{t(tns + ":" + "FOUND_EQUIPMENTS")}:</Text>
            {devices.map((device, index) => {
                    console.log('Device:', device);
                    const deviceName = device.advertiseName
                    //const deviceName = `${device.name}-${(device.id)?.substr(-5, 6).split(":").join("")}`;
                    //const deviceName = `${device.name} - ${(device.id).slice(0,5).split(":").slice(0,4).join("")}`;
                    console.log('Device_Name:', deviceName, device);
                    return(
                        <>
                            <CardImageArrow
                                key={devices.id}
                                onPressNextArrow={handleNext(device)}
                                withNextArrow={true}
                                imageSource={require('_brand/templates/screens/addObject/images/bleLogo.png')}
                                textDisplay={deviceName}
                                textStyle={{ marginRight: 20, backgroundColor:'transparent' }}
                                imgStyle={{ resizeMode: 'contain', height:40, backgroundColor:'transparent',marginLeft:20  }}
                                label={"garageDoor"}
                            />
                        </>
                    )
                })
            } 

            <View style={{ width: '85%', marginTop: 40}}>
                    <MyButton onPress={handleEquipmentNotVisible} title={t(tns + ":" + "YOUR_EQUIPMENT_NOT_VISIBLE")} />
            </View>
            <View style={{ width: '100%', height:100}}/>
        </View>

    )
};
