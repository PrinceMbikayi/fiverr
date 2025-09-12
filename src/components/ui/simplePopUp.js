import React from 'react';
import {useEffect,useState,forwardRef, useImperativeHandle} from 'react';
import { Modal,View,Text,ScrollView,StyleSheet,TouchableHighlight,Image,Alert } from 'react-native';

import {Overlay } from 'react-native-elements';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/native';
import { useTheme } from '_theming/themeProvider';
import {useLayoutDimension} from '_hooks/layout';


/**
 * @typedef {Object} RefType
 * 
 * @property {() => void} toggle
 * 
 */

 /**
 * @callback requestCallback
 * @param {number} responseCode
 * @param {string} responseMessage
 */
/**
 * @typedef {Object} Props
 * @property {RefType} ref
 * @property {string} title - the title as it will  displayed 
 * @property {requestCallback} [callback] - a callback if needed
 * @property {Object[]}  datas - an array of objects
 * 
 * 
 */
 /**
 * A PopUp component used mainly in Heater program (FC)
 *  Toggle this Modal Component using ref in parent and call
 *  youRef.current.toggle();
 * 
 * 
 * @type {React.FC<Props>}
 */
 const SimplePopUp = React.forwardRef((props,  /** @type {RefType} */ref) => {

    const {datas,content,children,minHeight} = props;

    const { t, i18n } = useTranslation();   
    const {theme} = useTheme();   
    const { dimension, onLayout } = useLayoutDimension();

    const [modalVisible,setModalVisible] = useState(false);
    const [list,setList] = useState([]);
    const [popHeight,setPopHeight] = useState(-1)

    const [title,setTitle] = useState(props.title || "...")
    // REF methods can be called (useImperativeHandle)

    useImperativeHandle(ref, () => ({

        getAlert() {
          console.log("getAlert from Child called by parent");
        },
        popupTitle(val) {
            setTitle(val)
        },
        toggle() {
           
            setModalVisible(!modalVisible);
        }
      }));

    // DID MOUNT
    useEffect(() => {
        //setList(datas);
    }, []);

    useEffect(
        () => {
          console.log("dimension",dimension,props.minHeight)
          const adaptHeight = props.minHeight || dimension.height
          setPopHeight(adaptHeight)
        },
        [dimension]
      )
    // ITEM UPDATE
    /*
    useEffect(() => {
        
    }, [item]);
*/


    


    //===================================================
   
    const openObjetsModal = () => {       
        setModalVisible(true);       
    }

    const toggleOverlay = () => {       
        setModalVisible(!modalVisible)       
    }


    const itemSelect = (id) => {
        console.log("itemSelect",id);
        toggleOverlay();
        if(props.callback)props.callback(id);
    }



    //================== RENDER =========================
    
    const renderContent = () => {

        return props.children;

    }
   
    const calcLayout = () => {

    }
    

    const bodyLayout = (info) => {
        console.log("info",info)
    }
    //--------------------------------------------- 

    const iconSize = 24;
    const iconColor = theme.onBody || "red";
    const removeIconName = "remove-circle-outline"
    const addIconName = "add-circle-outline";

    const conditionalStyle = {height:popHeight,opacity:1};

    return (
        <>
        <Overlay isVisible={modalVisible} onBackdropPress={toggleOverlay} overlayStyle={[{backgroundColor:theme.body,padding:0,opacity:0},popHeight > -1 ? conditionalStyle :{}]}>
            <View onLayout={onLayout} style ={{...((props?.flexed)? {flex:1}:{}),'backgroundColor':theme['card--color--bodybg']}}>
                <Header>
                    <Title color={theme['card--color--text'] || theme.forcedWhite || theme.onBody}>{title}</Title>
                </Header>
                <ItemsContainer dividerColor={theme.divider_on_body} scrollEnabled={true} {...(props.flexed ? {flexed:true} : {})}>
                    <>
                    {
                        renderContent()
                    }
                    
                    </>
                </ItemsContainer>
            </View>
        </Overlay>
      
        </>
    )

})
export default SimplePopUp

const Header = styled.View`
   
    height:30px;
    min-height:30px;  
    margin:10px;
    
   
`; 
const Title = styled.Text`
        font-weight:bold;
        font-size:16px;
        color: ${props => props.color || "red"}; 
        
        text-align:left;
        line-height:30px;
        min-height:30px;
        
`;
const ItemText = styled.Text`
       
        color: ${props => props.color || "white"}; 
        font-size:20px; 
        flex:1;
        text-transform:capitalize;
        padding-left:10px;       
        align-self:center;
`;


const ItemsContainer = styled.View` 
    
    border-top-width:1px;
    border-top-color:${props => props.dividerColor || "white"};  
    padding-bottom:15px; 
    /* styled attr exists*/
    ${({ flexed }) => flexed && `
                        padding-bottom: 0px;
                        flex:1;
    `}
`;


const ItemRenderContainer = styled.View`
    flex-direction:row;
    align-items:center;
    border-bottom-width:1px;
    border-bottom-color:${props => props.dividerColor || "white"};
    padding:10px;
    padding-left:10px;
    padding-right:10px;
    background-color:${props => props.bgColor || "transparent"};   
    min-height:50px;
    

`;   
const Divider = styled.View`
   
    margin-top:${props => (props.height / 2 || 10)}px;
    margin-bottom:${props => (props.height / 2 || 10)}px;
    border-bottom-width:1px;
    border-bottom-color:${props => props.dividerColor || "white"};
   

`;

