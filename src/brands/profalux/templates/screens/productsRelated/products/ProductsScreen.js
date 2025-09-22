import { difference as lodashDifference, pull as lodashPull } from 'lodash';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BackHandler, Platform, StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from "react-redux";

import { useNavigation, useRoute } from '@react-navigation/native';


import { getAllObjects, getObjectsByTypeName, getObjectsByTypes } from '_helpers/selectors';
import { setOrderedList } from '_services/storage';
import { useTheme } from '_theming/themeProvider';
import { SimpleListWithReorder } from './SimpleListWithReorder';

import { deleteStartFromNotification } from '_actions/notificationPush';
import notificationPushManager from '_services/pushNotifications/pushNotificationManager';

import ProductsTemplateScreen from '_brand/templates/screens/productsRelated/products';
import { alphabeticSort } from '_brand/utils/alphabeticSort';
import { getObjectById } from '_helpers/objects';
import { useUser } from '_hooks/useUserHigher';

const ProductsScreen = (props) => {
    
    const { t, i18n } = useTranslation();
    const {theme } = useTheme();
    const dispatch = useDispatch();
    
    const navigation = useNavigation();
    const route = useRoute();
    const navParams = route?.params || {}; 

    const uUser = useUser();
    const {userFavorite} = uUser

    console.log('USER_STORE :', uUser);

    const _listId = "all";    
    const objectsIds = useSelector(getAllObjects);   
    const objectsTypes = useSelector(getObjectsByTypes);
    
    const [objectsVisible, setObjectsVisible] = useState([]);
    const appFocusAddedProduct = useSelector(state => state.app.focusAddedProduct);
   
    const [objectsArray, setObjectsArray] = useState([]);
    const [loadedObjects,setLoadedObjects] = useState([]);
    const [canAddDraggableList,setCanAddDraggableList] = useState(false);    
    const [productJustCreated,setProductJustCreated]  = useState(false);
    const [myFavObjects, setMyFavObjects] = useState([]);
    const startFromPushNotification = useSelector(state => state.notificationPush.fromStart);

    const gateways = useSelector(state =>getObjectsByTypeName(state,"Gateway"));
    console.log("GET_OBJECTS_BY_TYPE_NAME ::: GATEWAYS :", gateways)

    const gatewayFlagRef = useRef(0);

    useEffect(() => {
        console.log("GATEWAYS LIST :", gateways)
        let gatewayList = [];
        let gtwList;
        Array.isArray(gateways) ? gtwList = gateways : gtwList = [gateways]
        console.log("IS GATE WAY PRESENT  :", gateways)
        console.log(" LET'S CHECK IF WE HAVE AN ARRAY OF GATEWAY :", gtwList)
        gtwList.map((gtw)=>{
            const gtwData =  getObjectById(gtw)
            console.log(" GATE WAY DATA :", (gtwData?.realName).slice(0,10))
            if(gtwData?.realName != 'System' && (gtwData?.realName).slice(0,10) !='WebBrowser' && (gtwData?.realName).length == 24 ) gatewayList.push(gtwData?.id)

        })

        console.log("Gate way list to process :", gatewayList)
        console.log("GATEWAT TEST - redirect to box register if none present")
       // console.warn>("OLIVIER BYPASS GATEWAY TEST REMOVE THIS !!!")
       // Alert.alert("remove OLIVIER BYPASS GATEWAY TEST REMOVE THIS !!!")

        // if(gatewayList?.length == 0){
        //     navigation.navigate('RegisterBoxScreen')
        // }
        },[gateways]);


// create a new state : newVisible
    useEffect(() => {       
        const types = objectsTypes;
        console.log("TYPES HHHHHH :", types)
        const RemouveFromVisible = types["Composite"]||[]; 
        const listTypeHarold = ["Shutter", "Light", "WeatherSupport","Sonde","Associations", "TriggerGate"];
        const newVisibles = listTypeHarold.reduce((r,v,i)=>{
            console.log(" JJJJJJJJJ :", v)
          if(types[v]) r.push(...types[v]);
          return r;
        }, [])
        console.log( "Here NEWVISIBLE 2", newVisibles);
        const objectsToShow = newVisibles.filter(x => !RemouveFromVisible?.includes(x));
        setObjectsVisible(objectsToShow);
        console.log("OBJECT TO SHOW XXXX :", objectsToShow)
      }, [objectsTypes]);

    useEffect(() => {        
        const backHandlerSubscription = BackHandler.addEventListener('hardwareBackPress', handleBackPress);
        return () => {
            backHandlerSubscription.remove();
        };
      }, []);

    const handleBackPress =  () => { 
        return navigation.isFocused(); // intercept event  mean no back  
    }



    useEffect(() => {
        if(objectsArray?.length > 0 && startFromPushNotification) {
            if(startFromPushNotification) {
                if(Object.keys(startFromPushNotification).length > 0) {
                }
            }
            if(startFromPushNotification?.origin == "cold-start") {
                    openMe(startFromPushNotification)
            }
       }
    }, [objectsArray]);


    const openMe = (message,comeFrom) => {        
        const datas = (message?.notification) ? message.notification : message;
        let objectEventId;
        if(datas?.data?.object) {
            objectEventId = datas?.data?.object
        }
        // IOS press delayed in Exit Mode
        if(datas?.notification?.ios?.object) {
            objectEventId = datas?.notification?.ios?.object
        }
        //const objectEventId = (Platform.OS == "android") ? datas?.data?.object : datas?.notification?.ios?.object;
        const callerEventName = 'event/io/athome/'+objectEventId+'/';
        const objectId = datas?.data?.objectId;
        let params;
        if(objectEventId) {
            params = {'caller':'VDP','eventName':callerEventName,'objectId':objectId,'sentTime':datas.sentTime,'origin':datas?.origin}
            const imageUrl = (Platform.OS == "ios") ? datas?.notification?.ios?.attachments?.[0] : datas?.data?.image;
            if(imageUrl)params.image = imageUrl;
            
        } else {
            params = {'caller':'generic'}
        }     
        
       
        if(comeFrom != undefined)params["origin"] = comeFrom;
        // console.log("NNNNNXXXXXXX params",params)
        notificationPushManager.redirect(navigation,params);
        // closeMe();
        dispatch(deleteStartFromNotification());

    }

    useEffect(() => {
        //console.log("products >",objectsIds)
        if(objectsIds?.length > 0 && objectsIds != loadedObjects) {           
            setLoadedObjects(objectsIds)            
        }
       

    }, [objectsIds]);

    const handleNavigationEvt = (e) => {          
        const navigationParams = route?.params || {};
        const productJustCreated = navigationParams?.justCreated;
        // console.log("productJustCreated",productJustCreated,appFocusAddedProduct);
    }
    
    useEffect(() => {
        //ATTENTION à enlever sur suppression
        navigation.addListener('didFocus', handleNavigationEvt);
        return (
            navigation.removeListener('didFocus', handleNavigationEvt)
        )
    }, []);
    
    useEffect(() => {       
        // console.log("----")
    }, [startFromPushNotification]);


    useEffect(() => {
    //    console.log("appFocusAddedProduct",appFocusAddedProduct)
       setProductJustCreated(appFocusAddedProduct);
    }, [appFocusAddedProduct]);



    const getIds = async(listId,didis) => {
        const addList = await setOrderedList(listId,didis);
        return addList;
    }

    
    useEffect(() => {
      
        const didis = objectsVisible;     
        
        console.log("Object Visibles in ProductsScreen.js (brand) changed",objectsVisible)




        async function getList(listId,didis) {
            
            // console.log("getList !!!! Products!!!")
            let orderedIds = await getIds("all",didis);
            const removed = lodashDifference(orderedIds,didis); 
            //console.log("removed !!!!!",removed) 
            if(removed.length >0)orderedIds = lodashPull(orderedIds,...removed)         

            const added = lodashDifference(didis,orderedIds)
           
            if(added.length > 0) {
                //orderedIds = orderedIds.concat(added);
                orderedIds = added.concat(orderedIds);
                await setOrderedList(listId,orderedIds);
            }
            setObjectsArray(orderedIds);
            setCanAddDraggableList(true);

            if(orderedIds?.length == 0 && uUser.isLoggedIn) {
                // console.log(("so Go TOOOOOO"))
                //navigation.navigate("AddProduct");
            }
          }
          getList(_listId,didis);       
          
    }, [objectsVisible]);


    const userFavList = userFavorite.map(i=>Number(i));
    //console.log('USER_CONTEXT :', userFavorite);



    useEffect(()=> {

        const sortedUserFavList = alphabeticSort(userFavList)
        console.log('MY_FAV_OBJECTS :', userFavList);
    
    },[userFavList]);

    let content;

    content =(
        <ProductsTemplateScreen>
            <SimpleListWithReorder  source={userFavList}                
                // listId={_listId}
                // productJustAdded={productJustCreated}
                // maintenanceNeeded={1}
            />  
        </ProductsTemplateScreen>
    )

      return (
        <View style={{flex:1,justifyContent:'center', alignItems:'center',}}>
            {content}
        </View>   
   
        )
};

export default ProductsScreen;


const styles = StyleSheet.create({
    validateButton: {
        color:"#FFFFFF",
        borderRadius: 0,
        height: 40,
        marginBottom: 10,
        backgroundColor:'#3E495E',
        width:'50%',
        borderRadius:12,
    },
    text: {
        marginTop:23,
        fontWeight:'400',
        fontSize: 16,
        textAlign:'center',
        color: '#3E495E'
    },
})