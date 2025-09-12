import '_brand/templates/screens/addObject/locales'
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ActivityIndicator, Image, Alert} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation, useRoute} from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '_theming/themeProvider';
import Button from '_brand/templates/components/ui/Button';
import { Body } from '_brand/templates/screens/addObject/components/Body';
import { HeaderScreen } from '_brand/templates/screens/addObject/components/HeaderScreen';
import { getObjectsByTypeName, getObjectsVisible, getObjectsByTypes } from '_helpers/selectors';


export const BoxJoiningNetworkLoadingScreen = () => {

    const { t, i18n } = useTranslation();
    const tns = "addObject";

    const navigation = useNavigation(); 
    const route = useRoute();
    const params = route?.params || {};

    const { theme } = useTheme();
    const bgcolor = theme?.prflxbgColor || 'white';
    const textColor = theme?.prflxTextColor || 'black'

    const objectsVisible = useSelector(getObjectsVisible)
    const initialLoadObjectsRef = useRef(JSON.stringify(objectsVisible));
    const updateObjectVisible = useRef(JSON.stringify(objectsVisible));

    const timerRef = useRef(null);

    const [loading, setLoading] = useState(false);
    const [objectFound, setObjectFound] = useState(false)

    useEffect(()=> {
    
    },[objectsVisible]);

    const fireTimer = () => {
        setLoading(true)
        timerRef.current = setTimeout(() => {
            setLoading(false)
            clearTimeout(timerRef.current);
            navigation.navigate("BoxScanResultScreen", params)
        }, 120000)//120 000
    }

    useEffect(()=> {
        fireTimer()
    },[]);

    useEffect(() => {
        console.log("OBJECTS VISIBLE  CHANGES :", objectsVisible)
        const initialLoadObjects = JSON.parse(initialLoadObjectsRef.current)

        const whichNewObject = objectsVisible.filter(x => !initialLoadObjects?.includes(x));
        console.log("OBJECTS VISIBLE  CHANGES 1:", objectsVisible, whichNewObject)

        if (whichNewObject.length != 0) {
            console.log("Here I am new object :", whichNewObject);
            setObjectFound(true)
        }
        updateObjectVisible.current = JSON.stringify(objectsVisible);
        console.log("EVOLUTION OBJECT VISIBLE :", updateObjectVisible.current)
    }, [objectsVisible]);

    const RenderLoading = () => {
        return (
            <View>
                {!objectFound &&
                    <View style={{ marginTop: 0, marginBottom: 15, backgroundColor:'transparent' }}>
                        <Text style={[styles.text,{color:textColor}]}>
                            {t(tns + ":" + "EQUP_IN_SEARCH")}
                        </Text>
                    </View>
                }
                {objectFound &&
                    <View style={{ marginBottom: 50, backgroundColor:'transparent' }}>
                        <Text  style={[styles.text,{color:textColor}]}>
                            {t(tns + ":" + "NETWORK_WITH_EQUIP_FOUND_WAIT")}
                        </Text>
                    </View>
                }

                <View style={{ marginVertical: 20 }}>
                    <ActivityIndicator size="large" color='#3E495E' style={{ transform: [{ scaleX: 2 }, { scaleY: 2 }] }} />
                </View>

                
                {objectFound &&
                    <View style={{ marginTop: 20, marginBottom: 15 }}>
                        <Text  style={[styles.text,{color:textColor}]}>
                            {t(tns + ":" + "LONG_SEARCH")}
                        </Text>
                    </View>
                }
            </View>
        )
    }

    const handleBack = () => {
        clearTimeout(timerRef.current);
        setLoading(false)
        navigation.navigate("RemoteTypeChoiceScreen")
    }
    let titleText = objectFound ? t(tns + ":" + "EQUIP_SEARCH") : t(tns + ":" + "NETWORK_SEARCH");

    return (
        <SafeAreaView>
            <View style={{alignItems: 'center', justifyContent: 'flex-start', backgroundColor: bgcolor, paddingTop: 20 }}>
                <HeaderScreen title={titleText} goBack={handleBack} />
                <Body style={{ marginTop: 50,flex:1, height:"100%", backgroundColor:'transparent'}}>
                    {loading &&
                        <RenderLoading />
                    }
                </Body> 
            </View>
        </SafeAreaView>
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
    },
    validateButton: {
        minWidth: 200,
        height: 50,
        marginTop: 10,
    }
});