import React from 'react';
import {useEffect,useState,forwardRef, useImperativeHandle} from 'react';
import { Modal,View,Text,ScrollView,StyleSheet,Image,Alert } from 'react-native';
import { useSelector,useDispatch } from 'react-redux';


import { useTranslation } from 'react-i18next';
import Icon from 'react-native-vector-icons/MaterialIcons';
import styled from 'styled-components/native';
import SquareGrid from "react-native-square-grid";

import { useTheme } from '_theming/themeProvider';

import { useMimic } from '_hooks/mimic';
import { useIcon } from '_hooks/icon';
import PureIconRender from '_components/pureIconRender';
import { IconButton } from '@components/ui/buttons/iconButton';

/**
 * 
 *  Toggle this Modal Component using ref in parent and call
 *  youRef.current.toggle();
 *  
 * 
 */
 const DisguiseView = (props) => {
    
    //console.log("composite Management",props,ref)
    const { t, i18n } = useTranslation();
    const {itemId,typeName} = props;
    const {theme} = useTheme();
    const {getDisguiseType,canDisguise,getAvailableDisguises} = useMimic();

    const dispatch = useDispatch();
    const [modalVisible,setModalVisible] = useState(false);
    const [item,setItem] = useState({});
    const [name,setName] = useState('');
    
    const [currentType,setCurrentType] = useState(getDisguiseType(typeName) || typeName)
    const [availableProducts,setAvailableProducts] = useState([]);

    
    var numbers = [
        "one",
        "two",
        "three",
        "four",
        "five",
        "six"
    ];

   
    const [items,setItems] = useState([]);
    
    const processItems = () => {
        const availableDisguises = getAvailableDisguises(typeName) || []
        const arr = [typeName,...availableDisguises];

        const ret = arr.reduce((r,v,i) => {
            r.push({icon:v, isCurrent : (v == currentType)})
            return r;
        },[])
        setItems(ret)
    }

    

  
    useEffect(() => {
       // console.log("update currentType")
        processItems();
       
    }, [currentType]);
    
    useEffect(() => {
        // refresh please
    }, [items]);



    const onClick = (action) => {
        console.log("action",action);  
        setCurrentType(action);     
        dispatch({type:'DEV_DISGUISE_ACTION',payload:{id:itemId,disguiseType:action}});
       
    }
    
    const renderItem = (item) => {
        const svg = useIcon(item);
        const iconFillColor = "white"; 
        const iconSize = 40;
        console.log("item",item);
        const bgColor = "transparent" // (item.isCurrent) ? 'blue':'red';
        return (
            <View style={{backgroundColor:bgColor,flex:1,alignItems:'center',justifyContent:'center',margin:5}}>
                {/*<PureIconRender size={iconSize} img={item.icon} fill={iconFillColor}  />*/}
                <IconButton icon={item.icon} callback={onClick} action={item.icon} iconSize={36} isActive={item.isCurrent}/>
            </View>

        )
    }

    
    //--------------------------------------------- 

    const iconSize = 24;
    const iconColor = theme.onBody || "red";
    const removeIconName = "remove-circle-outline"
    const addIconName = "add-circle-outline";
  
   const title = "Sélectionnez le comportement souhaité (bêta)"

    

    return (
        <>
       <View style={{backgroundColor:'#AAAAAA'}}>
                <Title color={theme.onBody} style={{textAlign:'center',marginTop:10,marginBottom:10}}>{title}</Title>
                <View style={{minHeight:200}}>
                    <SquareGrid columns={3} items={items} renderItem={renderItem} />
                </View>
               
            </View>
      
        </>
    )

}
export default DisguiseView

const Title = styled.Text`
        align-content:center;        
        align-self:center; 
        font-weight:bold;
        color: ${props => props.color || "white"}; 
`;
const ItemText = styled.Text`
       
        color: ${props => props.color || "white"}; 
        font-size:14px; 
        flex:1;
       
        align-self:center;
`;
const ItemsContainer = styled.ScrollView` 
    margin-top:20px;      
    border-top-width:1px;
    border-top-color:${props => props.dividerColor || "white"};   
   
`;
const TypeRender = styled.View`
    margin:5px;

    background-color:red;

`;

const ItemRenderContainer = styled.View`
    flex-direction:row;
    border-bottom-width:1px;
    border-bottom-color:${props => props.dividerColor || "white"};
    padding:10px;
    padding-left:5px;
    padding-right:5px;
    align-content:center;
    justify-content:center;
   

`;
const Divider = styled.View`
   
    margin-top:${props => (props.height / 2 || 10)}px;
    margin-bottom:${props => (props.height / 2 || 10)}px;
    border-bottom-width:1px;
    border-bottom-color:${props => props.dividerColor || "white"};
   

`;
