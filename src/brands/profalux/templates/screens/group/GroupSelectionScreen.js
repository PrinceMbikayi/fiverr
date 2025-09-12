import '_brand/templates/screens/group/locales'
import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { Text, FlatList, View } from 'react-native';
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from 'react-i18next';

import { useNavigation, useRoute } from '@react-navigation/native';

import { useTheme } from '_theming/themeProvider'
import GroupTemplateScreen from '_brand/templates/components/objects/groupObject/components/GroupTemplateScreen';

import {getObjectsByTypes } from '_helpers/selectors';
import { BottomDeleteSheet } from '_brand/templates/components/objects/common/BottomDeleteSheet';
import { deleteObject } from '_api/objects';
import * as Actions from '_actions/objects';
import Toast from 'react-native-root-toast';
import { ItemSelectionRender } from './components/ItemSelectionRender'
import { CommonBottomSheetDeleteContent } from '_brand/templates/components/objects/common/CommonBottomSheetDeleteContent';
import {useGlobalModal} from '_components/ui/globalModal'
import {appRefresh} from '_actions/app';





const GroupSelectionScreen = (props) => {

  const { } = props;

  const globalModal = useGlobalModal(); 
  const { t, i18n } = useTranslation();
  const tns = "group";
  const { theme } = useTheme();
  const dispatch = useDispatch();


  const idTodeleteRef = useRef(null);
  const [itemPicked, setItemPicked] = useState();
  const [groupComponents, setGroupComponents] = useState([]);




  const navigation = useNavigation();
  const route = useRoute();
  const navParams = route?.params || {};

  const { gotask } = navParams;
  console.log("NAVIGATION PARAMS :", gotask);

  const borderColor = theme?.prflxBorderColor || 'orange';
  const textColor = theme?.prflxTextColor || 'black'



  useEffect(() => {


  }, [groupComponents]);


  //const objectsVisible = useSelector(getObjectsVisible);
  const composite = useSelector(getObjectsByTypes)["Composite"] || [];
  let groups = (composite.length % 2 != 1) ? composite : [...composite, 'extra'];

  useEffect(() => {
    console.log("item picked :", itemPicked);
  }, [itemPicked]);


  const actionSheetRef = useRef(null);
  const kebabDeleteAction = () => {
    //actionSheetRef.current?.present()
    onOpenSelect()
  }

  const handleCallBack = (itemPicked) => {
    console.log('CONTROL :', itemPicked)
    idTodeleteRef.current = itemPicked;
    setItemPicked(itemPicked);
    console.log("ITEM FOR REDIRECT : ", itemPicked);
    (gotask === 'delete') ? kebabDeleteAction() : navigation.navigate('GroupModifyScreen', { itemPicked });
  }


  const onCancelPressed = () => {
    console.log('CANCEL_DELETE :');
    globalModal.close();
  }

  const onOpenSelect = () => {  
      const content = (
        <View style={{width:'100%', height: 200}}>
          <CommonBottomSheetDeleteContent 
              nameToDelete={`${t(tns+":"+"THIS_GROUP")}`} 
              warningText={`${t(tns+":"+"WARNING_DELETE")}`}
              textColor={textColor} 
              onDelete={handleDelete} 
              onCancel={onCancelPressed} 
          />
        </View>
            )
      globalModal.setContent(content,{type:'bottom'});    
      globalModal.toggle();
  }

  const handleCancel = () => {
    actionSheetRef.current?.dismiss();
  }
  const handleDelete = async () => {
    console.log("SKIP")
    globalModal.close()
    //actionSheetRef.current?.dismiss(); 
    // alert("Really wanna delete?")
    console.log("transfered itemId :", idTodeleteRef.current)
    const res = await deleteObject(idTodeleteRef.current).catch((err) => { console.log(err) });
    if (res.errCode == 200) {
      const action = Actions.objectDelete(idTodeleteRef.current);
      dispatch(action);
      Toast.show(
        `${t(tns + ":" + "GROUP_DELETED")}`,
        {
          backgroundColor: 'black',
          textColor: 'white',
          textStyle: { fontSize: 16, fontWeight: '600' },
          containerStyle: { width: '80%', height: 100, justifyContent: 'center', alignItems: 'center', borderRadius: 10, borderColor: borderColor, borderWidth: 2 },
          //position: Toast.positions.CENTER,
          position: -350,
          duration: 3000,
          //onHide:()=>navigation.goBack()
        }
      );
      navigation.navigate('ProfaluxGroupHomeScreen')
      //dispatch(appRefresh());
    }

  }



  return (
    <GroupTemplateScreen withKebab={false} >
      <Text style={{ fontSize: 14,color:textColor, fontWeight: '600', padding: 10 }}>{t(tns + ":" + "SELECT_GROUP")} :</Text>
      <FlatList
        data={groups}
        renderItem={
          ({ item, index }) => <ItemSelectionRender
            item={item}
            iconSize={35}
            iconColor={textColor}
            callBack={() => handleCallBack(item)}
          />
        }
        keyExtractor={(item, index) => "key_" + item}
        numColumns={2}
      />


      {/* <BottomDeleteSheet
        myRef={actionSheetRef}
        handleCancel={handleCancel}
        handleDelete={handleDelete}
      /> */}
    </GroupTemplateScreen>

  )
};

export default GroupSelectionScreen;


