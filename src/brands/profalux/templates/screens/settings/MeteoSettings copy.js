import "_brand/templates/screens/settings/locales"
import React from 'react';
import {useState,useRef,useEffect} from 'react';
import { useStore,useSelector,useDispatch} from 'react-redux';
import { ScrollView,View, Text,SafeAreaView, StyleSheet, Alert,KeyboardAvoidingView} from 'react-native';
import styled from 'styled-components/native';
import { useTranslation } from 'react-i18next';
import { useNavigation,useRoute } from '@react-navigation/native';
import {getKey,setKey} from '_services/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getObjectById} from '_helpers/objects';
import { useUser } from '_hooks/useUserHigher';



import { useTheme } from '_theming/themeProvider';
import * as Actions from '_actions/objects';
import { Api } from '_api';
import SearchList from './searchList';
import { HeaderWithBack } from '_brand/templates/components/headers/header-with-back';
import Button from '_brand/templates/components/ui/Button';
import { deleteObject } from '_api/objects';
import Toast from 'react-native-root-toast';
import {userSetPref} from '_actions/user';
import {getPreferences, setUserDefinedPreferences} from '_api/user'
import { getUser, getUserDefaultWeather, getObjectsByTypeName} from '_helpers/selectors';
import { WeatherSettingDetails } from "./WeatherSettingDetails";
import { refreshObjectAction } from '_actions/asyncActions';
import { myToast } from '_brand/templates/components/ui/myToast';
import * as ApiObjects from "_api/objects"
import {appRefresh} from '_actions/app';



export const MeteoSettings = (props)=>{
   

    const { t, i18n } = useTranslation(); 
    const tns = "settings";

    const dispatch = useDispatch();
    const navigation = useNavigation();
    const route = useRoute();
    const store = useStore()
    const navigationParams = route?.params || {}; 
    const uUser = useUser()

    const {userPrefWeather, updateUserPrefWeather} = uUser


    const userDetails = useSelector(state =>getUser(state));
    console.log("USER :", uUser)
    const {theme} = useTheme();
    const testColor = theme?.onBody||'yellow';
    const borderColor = theme?.prflxBorderColor||'orange';
    const bgWhitecolor = theme?.prflxContaintBgColor||'white';
    const bgColor = theme?.prflxbgColor||'white';
    const lineWidgetBgColor = theme?.prflxVerticalMultiIconsBgColor||"white";
    const textColor = theme?.prflxTextColor||'black'
    const headerBgColor = theme?.prflxHeaderBackground || 'white';
   
    
    
    const [progress,setProgress] = useState('start')
    const [country,setCountry] = useState('FR');
    const [countriesVisible,setCountriesVisible] = useState(false)
    const [selection,setSelection] = useState(null)
    const [townSelected, setTownSelected] = useState(false);
    //const [userFavWeather, setUserFavWeather] = useState(weathers[0])


    const userDefaultWeather = useSelector(state =>getUserDefaultWeather(state)) || -1;
    const weathers = useSelector(state => getObjectsByTypeName(state, 'WeatherSupport') || []);
    

    console.log("WEATHER_DEFAULT_INIT :", userDefaultWeather)


    useEffect(()=> {
        
    },[townSelected]);

    useEffect(()=> {
        console.log("WEATHER_DEFAULT_CHANGED :", userDefaultWeather)
        //setUserWeather(userDefaultWeather)
    },[userDefaultWeather]);

    useEffect(()=> {
        console.log('userPrefWeather :', userPrefWeather);
    },[]);



    // searchBar on select method
    const onSelect = (selection) => {
        console.log("SELECT :", selection)
        setProgress("selected");
        setSelection(selection)
    }

    const cleanTasks = async(data)=>{
        const objects = data?.objects
        const plannerId = data?.plannerId

        // await objects.reduce(async (acc, item, index) => {

        //     const objectInUsed = Number(item?.objectId)
        //     const tasksInUsed = item?.tasks
        //     await acc;
        //     const result = await deleteObject(id).catch((err) => { console.log(err) });
        //     if(result?.errCode == 200){
        //         const action = Actions.objectDelete(id);    
        //         dispatch(action)
        //     }
        //     console.log("CREATE_REQUEST_1",idx, ":",  res)
        // }, Promise.resolve())
    }

    const buildActionForRemoveObjectTask = (plannerObjects)=>{
        const myAction = plannerObjects.reduce((acc, obj)=>{
            const objectId = obj?.objectId
            const tasks = obj?.tasks // array of tasks

            // Go retrieve specific tasks ids 
            const individualAction = tasks.reduce((mArgsAcc, currentTask)=>{
                const usedObject = {"name":"objectId", value:objectId}
                const usedTask = {"name":"taskId", value:currentTask?.taskId} // sourceID = weather object
                const objAction = {
                                name:"REMOVE_OBJECT_TASK", // REMOVE_OBJECT_SOURCE
                                mArgs:[usedObject,usedTask]
                            }
                mArgsAcc.push(objAction)
                return mArgsAcc;
            }, [])
            //console.log('SEE :',JSON.stringify(individualAction));

            acc.push(...individualAction)
            return acc

           }, [])

           return myAction
    }


    // const removeWeatherRelatedTasks = async(actions) =>{
    //    const res =  await actions.reduce(async(accumulator, action, index)=>{
    //         await accumulator;
    //         const removeTaskResponse = await ApiObjects.createWeeklyPlanner(action).catch((err) => { console.log(err) });;
    //         console.log('REPONSE_SERVEUR_'+index + ":", removeTaskResponse);
    //     }, Promise.resolve())
    // }

    const handleOKAlert = async() =>{
            const weatherInfos = getObjectById(userDefaultWeather)
            console.log('Weather_infos :', weatherInfos);
            
            const plannerWeatherInfos = weatherInfos?.planner_weather_infos
            //console.log('Planner_Weather_infos :', plannerWeatherInfos);
            
            const plannerObjects = plannerWeatherInfos?.objects
            console.log('Planner_Objects :', plannerObjects);

            if(plannerObjects == undefined ){
                const response = await create(selection.text,selection.id);
                console.log('RES_CREATE_NEW_WEATHER_1 :', response);
                navigation.goBack()
            }else{

                console.log('POINT_1');
                const myActions = buildActionForRemoveObjectTask(plannerObjects)
                console.log('MY_ACTION :',JSON.stringify(myActions));

                //Cleaned Tasks before creating new weather object
                let plannerId;
                let daysOfWeek;
                await myActions.reduce(async(accumulator, action, index)=>{
                    await accumulator;
                    const removeTaskResponse = await ApiObjects.createWeeklyPlanner(action).catch((err) => { console.log(err) });
                    console.log('REPONSE_SERVEUR_'+index + ":", removeTaskResponse);
                    if(removeTaskResponse.errCode == 200){
                        plannerId = removeTaskResponse.id;
                        daysOfWeek = removeTaskResponse?.res?.data?.resource?.daysOfWeek
                        //refreshObjectAction(routineId, store).catch((err) => console.log(err));
                    }
                    //console.log('DAYS_OF_WEEK_' + index + ":", daysOfWeek);

                }, Promise.resolve())

                // Refresh WeeklyPlanner "daysOfWeek" attribute
                const actionRefresh = Actions.objectUpdateProperty(plannerId, 'daysOfWeek', daysOfWeek);
                console.log("DAYS_OF_WEEK_REFRESH :", actionRefresh)
                dispatch(actionRefresh);
                

                // After all tasks are deleted, we can now fire the creation of new weather
                const response = await create(selection.text,selection.id);
                console.log('RES_CREATE_NEW_WEATHER :', response);

                if(response?.errCode == 200){
                    dispatch(appRefresh());
                    navigation.goBack()
                }

            }


    }



    const createWeatherCallback = async()=>{
        if(selection != null){
            Alert.alert(
                '',
                `${t(tns + ":" + "DEPEND_WEATHER_ROUTINE_WILL_BE_DELETED")}`, [
                {
                  text: `${t(tns + ":" + "CANCEL")}`,
                  onPress: () => console.log('Cancel Pressed'),
                  style: 'cancel',
                },
                {text: `${t(tns + ":" + "VALIDATE")}`, onPress: () => handleOKAlert()},
              ]);

        }else{
            const message =  `${t(tns + ":" + "CHOOSE_WEATHER_TOWN")}`
            myToast(message)
        }
    }



    const creationProcess = async(name, id)=>{
        try {
            res = await Api.createWeatherObject(name,id);
        } catch (e) {           
            console.log(e);            
        } finally {
            console.log('We do cleanup here');
        }

        console.log("création objet ",res)  
        if(res != undefined) {
            if(res.errCode ){
                if(res.errCode == 200) {
                    await updateUserPrefWeather(res.id)
                    setProgress("created");                
                } else {        
                    if(res.errMsg == "object_exists") {
                        setProgress("exists")
                    } else {
                        setProgress("error")
                    }                    
                }
            } 
        }
        return res;
    }


    const create = async(name,id) => {
        let createrequest;
        // Delete all weathers 
        if(weathers.length > 0){
            await weathers.reduce(async (acc, id, idx) => {
                    const weatherInfos = getObjectById(id)
                    console.log('INFOS_METEO :', weatherInfos);
                    await acc;
                    const result = await deleteObject(id).catch((err) => { console.log(err) });
                    if(result?.errCode == 200){
                        const action = Actions.objectDelete(id);    
                        dispatch(action)
                    }
                    console.log("CREATE_REQUEST_1",idx, ":",  res)
                }, Promise.resolve())
                console.log('CREATE_REQUEST_2 :');

            // This will wait on delete process to complete before firing the creation Process
            createrequest = await  creationProcess(name,id).catch((err) => { console.log(err) })
            console.log('CREATE_REQUEST_3 :', createrequest);
        }else{
            createrequest = await  creationProcess(name,id).catch((err) => { console.log(err) })
            console.log('CREATE_REQUEST_4 :', createrequest);
        }

        return createrequest;
    }


    const goBack = () => {

        navigation.goBack();
    }




    const RenderSearchBarComponent = ()=>{
        return(
            <View style={{width:'100%', height:'100%', backgroundColor:'transparent', borderRadius:12,}}>
                <SearchList 
                    endpoint={"weather/weather_codes_"+country} 
                    placeHolder={progress=='selected'? selection.text : `${t(tns + ":" + "WHICH_TOWN")}` }
                    value = {progress=='selected'? selection.text : `${t(tns + ":" + "WHICH_TOWN")}`}
                    onSelect={onSelect} createCallBack={create} />
            </View>
        )
    }

    return (
        <SafeAreaView style={{height:'100%', backgroundColor:'white'}}>
            <View style={{backgroundColor:bgColor, flex:1}}>
            <View style={[{backgroundColor:headerBgColor, borderBottomColor:borderColor}]}>
                <HeaderWithBack
                    title={t(tns + ":" + "LOCAL_WEATHER")}
                    backSVG centered
                    goBack={{ action: goBack }}
                    noShadow
                />
            </View>
            <KeyboardAvoidingView
                style={{flex:1 }}
                keyboardVerticalOffset={40 }
                behavior={Platform.OS === "ios" ? "padding" : null}
                >
            <ScrollView>
            <View 
                style={{flex:1, backgroundColor:bgColor, paddingHorizontal:10,alignItems:'center', width:'100%'}} 
                >
                <View style={{marginBottom:20, marginTop:20}}>
                    <Text style={{textAlign:'center', fontSize:16, fontWeight:'400', color:textColor}}>
                        {t(tns + ":" + "WEATHER_CONFIG_DESCRIP")}
                    </Text>
                    <View style={{marginTop:20}}>
                        <WeatherSettingDetails itemId ={userDefaultWeather} />
                    </View>
                </View>

                <View style={{borderColor:'orange',width:'100%', borderWidth:1, borderRadius:12,padding:10}}>
                    <View style={{marginBottom:20, }}>
                        <Text style={{fontWeight:'600', fontSize:14, color:textColor}}>{t(tns + ":" + "WHICH_TOWN_DESCRIP")} :</Text>
                    </View> 
                    <View style={{height:200}}>
                        <RenderSearchBarComponent/>
                    </View>
                </View>
                <View style={[styles.validateButton, {color:textColor}]}>
                    <Button onPress={createWeatherCallback} altStyle titleColor='white' title={t(tns+":"+"CONTINUE")} bgColor={textColor} noBorder />
                </View>
            </View>
            </ScrollView>
            </KeyboardAvoidingView>
            </View>
        </SafeAreaView>
        );

}

const styles = StyleSheet.create({
      validateButton:{
        marginBottom:40,
        padding:10,
        width:200,
    }
})