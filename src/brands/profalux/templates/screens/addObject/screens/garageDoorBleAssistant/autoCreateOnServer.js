/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-trailing-spaces */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React from 'react';
import {useState, useRef, useEffect} from 'react';
import {View, StyleSheet, SafeAreaView, Text, ActivityIndicator} from 'react-native';
import {useTranslation} from 'react-i18next';
import styled, { css } from 'styled-components/native';
//-----------------------------------------------------
import {useTheme} from '_theming/themeProvider';
import {H1, H2, H3,  P, VSeparator} from '_brand/templates/styled';
import Button from '_brand/templates/components/ui/Button';
import { MyButton } from '_brand/templates/components/ui/MyButton';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { useStore } from 'react-redux';
import {updateObjectRoom} from '_api/objects'
import useSwipeBackDisabler from '_hooks/swipe';
import {GlobalToast} from '_brand/templates/components/objects/common/GlobalToast'
import {useGlobalModal} from '_components/ui/globalModal'
import * as Actions from '_actions/objects';
import { useDispatch } from 'react-redux';
import { deleteObject } from '_api/objects';
import { myToast } from '_brand/templates/components/ui/myToast';


const AutoCreateOnServer = props => {
  

  useSwipeBackDisabler();
  const globalModal = useGlobalModal(); 
  const dispatch = useDispatch();
  const store = useStore();
  const navigation = useNavigation();
  const route = useRoute();
  const navParams = route?.params || {};
  const {t, i18n} = useTranslation();
  const tns = 'addObject';


  const theme = useTheme();
  const bgColor = theme?.prflxbgColor || 'white';
  const textColor = theme?.prflxTextColor || 'black'



  const {uBleContext,callback} = props;
  const {
    read,
    isConnected,
   // disconnectWifi
  } = uBleContext;



  const [boardId, setBoardId] = useState(null);

  useEffect(() => {
    const init = async () => {
      console.log("init in aurioCreateOnServer",uBleContext)
      const bleBoardId = await read('BOARD_ID');
      setBoardId(bleBoardId);
      disconnectWifi();
    };
    //init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    console.log('boardId', boardId);
  }, [boardId]);

  useEffect(() => {
    console.log('isConnected !! ', isConnected);
  }, [isConnected]);

  const updateRoom = async (objectId, newRoomId) => {
      console.log("Sent:", objectId, newRoomId);
      await updateObjectRoom(objectId, newRoomId).catch((err) => console.log(err));
  }


  const bodyTextColor = textColor;
  const backgroundColor = bgColor;
  const styledTheme = {textColor: textColor};


const [progress, setProgress] = useState("request");

useEffect(()=> {
  console.log("********* AutoCreateOnServer progress changed",progress)
},[progress]);



const createAtStart = async() => {
    console.log("createAtStart in boardgate/wizard/screens/autoCreateOnServer")
    if(uBleContext) {
     
      const result = await uBleContext.doCreateOnServer();
      console.log("createAtStart result",result)
      console.log("createAtStart result",result)
     if(result.errCode == 200) {
      const objectId = result.id;
      const roomUri = result?.res?.data?.resource?.room?.uri
      const roomId = Number(roomUri?.split('/').pop());
      console.log('READY_TO_SEND_UPDATE_ROOM:',objectId, roomId);
      const roomUpdateRequest = await updateObjectRoom(objectId, roomId).catch((err) => console.log(err));
      console.log('roomUpdateRequest', roomUpdateRequest);
      setProgress("created")
      //refreshObjectAction(result.id, store)
      console.log("so created !!!",callback)
      if(callback) {
        callback({itemId:result.id})
      }
     }
     if(result.errCode === 400 && result.errMsg === 'object_exists') {
      setProgress("object_exists")
     
     }
     if(result.errCode === 400 && result.errMsg === 'object_exists_elsewhere') {
      setProgress("object_exists_elsewhere")
      
      }

      
    }
}


  useEffect(()=> {
    createAtStart();
  },[]);
  
  const onObjectExists = () => {
   navigation.navigate("AddObject");
    // console.log("onObjectExists",callback)
    // if(callback) {
    //   callback({'exists':true})
    // }
  }

  const onExistsElsewhere = () => {
    if(callback) {
      callback({'existsElsewhere':true})
    }
  }


const onCancel = () => {
  console.log("onCancel")
}

const goConnectToWifi = () => {
      const destination = navParams?.next || 'gloup' || "BleEquipmentCreateOnServer";
      console.log('JE_TRANSFERT_ID:', uBleContext?.objectId);
      navigation.navigate(destination,{objectId: uBleContext?.objectId});
}
const cancelCreation = () => {
  console.log('ABOUT_TO_CANCEL_CREATION');
  onOpenSelect()
}

    //???????????????????????????????????????????????????????????
        const buttons = [
            {
                id:"return",
                text:`${t(tns + ":" + "RETURN")}`,
                action:()=>onCancelPressed(),
                textColor:"#007AFF"
            },
            {
                id:"validate",
                text:`${t(tns + ":" + "TO_STOP")}`,
                action:()=>onValidate(),
                textColor:"red"
            }
        ]

    
      const onCancelPressed = () => {
        console.log('CANCEL_DELETE :');
        globalModal.close();
      }
      
      const onValidate = async() => {
        // Delete created Sesame
        const newSesameId = uBleContext?.objectId;
        console.log('NEW_SESAME:',newSesameId);
        globalModal.close();
        const res = await deleteObject(newSesameId).catch((err) => { console.log(err) });
        console.log('DELETE_SESAME_ON_CREATION :', res);

        if (res.errCode == 200) {
                    //navigate Home Screen
            navigation.navigate("AddObject")
            navigation.navigate("MaisonScreen")
            console.log('CHECK_POINT_DELETE 1', newSesameId);
            const action = Actions.objectDelete(newSesameId);
            dispatch(action)
        }else{
                const message = `Erreur ${res.errCode} : ${res.errMsg}`;
                const bgColor = 'red';
                const textColor = "white";
                const duration = 4000;
                myToast(message, bgColor, textColor, duration)
        }
      }
      
      const onOpenSelect = () => {  
          const content = (
            <View style={{width:"95%", backgroundColor:'transparent',alignSelf:'center',justifyContent:'center',alignItems:'center', borderRadius:14}}>
                <GlobalToast 
                    toastTitle={t(tns + ":" + "WARNING")}
                    toastBody={t(tns + ":" + "STOP_EQUIPMENT_CONFIGURATION")}
                    buttons={buttons}
                />
            </View>
                )
          globalModal.setContent(content,{type:'centered'});    
          globalModal.toggle();
      }
    //???????????????????????????????????????????????????????????


  return (
   
        <Body style={{}}>
          <View
            style={{width: '100%', backgroundColor: 'transparent', justifyContent: 'center', alignItems: 'center'}}          >          
         {progress == "request" &&
         <>
            <VSeparator height={20} />
              <Text style={[styles.text,{color:textColor}]}>
                  {t(tns+":"+"REQUESTING_AUTHENTICATION")}
              </Text>
            <VSeparator height={50}/>
            <ActivityIndicator size="large" color={textColor} style={{ transform: [{ scaleX: 2 }, { scaleY: 2 }] }}/>
         </>
         
         
         }
          {progress == "created" && 
            <View style={{ paddingBottom: 16}}>  
              <Text style={[styles.text,{color:textColor}]}>
                {t(tns+":"+"SESAME_AUTO_CREATED")}
              </Text>
              <VSeparator height={24}/>
              <View style={{ width: 200, marginTop: 200, alignSelf:'center'}}>
                      <MyButton onPress={goConnectToWifi} title={t(tns + ":" + "CONTINUE")} />
              </View>
              <View style={{ width: 200, marginTop: 20, alignSelf:'center'}}>
                      <MyButton onPress={cancelCreation} title={t(tns + ":" + "CANCEL")} />
              </View>
              <VSeparator height={16}/>
      
            </View>
          } 
           {progress == "object_exists" && 
           <>
              <VSeparator height={20} />
              <Text style={[styles.text,{color:textColor}]}>
                {t(tns+":"+"OPROLL_EXISTS")}
              </Text>
              <VSeparator height={16} />
              <View style={{ width: '60%', marginTop: 200}}>
                  <MyButton onPress={onObjectExists} title={t(tns + ":" + "END")} />
              </View>
              {/* <Button onPress={onObjectExists} title={t(tns+":"+"END")} altStyle/> */}
            </>
          } 
           {progress == "object_exists_elsewhere" && 
           <>
              <VSeparator height={20} />
              <Text style={[styles.text,{color:textColor}]}>
                {t(tns+":"+"OPROLL_EXISTS_IN_ANOTHER_ACCOUNT")}
              </Text>
              <VSeparator height={16} />
              <View style={{ width: '60%', marginTop: 200}}>
                  <MyButton onPress={onObjectExists} title={t(tns + ":" + "END")} />
              </View>
              {/* <Button onPress={onObjectExists} title={t(tns+":"+"END")} altStyle/> */}
            </>
          } 
          
          </View>
        </Body>
  );
};

export default AutoCreateOnServer;

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    fontWeight: '400',
    marginVertical: 10,
    textAlign: 'center',
  },
});
const Body = styled.View`
  padding: 16px;
  background-color:transparent;
  
`;
