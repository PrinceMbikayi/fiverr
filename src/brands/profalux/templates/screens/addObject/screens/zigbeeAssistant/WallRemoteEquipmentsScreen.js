import '_brand/templates/screens/addObject/locales'
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ActivityIndicator, Image, Dimensions, Pressable } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation, useRoute, StackActions } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import PagerView from 'react-native-pager-view';
import { useTheme } from '_theming/themeProvider';
import { MyButton } from '_brand/templates/components/ui/MyButton';
import { Body } from '_brand/templates/screens/addObject/components/Body';
import { TestZigbeeObject } from './components/TestZigbeeObject';
import { HeaderScreen } from '_brand/templates/screens/addObject/components/HeaderScreen';
import { CardImageArrow } from '_brand/templates/screens/addObject/components/addBoxComponents/CardImageArrow';

import { getObjectsByTypeName, getObjectsVisible, getLoadedObjects } from '_helpers/selectors';
import { getObjectById } from '_helpers/objects';
import { Api } from "_api";
import Toast from 'react-native-root-toast';
import { ModifyNewAddedObject } from '_brand/templates/screens/addObject/components/ModifyNewAddedObject';


const width = Dimensions.get('window').width;

export const WallRemoteEquipmentsScreen = () => {


    const pagerRef = useRef(null);
    const currentPageRef = useRef(0)

    const { t, i18n } = useTranslation();
    const tns = "addObject";

    const dispatch = useDispatch();
    const navigation = useNavigation();
    const route = useRoute();
    const navigationParams = route?.params || {};
    const { myBoxDongleId } = navigationParams;

    const idDongle = myBoxDongleId
    console.log("Navigation Params :", idDongle)


    const [allStates, setAllStates] = useState({ currentPage: 0 });
    const [showContent, setShowContent] = useState(false);
    const [showModifyScreen, setShowModifyScreen] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [itemId, setItemId] = useState();
    const [chooseTypeNature, setChooseTypeNature] = useState("")
    const [showTestObject, setShowTestObject] = useState(false);
    const [loading, setLoading] = useState(false);
    const [active, setActive] = useState("");
    const [refresh, setRefresh] = useState(0);
    const [integratedOrDeported, setIntegrateOrDeported] = useState("integrated")
    const [typeName, setTypeName] = useState("");
    const [objectFound, setObjectFound] = useState(false)


    const { theme } = useTheme();
    const testColor = theme?.onBody || 'yellow';
    const borderColor = theme?.prflxBorderColor || 'orange';
    const bgWhitecolor = theme?.prflxContaintBgColor || 'white';
    const bgcolor = theme?.prflxbgColor || 'white';
    const lineWidgetBgColor = theme?.prflxVerticalMultiIconsBgColor || "white";
    const textColor = theme?.prflxTextColor || 'black'

    //-------- Scan for dongle and object type name-------
    const whichDongle = "Zigbee_EZSP" // "Profalux"
    //const whichObjTypeName = "SwitchEzsp"

    const dongleList = useSelector(state => getObjectsByTypeName(state, whichDongle));//Zigbee_EZSP, Profalux
    //const loadShutter868 = useSelector(getObjectsByTypes)[whichObjTypeName] || [];
    //const loadObjects = useSelector(state => getObjectsByTypeName(state, whichObjTypeName));

    const loadObjects = useSelector(getLoadedObjects);
    const objectVisible = useSelector(getObjectsVisible)

    // ---------------------

    //const storeShutter868Ref = useRef(JSON.stringify(loadShutter868));
    const initialLoadObjectsRef = useRef(JSON.stringify(objectVisible));
    const updateStateDongleRef = useRef(JSON.stringify(dongleList));

    let timerRef = useRef(null)





    useEffect(() => {

    }, [loading]);

    useEffect(() => {
        console.log("LoadObject Changes :", loadObjects)
    }, [loadObjects]);

    useEffect(() => {
        console.log("OBJECTS VISIBLE  CHANGES :", objectVisible)
        const initialLoadObjects = JSON.parse(initialLoadObjectsRef.current)

        const whichNewObject = objectVisible.filter(x => !initialLoadObjects?.includes(x));
        console.log("OBJECTS VISIBLE  CHANGES 1:", objectVisible, whichNewObject)

        if (whichNewObject.length != 0) {
            console.log("Here I am new object :", whichNewObject);
            const idObj = whichNewObject[whichNewObject.length - 1]
            setItemId(idObj);
            setObjectFound(true)

            const objectData = getObjectById(idObj);
            console.log("OBJECT DATA :", objectData?.typeName)
            setTypeName(objectData?.typeName);
            setLoading(false)
            goPage(2);
            clearTimeout(timerRef.current); // If id is caught in time, stop interval time out
        }
    }, [objectVisible]);

    useEffect(() => {

    }, [objectFound]);

    useEffect(() => {

    }, [typeName]);

    useEffect(() => {

    }, [showModifyScreen]);

    useEffect(() => {
        // const objectData = itemId ? getObjectById(itemId) : null;
        // console.log("OBJECT DATA :", objectData?.typeName)
    }, [itemId]);

    ////####----------Begin managing Pager View navigation

    console.log("currentPage changed", allStates.currentPage)

    const updateState = (newStates) => {
        setAllStates({ allStates, ...newStates });
    }

    const goBack = (index) => {
        //console.log("currentPage=",allStates.currentPage,currentPageRef.current)

        const nextIndex = currentPageRef.current - 1;
        currentPageRef.current = nextIndex;
        if (nextIndex < 0) {
            navigation.goBack();
        } else {
            updateState({ 'currentPage': nextIndex });
            pagerRef.current.setPage(nextIndex);
        }

    };

    const goNextPage = () => {

        const currentPage = allStates.currentPage;

        const nextIndex = currentPage + 1;
        updateState({ "currentPage": nextIndex })
        pagerRef.current.setPage(nextIndex);
    }

    const goPage = (index) => {

        //console.log("goPage",index)
        //setCurrentPage(index); 
        const currentPage = allStates.currentPage;

        currentPageRef.current = index;
        updateState({ "currentPage": index })
        if (pagerRef.current) pagerRef.current.setPage(index);;
    }

    const onPageSelected = (e) => {

        const position = e.nativeEvent.position;
        const index = updateState({ "currentPage": position })
        currentPageRef.current = position;
    }

    ////####-------------End managing Pager View navigation


    useEffect(() => {
        //console.log("currentPage changed",allStates.currentPage)
        const myDongle = JSON.parse(updateStateDongleRef.current);
        if (allStates.currentPage == 1) {
            //setLoading(true)
        }

        if (allStates.currentPage == 4) {
            setRefresh(prevKey => prevKey + 1)
            pagerRef.current?.setPage(4);
        }

        updateStateDongleRef.current = JSON.stringify(dongleList);


    }, [allStates.currentPage, dongleList]);




    const loadingRef = useRef(false)


    const openNetwork = async () => {
        const response = await Api.executeAction(idDongle, "APPAIRAGE", { oArgs: [{ name: 'duration', value: 2 }] })
        console.log("RESPONSE :", response)
        if (response.errCode == 200) {
            goNextPage()
            setLoading(true)
            timerRef.current = setTimeout(() => {
                setLoading(false)
                setObjectFound(false)
                clearTimeout(timerRef.current);
                goPage(2);

            }, 90000)

        } else {
            Toast.show(
                "Server not reachable !",
                {
                    backgroundColor: 'black',
                    textColor: 'white',
                    textStyle: { fontSize: 16, fontWeight: '600' },
                    containerStyle: { width: '80%', height: 100, justifyContent: 'center', alignItems: 'center', borderRadius: 10, borderColor: borderColor, borderWidth: 2 },
                    //position: Toast.positions.CENTER,
                    position: -350,
                    duration: 1000,
                    onHide: () => { }
                }
            );
        }
    }

    const handleValidateScan = async () => {
        console.log("APPAIRAGE DONGLE ZIGBEE :", idDongle)

        console.log("LOADING :", loading)
        // Scan opened :
        setLoading(true)
        const initialLoadObjects = JSON.parse(initialLoadObjectsRef.current)
        let intervalCounter = 1;

        timerRef.current = setTimeout(() => {
            console.log("ENNNNDD Timeout")
            setObjectFound(false)
            setLoading(false)
            goNextPage();
            clearTimeout(timerRef.current);
        }, 90000)

        // const interval = setInterval(() => {
        //     //const whichNewObject = [17173]//light[472] plug[15593]// shade[8289];
        //     const whichNewObject = objectVisible.filter(x => !initialLoadObjects?.includes(x));
        //     console.log("OBJECTS VISIBLE  CHANGES 1:", objectVisible, whichNewObject)
        //     if (whichNewObject.length != 0 && intervalCounter <= 3) {
        //         console.log("Here I am new object :", intervalCounter, whichNewObject);
        //         const idObj = whichNewObject[whichNewObject.length - 1] 
        //         setItemId(idObj);

        //         const objectData = getObjectById(idObj);
        //         console.log("OBJECT DATA :", objectData?.typeName)
        //         setTypeName(objectData?.typeName);

        //         clearInterval(interval); // If id is caught in time, stop interval time out
        //         setLoading(false)
        //         goNextPage();
        //     } else {
        //         // increment intervalConter
        //         if (intervalCounter > 2) {
        //             clearInterval(interval); // If id is caught in time, stop interval time out
        //             setLoading(false)
        //             console.log("Here I am new object :", intervalCounter, whichNewObject);
        //             goNextPage();
        //         } else {
        //             console.log("Here I am new object :", intervalCounter, whichNewObject);
        //             intervalCounter = intervalCounter + 1;
        //         }
        //     }
        // }, 30000);

    }

    const handleStopScan = () => {
        setLoading(false);
        goNextPage()
    }

    const handleLoadingGoback = () => {
        //setLoading(false);
        setObjectFound(false)
        goBack();
    }

    const handlePress = (item) => {
        //console.log("Yo id :", item)
        let typeNameChoise;
        if (item == "vr") {
            setChooseTypeNature("vr");
            //setChooseTypeNature("Rolling_Shutter_Ezsp");
            setActive(!active)
        }
        if (item == "store") setChooseTypeNature("store");//setChooseTypeNature("Shade_Ezsp");
        if (item == "bso") setChooseTypeNature("bso");//setChooseTypeNature("SwitchEzsp");
    }

    const handleValidatePairing = async () => {
        goPage(4);
        const response = await Api.executeAction(idDongle, "APPAIRAGE", { oArgs: [{ name: 'duration', value: 1 }] })
        console.log("RESPONSE :", response)
        //uDongle.execute("APPAIRAGE", { oArgs: [{ name: 'duration', value: 1 }] });
        setIsPlaying(true);
    }



    const onTimerComplete = () => {
        if (allStates.currentPage == 4) {
            //const initialShutter868List = JSON.parse(storeShutter868Ref.current)
            const initialLoadObjects = JSON.parse(initialLoadObjectsRef.current)

            //const whichNewObject = loadShutter868.filter(x => !initialShutter868List?.includes(x));
            const whichNewObject = loadObjects.filter(x => !initialLoadObjects?.includes(x));
            //console.log("WHICH OBJECT :", whichNewObject)
            goPage(5)
            if (whichNewObject.length != 0) {
                //console.log("Here I am new object :", whichNewObject);
                const idObj = whichNewObject[whichNewObject.length - 1]
                setItemId(idObj);
            } else {
                //console.log(" NO new Object found :", initialShutter868List, loadShutter868)
                //console.log("Show Test Object :", showTestObject) 
            }
        }
    }


    const handleRestart = () => {
        navigation.navigate("ZigbeeAssistantHomeScreen")
    }

    const handleEquipWorks = () => {
        //console.log("Handle Equip Works : ")
        setShowModifyScreen(true);
        // uObject?.addStatus("__user_typeNature",chooseTypeNature);
        // uObject?.updateStatus('__user_typeNature',chooseTypeNature);
        goNextPage();
    }


    const handleValidateDetection = () => {
        goNextPage()
    }



    const handleCallBack = () => {
        navigation.dispatch(StackActions.popToTop())
        navigation.navigate("AddObject")
    }

    const RenderLoading = () => {
        return (
            <View style={{ marginTop: 10 }}>
                <Text style={[styles.text, { marginTop: 40, marginBottom: 50 }]}>
                    {t(tns + ":" + "DETECTION_PROCESS")}
                </Text>
                <ActivityIndicator size="large" color='#3E495E' style={{ transform: [{ scaleX: 2 }, { scaleY: 2 }] }} />
                <View style={{ minWidth: 200, marginTop: 30 }}>
                    <MyButton onPress={handleStopScan} title={t(tns + ":" + "CANCEL")} />
                </View>
            </View>
        )
    }


    return (
        <SafeAreaView style={{ height: '100%', backgroundColor: 'transparent' }}>

            <PagerView
                style={[{ flex: 1, backgroundColor: bgcolor }]}
                ref={pagerRef}
                initialPage={0}
                scrollEnabled={false}
                onPageSelected={onPageSelected}
            // onPageScroll={(e) => console.log(e)}
            //onPageScrollStateChanged={(e) => console.log(e)}
            >

                <View key='0' style={{ alignItems: 'center', justifyContent: 'flex-start', backgroundColor: 'transparent', paddingTop: 20 }}>
                    <HeaderScreen title={t(tns + ":" + "ADD_EQUIP_WALL_REMOTE")} goBack={() => navigation.navigate("ZigbeeAssistantHomeScreen")} />
                    <Body style={{ marginTop: 0, padding: 15, backgroundColor:'red' }}>
                        <Text style={{ fontSize: 16, color: textColor, fontWeight: '400', textAlign: 'center' }}>{t(tns + ":" + "CLIP_REMOTE_SHUTTER_FIND_R_F")}</Text>
                        <View>

                            <View style={{ marginTop: 45 }}>
                                <Image source={require('_brand/templates/screens/addObject/images/wallRemote-RF.png')} style={{ width: 200, height: 121 }} />
                            </View>

                        </View>
                        <View style={{ minWidth: 200, marginTop: 200 }}>
                            <MyButton onPress={openNetwork} title={t(tns + ":" + "VALIDATE")} />
                        </View>
                    </Body>
                </View>

                <View key='1' style={{ alignItems: 'center', justifyContent: 'flex-start', backgroundColor: 'transparent', paddingTop: 20 }}>
                    <HeaderScreen title={t(tns + ":" + "ADD_EQUIP_WALL_REMOTE")} goBack={() => { goBack(); loadingRef.current = false }} />
                    <Body style={{backgroundColor:'red'}}>
                        <View style={{ justifyContent: 'center', alignItems: 'center', marginBottom: 10, marginTop: 30, width: 332, minHeight: 132, backgroundColor: 'transparent' }}>
                            <Text style={styles.text}>
                                {t(tns + ":" + "CLIP_1R_UP_LEDUP")}
                            </Text>
                        </View>
                        <CardImageArrow
                            withNextArrow={false}
                            imgStyle={{ width: 190, height: 100 }}
                            imageSource={require('_brand/templates/screens/addObject/images/wallRemote-1xR-up.png')}
                            innerWidthPercent={'70%'}
                        />
                        <Text style={styles.text}>
                            {t(tns + ":" + "EQUIPS_MOVE_LIGHT_UP")}
                        </Text>

                        {loading ?
                            <RenderLoading />
                            :
                            <></>
                        }

                    </Body>
                </View>

                <View key="2" style={{ alignItems: 'center', justifyContent: 'flex-start', backgroundColor: 'transparent', paddingTop: 20 }} >
                    <HeaderScreen title={t(tns + ":" + "ADD_EQUIP_WALL_REMOTE")} goBack={handleLoadingGoback} />
                    <Body>
                        {(itemId && typeof (itemId) == "number") ?
                            <View style={{ justifyContent: 'center', alignItems: 'center', width: '80%' }}>
                                <Text style={[styles.text, { marginTop: 30 }]}>
                                    {t(tns + ":" + "PRESS_REMOTE_UP_DOWN")}
                                </Text>
                                <View style={{ marginTop: 15, justifyContent: 'center', alignItems: 'center' }}>
                                    <Image source={require('_brand/templates/screens/addObject/images/wallRemote-bordered.png')} style={{ width: 223, height: 230 }} />
                                </View>

                                <View style={{ width: '100%', marginTop: 10 }}>
                                    <MyButton
                                        onPress={handleEquipWorks}
                                        title={t(tns + ":" + "EQUIP_WORKING")}
                                    />
                                </View>

                                <View style={{ width: '100%', marginTop: 50 }}>
                                    <MyButton
                                        onPress={handleRestart}
                                        title={t(tns + ":" + "EQUIP_NOT_WORKING")}
                                    />
                                </View>
                            </View>
                            :
                            <View style={{ width: width - 5, justifyContent: 'center', alignItems: 'center', marginTop: 150 }}>
                                <Text style={{ fontWeight: '400', fontSize: 16, color: 'red' }}>{t(tns + ":" + "NO_EQUIP_FOUND")}</Text>
                                <View style={{ minWidth: 200, marginTop: 60 }}>
                                    <MyButton onPress={() => navigation.navigate("AddObject")} title={t(tns + ":" + "RETURN")} />
                                </View>
                            </View>

                        }

                    </Body>
                </View>

                <View key="3" style={{ alignItems: 'center', justifyContent: 'flex-start', backgroundColor: 'transparent', paddingTop: 20 }} >
                    <HeaderScreen title={t(tns + ":" + "ADD_EQUIP_WALL_REMOTE")} goBack={handleLoadingGoback} />
                    <Body>
                        <View style={{ justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                            <Text style={[styles.text, { marginTop: 30 }]}>
                                {t(tns + ":" + "CHECK_EQUIP_WORKS")}
                            </Text>
                            <View style={{ marginTop: 25, width: '90%' }}>
                                {typeof (itemId) == "number" &&
                                    <TestZigbeeObject itemId={itemId} typeNature={typeName} />
                                }
                            </View>

                            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <View style={{ marginTop: 10, width: '90%' }}>
                                    <MyButton onPress={handleEquipWorks} title={t(tns + ":" + "EQUIP_WORKING")} />
                                </View>

                                <View style={{ marginTop: 20, width: '90%' }}>
                                    <MyButton onPress={handleRestart} title={t(tns + ":" + "EQUIP_NOT_WORKING")} />
                                </View>


                            </View>
                        </View>
                    </Body>
                </View>


                <View key='4' style={{ alignItems: 'center', justifyContent: 'flex-start', backgroundColor: 'transparent', paddingTop: 20 }}>
                    <HeaderScreen title={t(tns + ":" + "ADD_EQUIP_WALL_REMOTE")} goBack={() => { goBack() }} />
                    <Body>
                        {(showModifyScreen && typeof (itemId) == "number") &&
                            <View style={{ width: width - 5 }}>
                                <ModifyNewAddedObject itemId={itemId} callBackSetPage={handleCallBack} />
                            </View>
                        }
                    </Body>
                </View>

            </PagerView>
        </SafeAreaView>

    )
};


const styles = StyleSheet.create({

    text: {
        fontSize: 16,
        fontWeight: '400',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        flexWrap: 'wrap',
        lineHeight: 20,
        marginVertical: 10,
        color: '#3E495E'
    },
    validateButton: {
        minWidth: 200,
        height: 50,
        marginTop: 50,
    }
});
