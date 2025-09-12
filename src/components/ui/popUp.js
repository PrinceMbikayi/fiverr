import React from 'react';
import {useEffect,useState,forwardRef, useImperativeHandle} from 'react';
import { Modal,View,Text,ScrollView,StyleSheet,TouchableHighlight,Image,Alert } from 'react-native';
import {Overlay } from 'react-native-elements';
import { useTranslation } from 'react-i18next';
import styled,{ThemeProvider} from 'styled-components/native';

import { useTheme } from '_theming/themeProvider';
import {useLayoutDimension} from '_hooks/layout';
import PureIconRender from '_components/pureIconRender';

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
 const PopUp = React.forwardRef((props,  /** @type {RefType} */ref) => {

    const {title,datas,content,children} = props;
    const { t, i18n } = useTranslation();   
    const {theme} = useTheme();   
    const { dimension, onLayout } = useLayoutDimension();

    const [modalVisible,setModalVisible] = useState(false);
    const [list,setList] = useState([]);
    const [popHeight,setPopHeight] = useState(-1)

    // REF methods can be called (useImperativeHandle)
    // exemple callable method by ref using useImperativeHandle
    useImperativeHandle(ref, () => ({

        getAlert() {
          console.log("getAlert from Child called by parent");
        },
        toggle() {
          
            setModalVisible(!modalVisible);
            if(modalVisible == false) {

            }

        }
      }));

    // DID MOUNT
    useEffect(() => {
        setList(datas);
    }, []);

    useEffect(
        () => {
          console.log("dimension !!!!!! ",dimension)
          setPopHeight(dimension.height)
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

    const itemContentColor = theme["body_color_text"];
    const ItemRender = (irProps) => {

        return (
            <TouchableHighlight  onPress={() => (itemSelect(irProps.itemId))}>
                <ItemRenderContainer>
                    {irProps.children}
                </ItemRenderContainer>
            </TouchableHighlight>
        )
    }
    const renderContent = () => {


        if(children) {
            return children;
        }

        return (
            list.map((val,index) => {
                    return (
                            <ItemRender key={`PopUpList-${index}`} itemId={index}>
                                {val.icon &&
                                    <View style={{backgroundColor:'transparent'}}>
                                        <PureIconRender img={val.icon} size={22} fill={itemContentColor} color={itemContentColor}/>
                                    </View>
                                }
                                <ThemeProvider theme={{color:theme.onBody}}>
                                    <ItemText>{(props.translateLabels)? t(val.label) : val.label}</ItemText> 
                                </ThemeProvider>
                            </ItemRender> 
                    )
                }            
            )
        )
    }
   
    const calcLayout = () => {

    }
    
    //--------------------------------------------- 

    const iconSize = 24;
    const iconColor = theme.onBody || "red";
    const removeIconName = "remove-circle-outline"
    const addIconName = "add-circle-outline";

    const conditionalStyle = {height:popHeight,opacity:1};

    return (
        <>
        <Overlay isVisible={modalVisible} onBackdropPress={toggleOverlay} overlayStyle={[{backgroundColor:theme['card--color--bodybg'],padding:0,opacity:0},popHeight > -1 ? conditionalStyle :{}]}>
            <View onLayout={onLayout}>
                <ThemeProvider theme={{color:theme.onBody}}>
                    <Header>
                        <Title color={theme.onBody}>{title}</Title>
                    </Header>
                    <ItemsContainer dividerColor={theme.divider_on_body} scrollEnabled={false}>
                        <>
                        {
                            renderContent()
                        }                        
                        </>
                    </ItemsContainer>
                </ThemeProvider>
            </View>
        </Overlay>
      
        </>
    )

})
export default PopUp

const Header = styled.View`
   
    height:30px;
    min-height:30px;  
    margin:10px;
    
   
`; 
const Title = styled.Text`
        font-weight:bold;
        font-size:20px;
        color: ${attrs => attrs.theme.color || attrs.color || "white"}; 
        
        text-align:left;
        line-height:30px;
        min-height:30px;
        
`;
const ItemText = styled.Text`
       
        color: ${attrs => attrs.theme.color || attrs.color || "white"}; 
        font-size:20px; 
        flex:1;
        /*text-transform:capitalize;*/
        padding-left:10px;       
        align-self:center;
`;


const ItemsContainer = styled.ScrollView` 
      
    border-top-width:1px;
    border-top-color:${attrs => attrs.dividerColor || "white"};   
   
`;


const ItemRenderContainer = styled.View`
    flex-direction:row;
    align-items:center;
    border-bottom-width:1px;
    border-bottom-color:${attrs => attrs.dividerColor || "white"};
    padding:10px;
    padding-left:10px;
    padding-right:10px;
    background-color:${attrs => attrs.bgColor || "transparent"};   
    min-height:50px;
    

`;   
const Divider = styled.View`
   
    margin-top:${attrs => (attrs.height / 2 || 10)}px;
    margin-bottom:${attrs => (attrs.height / 2 || 10)}px;
    border-bottom-width:1px;
    border-bottom-color:${attrs => attrs.dividerColor || "white"};
   

`;

