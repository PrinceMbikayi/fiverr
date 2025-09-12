import React,{Fragment} from 'react';
import {useEffect,useState,forwardRef, useImperativeHandle} from 'react';
import { Modal,View,Text,ScrollView,StyleSheet,Image,Alert, Pressable } from 'react-native';
import { useSelector,useDispatch } from 'react-redux';


import { useTranslation } from 'react-i18next';
import Icon from 'react-native-vector-icons/MaterialIcons';
import styled from 'styled-components/native';


import { useTheme } from '_theming/themeProvider';
import * as ObjectHelpers from '_helpers/objects';
import {updateRDependencies} from '_actions/objects';
import {modifyAGroup} from '_api/groups';
import {getSameFamilyProducts} from './compositeUtils';


 const CompositeManagementView = (props) => {
    
    //console.log("composite Management",props,ref)
    const { t, i18n } = useTranslation();
    const { itemId,itemComponents} = props;
    const {theme} = useTheme();
    const dispatch = useDispatch();

   
    const [item,setItem] = useState({})
    const [name,setName] = useState('')
    // components = an array of ids
    const [components,setComponents] = useState([]);
    
    // an object of arrays with ids as keys
    const [sameFamilyProducts,setSameFamilyProducts] = useState({});
    // an array of ids diffsameFamilyObjects
    const [availableProducts,setAvailableProducts] = useState([]);

    // REF methods can be called (useImperativeHandle)

   

    // DID MOUNT
    useEffect(() => {
      
        const _item = ObjectHelpers.getObjectById(props.itemId);
       
        setItem(_item); 
       
        setName(_item.name);
        //------------------------------
        const _components = getComponents()
        setComponents(_components);
        //------------------------------
        const _sameFamilyProducts = getSameFamilyProducts(_item.uniType);
        console.log("contentManagement",_item.name,_item.uniType,_sameFamilyProducts)
        setSameFamilyProducts(_sameFamilyProducts);  
        //-----------------------------
      
        const _availableProducts = getAvailableProducts(_sameFamilyProducts,_components)     
        setAvailableProducts(_availableProducts);
    }, []);
    // ITEM UPDATE
    useEffect(() => {
        const _item = item;
         //------------------------------
        const _components = getComponents()
        setComponents(_components);
        //------------------------------
        const _sameFamilyProducts = getSameFamilyProducts(_item.uniType);
        setSameFamilyProducts(_sameFamilyProducts);  
        //-----------------------------      
        const _availableProducts = getAvailableProducts(_sameFamilyProducts,_components)     
        setAvailableProducts(_availableProducts);
    }, [item]);



    const updateComponents = async () => {
        const _item = ObjectHelpers?.getObjectById(props.itemId);
        setItem(_item); 
        // process is finished in useEffect UPDATE ITEM
        
    }


    //===================================================
   const getComponents = () => {
        let _components = {ids:[],objects:[]}
        if(item && item.components && item.components.length >0) {
            _components = item.components.reduce((r,v,i) => {
                //const childId = v.uri.split('/').pop();
                const childId = v;
                const childDatas = ObjectHelpers?.getObjectById(Number(childId));
                //console.log("childDatas",childDatas)
                if(childDatas == undefined)return r;
                r?.objects.push({'name':childDatas.name,'id':childId})
                r?.ids.push(Number(childId))
                return r;
            },{ids:[],objects:[]});  
        }
        //console.log("_components",_components)
        
        return _components.ids;
   }

   /*
   const getSameFamilyProducts = (typeName) => {
        const _sameFamilyProducts = ObjectHelpers.getObjectsByTypeName(typeName)       
       
        if(_sameFamilyProducts) {
            const _items = _sameFamilyProducts.reduce(function(r,v,i){   
                const item =  ObjectHelpers.getObjectById(v)       
                if(item && item.typeName != "composite") {
                   
                    r[item.id] = {'name':item.name,'id':item.id,'typeName':item.typeName};
                }
                return r;
            },{})
            
            return _items
        }
        // if strangely there is no products with the unique type in the cmposite !!!!!
        return {};       
   }
   */



    const deleteObjectConfirm = (id) => {
  
        const alertTitle = t("REMOVE_OBJECT_FROM_GROUP_TITLE").toUpperCase();
        const alertBody = t("REMOVE_OBJECT_FROM_GROUP_BODY");
        const cancelLabel = t("CANCEL").toUpperCase();
        const validLabel = t("VALIDATE").toUpperCase();
    
    
        Alert.alert(
          alertTitle,
          alertBody,
          [        
            {
              text: cancelLabel,
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel'
            },
            { 
              text: validLabel, onPress: () => {deleteComponent (id)}   
            }
          ],
          { cancelable: true }
        );
      }


    const deleteComponent = (id) => {
       
        const deleteIndex = components.indexOf(id)       
        let newComponents = [...components];
        newComponents.splice(deleteIndex,1);        

        
       //update rDependencies in store
        const dependencesAction = updateRDependencies([],[id],itemId,'groups');
        dispatch(dependencesAction);


        if(newComponents.length > 0) {
            setComponents([...newComponents]);
        } else {
            setComponents([])
        }
        const _availableProducts = getAvailableProducts(sameFamilyProducts,newComponents);
        setAvailableProducts(_availableProducts);
        
        // as useState is async and i can't wait useEffect
        // modify method is called with the future value of components
        modifyComponent([...newComponents])
    }
    
    const addComponent = (id) => {
      
       
        const newComponents = (components.length == 0) ? [id] : [...components,id];
        //update rDependencies in store
        const dependencesAction = updateRDependencies([id],[],itemId,'groups');
        dispatch(dependencesAction);
        setComponents(newComponents);      
        const _availableProducts = getAvailableProducts(sameFamilyProducts,newComponents);
        setAvailableProducts(_availableProducts);
        modifyComponent([...newComponents])
    }

    const getAvailableProducts = (_sameFamilyProducts,_components) => {
        const _availableProducts = Object.keys(_sameFamilyProducts).reduce(function (r, k) {
           
            if(_components.indexOf(Number(k)) == -1 ) r.push(Number(k))
            return r
        }, []);
       
        return _availableProducts;
    }

    const modifyComponent = (componentsToModify) => {
        let _modify = []
        if(componentsToModify && componentsToModify.length >0) {
            _modify = componentsToModify.reduce((r,v,i) => {
                
                r.push(sameFamilyProducts[v].name)
                return r;
            },[]).join();  
        }
        //SERVER
        if(_modify.length > 0){             
            modifyAGroup(itemId,_modify)
        }
       
    }
    
    //--------------------------------------------- 

    const iconSize = 24;
    const iconColor = theme.onBody || "red";
    const removeIconName = "remove-circle-outline"
    const addIconName = "add-circle-outline";

    
    return (
        <>
       
                <ItemsContainer dividerColor={theme.divider_on_body}>
                    <>
                    { components.map((v,i)=> {
                            

                            return (
                                <Fragment  key={"gComp_"+i}>
                                    {sameFamilyProducts[v]!= undefined &&
                                    <ItemRenderContainer dividerColor={theme.divider_on_body} key={"inside_"+i.toString()}>                           
                                        <ItemText color={theme.onBody}>{sameFamilyProducts[v].name}</ItemText> 
                                        <Pressable onPress={() => {deleteObjectConfirm(v)}}>  
                                        <>                    
                                            {components.length > 1 && <Icon name={removeIconName} size={iconSize} color={iconColor} style={{minWidth:iconSize}}/>}
                                        </>
                                        </Pressable>       
                                    </ItemRenderContainer>
                                    }
                                </Fragment>
                            )
                    })}
                    <Divider dividerColor="transparent" height={20}/>
                     { availableProducts.map((v,i)=> {
                            return (
                                <Fragment  key={"sfpComp_"+i}>
                                {sameFamilyProducts[v]!= undefined &&
                                    <ItemRenderContainer key={"add_"+i.toString()} dividerColor={theme.divider_on_body}>
                                    <ItemText color={theme.onBody} style={{textAlign:'right',paddingRight:10}}>{sameFamilyProducts[v].name}</ItemText>
                                    <Pressable onPress={() => {addComponent(v)}}>                      
                                        <Icon name={addIconName} size={iconSize} color={iconColor} style={{minWidth:iconSize}}/>
                                    </Pressable>
                                </ItemRenderContainer>
                                }
                                </Fragment>
                            )
                    })}
                    
                    </>
                </ItemsContainer>
            
        </>
    )

}
export default CompositeManagementView

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
