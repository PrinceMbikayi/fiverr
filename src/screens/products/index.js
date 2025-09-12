import React from 'react';
import {useContext,useState,useEffect, useRef} from 'react';
import {SafeAreaView,Alert,Text, Platform,BackHandler} from 'react-native';
import {useSelector,useDispatch} from "react-redux";
import { useTranslation } from 'react-i18next';
import {difference as lodashDifference, pull as lodashPull} from 'lodash';

import { useNavigation,useRoute } from '@react-navigation/native';

import { useTheme} from '_theming/themeProvider'
import { HeaderWithMenu } from '_components/headers/header-with-menu';
import { SimpleListWithReorder} from '../templates/SimpleListWithReorder';
import {getOrderedList,setOrderedList} from '_services/storage';
import {getAllObjects,getObjectsVisible,getObjectsByTypeName,getObjectById,getWidgetReference,getObjectRuntimeDatas,getUser, getObjectsByTypes, getObjectsByType} from '_helpers/selectors';

//import {checkStartFromPushNotification} from '_services/pushNotifications/myPushNotifications';
import { deleteStartFromNotification } from '_actions/notificationPush';
import notificationPushManager from '_services/pushNotifications/pushNotificationManager';
import {AutomatedTestIdDisplay} from '_components/objects/@common/testAutomation/AutomatedTestId';

import ProductsTemplateScreen from '_brand/templates/screens/productsRelated/products';
import { useUser } from '_hooks/useUserHigher';
import { useObject } from '_hooks/object';

const ProductsScreen = (props) => {
    
    const { t, i18n } = useTranslation();
    const {theme } = useTheme();
    const dispatch = useDispatch();
    
    const navigation = useNavigation();
    const route = useRoute();
    const navParams = route?.params || {}; 

    // console.log("ProductsScreen route,navParams , props ===>",route,navParams,"props",props)

    const uUser = useUser();
    const {isLoggedIn} = uUser

    const realyU = useSelector(state =>getUser(state));

    const isFocused = navigation.isFocused();  
    const _listId = "all";    
    const objectsIds = useSelector(getAllObjects);   
    //const objectsVisible = useSelector(getObjectsVisible);
   //const objectsVisible = useSelector(getObjectsByTypes)["Light"];
    const objectsTypes = useSelector(getObjectsByTypes);
    const [objectsVisible, setObjectsVisible] = useState([]);
    const appFocusAddedProduct = useSelector(state => state.app.focusAddedProduct);
   
    const [objectsArray, setObjectsArray] = useState([]);
    const [loadedObjects,setLoadedObjects] = useState([]);
    const [canAddDraggableList,setCanAddDraggableList] = useState(false);    
    const [productJustCreated,setProductJustCreated]  = useState(false);
    const startFromPushNotification = useSelector(state => state.notificationPush.fromStart);


// create a new state : newVisible
    useEffect(() => {       
        const types = objectsTypes;

        // Avoid showing group objects in Product Screen
        const RemouveFromVisible = types["Composite"]||[]; 
        //const listTypeHarold = [ "Weather", "Light","Rolling_Shutter"];
        const listTypeHarold = ["Shutter", "Light"];
        const newVisibles = listTypeHarold.reduce((r,v,i)=>{
          if(types[v]) r.push(...types[v]);
          return r;
        }, [])
        //console.log( "Here NEWVISIBLE 2", newVisibles);
        const objectsToShow = newVisibles.filter(x => !RemouveFromVisible?.includes(x));
        setObjectsVisible(objectsToShow);
      }, [objectsTypes]);

    useEffect(() => {        
        BackHandler.addEventListener('hardwareBackPress', handleBackPress);
        return () => {
            BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
            //console.log("je suis retiré")
        };
      }, []);

    const handleBackPress =  () => { 
        //console.log(navigation,navigation.isFocused())
        return navigation.isFocused(); // intercept event  mean no back  
    }



    useEffect(() => {
        // console.log("objectsArray,startFromPushNotification",objectsArray,startFromPushNotification);
       
        if(objectsArray?.length > 0 && startFromPushNotification) {
            // console.log("startFromPushNotification ---------> NNNNNNN",startFromPushNotification)
            if(startFromPushNotification) {
                if(Object.keys(startFromPushNotification).length > 0) {
                    //notificationPushManager.redirect(navigation,{...startFromPushNotification})
                    //checkStartFromPushNotification({...startFromPushNotification})    
                }
            }
            if(startFromPushNotification?.origin == "cold-start") {
                    // console.log("startFromPushNotification yeah",startFromPushNotification);
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




    useEffect(() => {
      
        const didis = objectsVisible;        
        async function getList(listId,didis) {
            
            // console.log("getList !!!! Products!!!")
            let orderedIds = await getIds("all",didis);
//console.log("Harold orderedIds",orderedIds);
            //console.log("DIDIS : ", didis);
            // removed items ?
            const removed = lodashDifference(orderedIds,didis); 
            //console.log("removed !!!!!",removed) 
            if(removed.length >0)orderedIds = lodashPull(orderedIds,...removed)         
            //added items ?
            const added = lodashDifference(didis,orderedIds)
            //console.log("added !!!!!",added)
           
            if(added.length > 0) {
                //orderedIds = orderedIds.concat(added);
                orderedIds = added.concat(orderedIds);
                await setOrderedList(listId,orderedIds);
            }
            setObjectsArray(orderedIds);
            setCanAddDraggableList(true);


            // Test if no Visible Objects
            // console.log("UUUUUUU loggedIn",isLoggedIn);
            // console.log("----> useUser.isLoggedIn",isLoggedIn,uUser.unique);

            // console.log('realyU',JSON.parse(JSON.stringify(realyU)));

            if(orderedIds?.length == 0 && isLoggedIn) {
                // console.log(("so Go TOOOOOO"))
                //navigation.navigate("AddProduct");
            }
          }
          getList(_listId,didis);       
          
    }, [objectsVisible]);

    useEffect(() => {
        // console.log("realyU 22222 .loggedIn Changed",JSON.parse(JSON.stringify(realyU)))

          
    }, [realyU]);

    // const  getFamilyProducts = (type) => {
    //     const showTypes = athomeFamilyTypes[type];  
    //     const typesAllowed = (showTypes == undefined || showTypes.length == 0) ? [] : showTypes;
    //     const retVal = typesAllowed.reduce(function(r,v,i){          
    //         const addThat = objectsState.objects.objectsByTypeNames[v];           
    //         if(addThat == undefined) return r;           
    //         r.push(...addThat);
    //         return r;           
    //       },[]);

    //       // if heater add application thermostat
    //       let addApplicationIds = []
    //       if(type == "HEATER" ) {
    //           //console.log("objectsState.objects.objectsByTypeNames",objectsState.objects.objectsByTypeNames)
    //         const applications = objectsState.objects.objectsByTypeNames['application']
    //         if(applications && applications.length > 0) {
    //             //console.log("applications",applications)
    //             addApplicationIds = applications.reduce((r,v,i) => {
    //                 const toTest = objectsState.objects.entities.objects[v];
    //                 if(toTest == undefined)return r
    //                 //console.log("toTest",toTest)
    //                 if(toTest.statusDictionary && toTest.statusDictionary.__app_id && toTest.statusDictionary.__app_id == "athome_thermostat")r.push(v)
    //                 return r;
    //             },[])
    //         }


    //       }

    //     const ids = [...retVal,...addApplicationIds];
    //     return ids;
    // }


    const getIds = async(listId,didis) => {
        // const list = await getOrderedList(listId);       
        // if(list.length > 0) return list
        // ======    
       // return didis;  
        const addList = await setOrderedList(listId,didis);
        return addList;
    }



    const elementId = objectsArray[3];
    //const He = useObject(elementId);
    //console.log("Harold Product list", elementId);

   //const shutterObjectAllInfos = useObject(108228);
    //console.log("Object infos",shutterObjectAllInfos);
    

      const accessibilityLabel = "Screen_DASHBOARD";

      return (
        <ProductsTemplateScreen>
          <SimpleListWithReorder  source={objectsArray}                
                                    listId={_listId}
                                    productJustAdded={productJustCreated}
                                    maintenanceNeeded={1}
            />        
        </ProductsTemplateScreen>   
   
        )
};

export default ProductsScreen;