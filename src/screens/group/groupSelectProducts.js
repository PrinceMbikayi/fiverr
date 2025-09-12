import React, {Component} from 'react';
import {useState,useContext,useRef} from 'react';
import { useDispatch,useSelector,useStore} from "react-redux";
import { View,Text,FlatList,TouchableOpacity,SafeAreaView,StyleSheet,Button} from 'react-native';

import Modal from 'react-native-modal';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/native';

import { useNavigation,useRoute,StackActions, NavigationActions, CommonActions } from '@react-navigation/native';

import { useTheme } from '_theming/themeProvider';

import { athomeFamilyTypes,athomeGroupTypes } from '_config/products/core';

import {getAllObjects,getObjectsByTypeName} from '_helpers/selectors';
import {HeaderWithBack} from '_components/headers/header-with-back';
import AccessButton from '_components/forms/accessButton';
import ProductToSelect from '_components/ui/productToSelect';
import { Api } from '_api';

import {refreshObjectAction} from '_actions/asyncActions';



const GroupSelectProductsScreen = (props) => {

   
    const store = useStore();
    const navigation = useNavigation();
    const route = useRoute();
    const navigationParams = route?.params || {};   


    // Harold Remark: No grpupId in navigationParams
    const {id : groupId = -1,groupName = "",productType} = navigationParams;
    console.log("PARAMS HERE :", navigationParams);  
    
    const {theme,baseColors} = useTheme();
    const { t, i18n } = useTranslation();   
    const {bgColor,textColor,headerBackgroundColor,headerTextColor} = baseColors;

   
    const [createdGroupId,setCreatedGroupId] = useState(-1)
    const [processStep,setProcessStep] = useState('waiting')
    const [isModalVisible,setIsModalVisible] = useState(false);
    const [selection,setSelection] = useState([]);
    const createdIdRef = useRef(-1);
    const allObjects = useSelector(getAllObjects);
   



    const getObjectsByTypesInGroup = () => {       
        const type = productType;
        const myType = athomeGroupTypes[type];  
        console.log("MY TYPE :", athomeGroupTypes, type);
        const state = store.getState();
        let ids = getObjectsByTypeName(state,myType);      

       return ids || [];
    }

    const [products,setProducts] = useState(getObjectsByTypesInGroup())


    const getGroupObjects = () => {
        /*
        const componentsNames = selection.map( (id,index) => {
            return allObjects[id].name
        }).join();
            return componentsNames;
         */
    
        const componentsIds = selection.map( (id,index) => {
            return id
        }).join();
            return "["+componentsIds+"]";
        }


    const handleSubmit = async () => {
               
        setProcessStep('submiting');
        toggleModal();
       
        let res = await Api.createAGroup(groupName);
         
       
        if(res.components != undefined) {       
            const componentsIds = res.components.map((item,index) => {
                return item.uri.split('/').pop()
            })
        }
                
        if(res.id != undefined) {
            createdIdRef.current = res.id;
            const components = getGroupObjects();   
            console.log("SEE NEW CREATED GROUP ID and it's COMPONENTS LIST :",res.id, components);      
            await Api.modifyAGroup(res.id,components); 
            setCreatedGroupId(res.id);
            setProcessStep('success');            
        }
    }


    const selectionNotify = (id,status) => {

        let newSelection = [...selection];
        if(newSelection.indexOf(id) == -1) {
            newSelection.push(id)
        } else {
            newSelection.splice(newSelection.indexOf(id),1)
        }
       setSelection(newSelection);
       
    }

    const toggleModal = () => {
       setIsModalVisible(!isModalVisible);
      // setTimeout(() => { goToCreatedGroup()}, 200);
    }


    const closeModal = async() => {
        setIsModalVisible(false);
        const res = await refreshObjectAction(createdIdRef.current,store).catch((err) => console.log(err));       
        setTimeout(() => { goToCreatedGroup()}, 1000)      
    }

    const resetMyRoute = () => {
        navigation.dispatch(StackActions.popToTop());
    }

    const goToCreatedGroup = () => {

        resetMyRoute();
        //then go to previous Stack View
        const params = {itemId:createdGroupId}
        if(params.itemId != -1) {
            navigation.navigate("ProductDetails",params);
        }        
    }     

    const cancel = () => {
        resetMyRoute();
        navigation.navigate('Home');
      }

      const renderItem = (data) => {
      
        //ATTENTION RENDER 
       // console.log("renderItem",data);
        const objId = data.item;
        const obj = allObjects[objId];
        const fillColor = textColor || theme["screen--color--text"] || "yellow";
        let currentCheck = false;            
        const onNotify = (id,status) => {            
            selectionNotify(id,status);
        }

        return (
                <ProductToSelect itemId = {objId} fill={fillColor} notify={onNotify}/>
        )
        
      }

    const ProcessComponent = (props) => {

        return (
                <>
                {processStep == 'waiting' &&
                    <View style={{alignItems:'flex-end',flexDirection:'row',minHeight:80}}>
                        <View style={{flexDirection:'row',justifyContent:'space-between',padding:15,paddingBottom:25}}>
                            <View  style={{width:'48%'}}>
                                <AccessButton  onPress={cancel} title={t('CANCEL').toUpperCase()} specialColor={textColor}/>
                            </View>
                            <View  style={{width:'48%'}}>
                                <AccessButton  onPress={handleSubmit} title={t('VALID').toUpperCase()} specialColor={textColor}/>
                            </View>
                        </View> 
                    </View>
                }
                {processStep == 'submiting' &&
                    <View style={{flex:1}}>
                        <Text>{t('CREATE_GROUP_SENDING')}</Text>
                    </View>
                }
                {processStep == 'error' &&
                    <View style={{flex:1,color:'white'}}>
                        <Text>{t('CREATE_GROUP_ERROR')}</Text>
                    </View>
                }
                {processStep == 'success' &&
                   <View style={{flex:1,justifyContent:'center',alignContent:'center'}}>
                        <Text style={{color:'white'}}>({t('CREATE_GROUP_SUCCESS',{name:groupName})})</Text>
                    </View>
                } 
                </>
        )
    }

    //----------------------------------------------------------    
   

    return (
        <SafeAreaView style={{flex:1,flexDirection:'column',backgroundColor:theme['color--bg']}}>                 
            <View style={{flex:1,minHeight:72}}>
                <HeaderWithBack title={t("PRODUCTS_LIST").toUpperCase()} close  themeDependency/>  
            </View>
            <View style={{flex:40}}>
                <ListContainer>
                    
                    <FlatList
                        keyExtractor = {(item) => `key-${item}`}
                        data={products}
                        renderItem={renderItem} 
                        removeClippedSubviews={false}
                        showsVerticalScrollIndicator={false}                            
                    />                    
                </ListContainer>
            </View>
            
            <View style={{flex:1,minHeight:70}}>
                <ProcessComponent/>
            </View>
            <Modal isVisible={isModalVisible}>
                <View style={[modalStyles.content]}>
                    <Text>{t('CREATE_GROUP_SUCCESS',{name:groupName})}</Text>
                    <Button title={t("GO_CREATED_GROUP")} onPress={closeModal} />
                </View>
            </Modal>
        </SafeAreaView>
    )
}

export default GroupSelectProductsScreen

/**************  STYLED  ************************/

const ListContainer = styled.View`
   padding: 0px 15px;
  
`;

const styles = {
    title : {
        color: '#fff',
        fontSize:20
    }
}

const modalStyles = StyleSheet.create({
    content: {
      backgroundColor: 'white',
      padding: 22,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 4,
      borderColor: 'rgba(0, 0, 0, 0.1)',
    },
    contentTitle: {
      fontSize: 20,
      marginBottom: 12,
    },
  });