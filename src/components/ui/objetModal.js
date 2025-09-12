import React from 'react';
import {useEffect,useState,forwardRef, useImperativeHandle,useRef} from 'react';
import { Modal,View,Text,ScrollView,StyleSheet,TouchableHighlight,Image,Alert } from 'react-native';
import { useSelector,useDispatch } from 'react-redux';

import { Overlay } from 'react-native-elements';
import { useTranslation } from 'react-i18next';
import Icon from 'react-native-vector-icons/MaterialIcons';
import styled from 'styled-components/native';


import { useTheme } from '_theming/themeProvider';
import { getObjectById } from '_helpers/selectors';

import DisguiseView from '_components/objects/@common/disguiseView';
import CompositeManagementView from '_components/objects/composite/contentManagementView';
import { GroupSelectTypeScreen } from '_screens/group';


/**
 * 
 *  Toggle this Modal Component using ref in parent and call
 *  youRef.current.toggle();
 *  
 * 
 */
 const ObjectModal = React.forwardRef((props, ref) => {
    
    //console.log("composite Management",props,ref)
    const { t, i18n } = useTranslation();
    const { itemComponents} = props;
    const {theme} = useTheme();
    const dispatch = useDispatch();
    const [modalVisible,setModalVisible] = useState(false);

    const itemIdRef = useRef(null)
    const [itemId,setItemId] = useState(null);
    const [modalContentType,setModalContentType] = useState(null);
    const itemDatas = useSelector(state => getObjectById(state,itemIdRef?.current));
   
    // REF methods can be called (useImperativeHandle)

    useImperativeHandle(ref, () => ({

        getAlert : () => {
          console.log("getAlert from Child called by parent");
        },
        toggle: (itemId,mContentType) => {
            console.log("itemId  ==>",itemId,mContentType,modalVisible);
            setModalContentType(mContentType)
            if(!modalVisible)   {
                update(itemId)
            }
            setModalVisible(!modalVisible);
        }
      }),[]);

    // DID MOUNT
    useEffect(() => {
      
       
    }, []);
    // ITEM UPDATE
    useEffect(() => {
        
    }, [itemDatas]);

    // ITEM UPDATE
    useEffect(() => {
       //console.log("visible change",modalVisible) 
    }, [modalVisible]);



    const update = (itemId) => {
        console.log("update",itemId);
        itemIdRef.current = itemId;
        console.log('itemIdRef',itemIdRef)
        
    }



    const toggleOverlay = () => {
        console.log("je toggle overlay")
        if(!modalVisible){

        }
        setModalVisible(!modalVisible)
       
    }

    //--------------------------------------------- 

    const iconSize = 24;
    const iconColor = theme.onBody || "red";
    const removeIconName = "remove-circle-outline"
    const addIconName = "add-circle-outline";
    return (
        <>
        <Overlay isVisible={modalVisible} onBackdropPress={toggleOverlay} overlayStyle={{backgroundColor:theme['card--color--bodybg']}}>
            <View>
                <Title color={theme.onBody}>{itemDatas?.name}</Title>
                <ItemsContainer dividerColor={theme.divider_on_body}>
                  
                    {(modalContentType == "disguise" && itemDatas?.id) && 
                        <DisguiseView itemId={itemDatas.id} typeName={itemDatas?.typeName} />                    
                    }
                    {(modalContentType == "composite") &&                      
                        <CompositeManagementView itemId={itemIdRef.current}/>
                    }
                </ItemsContainer>
            </View>
        </Overlay>      
        </>
    )

})
export default ObjectModal

const Title = styled.Text`
        align-content:center;        
        align-self:center; 
        font-weight:bold;
        color: ${attr => attr.color || "white"}; 
`;
const ItemText = styled.Text`
       
        color: ${attr => attr.color || "white"}; 
        font-size:14px; 
        flex:1;       
        align-self:center;
`;
const ItemsContainer = styled.ScrollView` 
    margin-top:20px;      
    border-top-width:1px;
    border-top-color:${attr => attr.dividerColor || "white"};  
   
`;
const ItemRenderContainer = styled.View`
    flex-direction:row;
    border-bottom-width:1px;
    border-bottom-color:${attr => attr.dividerColor || "white"};
    padding:10px;
    padding-left:5px;
    padding-right:5px;
    align-content:center;
    justify-content:center;
   

`;
const Divider = styled.View`
   
    margin-top:${attr => (attr.height / 2 || 10)}px;
    margin-bottom:${attr => (attr.height / 2 || 10)}px;
    border-bottom-width:1px;
    border-bottom-color:${attr => attr.dividerColor || "white"};
   

`;
