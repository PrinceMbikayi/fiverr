import '_brand/templates/screens/addObject/locales'
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ActivityIndicator, Image, Dimensions } from 'react-native';
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

export const PortableRemoteEquipmentsScreen = () => {


    const pagerRef = useRef(null);
    const currentPageRef = useRef(0)

    const { t, i18n } = useTranslation();
    const tns = "addObject";

    const dispatch = useDispatch();
    const navigation = useNavigation();
    const route = useRoute();
    const navigationParams = route?.params || {};
    const { myBoxDongleId } = navigationParams;
    //const { zigbeeDongleList } = navigationParams;

    const idDongle = myBoxDongleId;
    //const idDongle = zigbeeDongleList?.[zigbeeDongleList?.length - 1];

    console.log("Navigation Params portable :", idDongle)


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
    const borderColor = theme?.prflxBorderColor || 'orange';
    const bgWhitecolor = theme?.prflxContaintBgColor || 'white';
    const bgcolor = theme?.prflxbgColor || 'white';
    const lineWidgetBgColor = theme?.prflxVerticalMultiIconsBgColor || "white";
    const textColor = theme?.prflxTextColor || 'black'

    //-------- Scan for dongle and object type name-------
    const whichDongle = "Zigbee_EZSP" // "Profalux"
    //const whichObjTypeName = "SwitchEzsp"


    const dongleList = useSelector(state => getObjectsByTypeName(state, whichDongle));//Zigbee_EZSP, Profalux

    const loadObjects = useSelector(getLoadedObjects);
    const objectVisible = useSelector(getObjectsVisible)

    // ---------------------

    const myGateWayIdRef = useRef(null);
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
            //const idObj = whichNewObject[whichNewObject.length - 1] 
            let newId;
            if (whichNewObject.length > 1) {
                whichNewObject.map(item => {
                    const itemData = getObjectById(item)
                    console.log('NEW_ADDED_OBJECT_DATA :', itemData);
                    const itemTypeName = itemData?.typeName
                    if (itemTypeName != "RemoteEzsp") {
                        newId = item
                    }
                })
            } else {
                newId = whichNewObject[0]
            }
            setItemId(newId);
            setObjectFound(true)

            const objectData = getObjectById(newId);
            console.log("OBJECT DATA :", objectData?.typeName)
            setTypeName(objectData?.typeName);
            setLoading(false)
            //goNextPage();
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
        if (pagerRef.current) pagerRef.current.setPage(nextIndex);
    }

    const goPage = (index) => {

        //console.log("goPage",index)
        //setCurrentPage(index); 
        const currentPage = allStates.currentPage;

        currentPageRef.current = index;
        updateState({ "currentPage": index })
        if (pagerRef.current) if (pagerRef.current) pagerRef.current.setPage(index);;
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
            goPage(4)
            //pagerRef.current?.setPage(4);
        }

        updateStateDongleRef.current = JSON.stringify(dongleList);


    }, [allStates.currentPage, dongleList]);



    useEffect(() => {
        // Execute when unmounted
        return () => {
            clearTimeout(timerRef.current)
        }
    })

    const openNetwork = async () => {
        const response = await Api.executeAction(idDongle, "APPAIRAGE", { oArgs: [{ name: 'duration', value: 2 }] })
        console.log("RESPONSE :",idDongle, response)
        if (response.errCode == 200) {
            goNextPage()
            setLoading(true)
            timerRef.current = setTimeout(() => {
                setLoading(false)
                setObjectFound(false)
                clearTimeout(timerRef.current);
                console.log("BYE_GOING_PAGE_2", allStates.currentPage)
                goPage(2);

            }, 90000)//90000

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


    const handleStopScan = () => {
        setLoading(false);
        clearTimeout(timerRef.current);
        goNextPage()
    }

    const handleLoadingGoback = () => {
        //setLoading(false);
        setObjectFound(false)
        clearTimeout(timerRef.current);
        goBack();
    }



    const handleRestart = () => {
        navigation.navigate("ZigbeeAssistantHomeScreen")
    }

    const handleEquipWorks = () => {
        //console.log("Handle Equip Works : ")
        setShowModifyScreen(true);
        goNextPage();
    }



    const handleCallBack = () => {
        navigation.dispatch(StackActions.popToTop())
        navigation.navigate("AddObject")
    }

    const goBackFromConnectShutterAction = () => {
        goBack()
        setLoading(false)
        clearTimeout(timerRef.current);
    }



    const RenderLoading = () => {
        return (
            <View style={{ marginTop: 10 }}>
                <Text style={[styles.text, { marginTop: 40, marginBottom: 50 }]}>
                    {t(tns + ":" + "DETECTION_PROCESS")}
                </Text>
                <ActivityIndicator size="large" color='#3E495E' style={{ transform: [{ scaleX: 2 }, { scaleY: 2 }] }} />
                <View style={{ minWidth: 200, marginTop: 30, marginBottom:20}}>
                    <MyButton onPress={handleStopScan} title={t(tns + ":" + "CANCEL")} />
                    <View style={{width:300, height:40}}></View>
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
            >

                <View key='0' style={{ alignItems: 'center', justifyContent: 'flex-start', backgroundColor: 'transparent', paddingTop: 20 }}>
                    <HeaderScreen title={t(tns + ":" + "ADD_EQUIP_PORTABLE_REMOTE")} goBack={() => navigation.navigate("ZigbeeAssistantHomeScreen")} />
                    <Body style={{ marginTop: 0, padding: 15 }}>
                        <Text style={{ fontSize: 16, color: textColor, fontWeight: '400', textAlign: 'center' }}>{t(tns + ":" + "CLIP_REMOTE_SHUTTER_FIND_R_F")}</Text>

                        <View style={{backgroundColor:'white', flex:1,borderColor:borderColor,borderWidth:1, borderRadius:7,padding:5, marginTop:20}}>
                            <Image source={require('_brand/templates/screens/addObject/images/RF.png')} style={{ flex:1, resizeMode:'contain' }} />
                        </View>
                        <View style={{ minWidth: 200, marginTop: 200 }}>
                            <MyButton onPress={openNetwork} title={t(tns + ":" + "VALIDATE")} />
                        </View>
                    </Body>
                </View>

                <View key='1' style={{ alignItems: 'center', justifyContent: 'flex-start', backgroundColor: 'transparent', paddingTop: 20 }}>
                    <HeaderScreen title={t(tns + ":" + "ADD_EQUIP_PORTABLE_REMOTE")} goBack={goBackFromConnectShutterAction} />
                    <Body >
                        <View style={{ justifyContent: 'center', alignItems: 'center', marginBottom: 10, marginTop: 30, backgroundColor: 'tranparent' }}>
                            <Text style={styles.text}>
                                {t(tns + ":" + "CLIP_1R_UP_LEDUP")}
                            </Text>
                        </View>

                        <View style={{backgroundColor:'white', borderColor:borderColor,borderWidth:1, borderRadius:7,padding:5, marginTop:20}}>
                            <Image source={require('_brand/templates/screens/addObject/images/zigbeeRemoteRUp.png')} style={{ resizeMode:'contain' }} />
                        </View>

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
                    <HeaderScreen title={t(tns + ":" + "ADD_EQUIP_PORTABLE_REMOTE")} goBack={handleLoadingGoback} />
                    <Body>
                        {(itemId && typeof (itemId) == "number") ?
                            <View style={{ justifyContent: 'center', alignItems: 'center', width: '80%' }}>
                                <View>
                                    <Text style={[styles.text, { marginTop: 30, marginBottom: 50 }]}>
                                        {t(tns + ":" + "PRESS_REMOTE_UP_DOWN")}
                                    </Text>
                                </View>

                                <View style={{ justifyContent: 'center', alignItems: 'center' }}>

                                    <View style={{ marginTop: 15, backgroundColor: 'transparent', padding: 10 }}>
                                        <CardImageArrow
                                            withNextArrow={false}
                                            imgStyle={{ width: 100, height: 250, marginLeft: 6 }}
                                            imageSource={require('_brand/templates/screens/addObject/images/portableRemote.png')}
                                            innerWidthPercent={'70%'}
                                        />

                                    </View>

                                    <View style={{ width: '100%', marginTop: 10 }}>
                                        <MyButton
                                            onPress={handleEquipWorks}
                                            title={t(tns + ":" + "EQUIP_WORKING")}
                                        />
                                    </View>

                                    <View style={{ width: '100%', marginTop: 20 }}>
                                        <MyButton
                                            onPress={handleRestart}
                                            title={t(tns + ":" + "EQUIP_NOT_WORKING")}
                                        />
                                    </View>
                                </View>
                            </View>
                            :
                            <View style={{ width: width - 5, justifyContent: 'center', alignItems: 'center', marginTop: 150 }}>
                                <Text style={{ fontWeight: '400', fontSize: 16, color: 'red' }}>{t(tns + ":" + "NO_EQUIP_FOUND")} </Text>
                                <View style={{ minWidth: 200, marginTop: 60 }}>
                                    <MyButton onPress={() => navigation.navigate("AddObject")} title={t(tns + ":" + "RETURN")} />
                                </View>
                            </View>

                        }

                    </Body>
                </View>

                <View key="3" style={{ alignItems: 'center', justifyContent: 'flex-start', backgroundColor: 'transparent', paddingTop: 20 }} >
                    <HeaderScreen title={t(tns + ":" + "ADD_EQUIP_PORTABLE_REMOTE")} goBack={handleLoadingGoback} />
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
                            <View style={{ marginTop: 10, width: '90%' }}>
                                <MyButton onPress={handleEquipWorks} title={t(tns + ":" + "EQUIP_WORKING")} />
                            </View>

                            <View style={{ marginTop: 20, width: '90%' }}>
                                <MyButton onPress={handleRestart} title={t(tns + ":" + "EQUIP_NOT_WORKING")} />
                            </View>
                        </View>
                    </Body>
                </View>


                <View key='4' style={{ alignItems: 'center', justifyContent: 'flex-start', backgroundColor: 'transparent', paddingTop: 20 }}>
                    <HeaderScreen title={t(tns + ":" + "ADD_EQUIP_PORTABLE_REMOTE")} goBack={() => { goBack() }} />
                    <Body>
                        {(showModifyScreen && typeof (itemId) == "number") &&
                            <View style={{ width: width - 5 }}>
                                {/* <CommonObjectSettings newAddedItemId={itemId} goHome="MaisonScreen" noHeader={true} /> */}
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
