import React from 'react';
import { useRef, useEffect,useState,useImperativeHandle } from 'react';
import { Animated,Text,View,Switch,TouchableOpacity} from 'react-native'; // use in styled components

import { useTranslation } from 'react-i18next';
import styled from 'styled-components/native';

import { getSameFamilyProducts } from '_components/objects/composite/compositeUtils';


import { useTheme } from '_theming/themeProvider';

import { MultiPurposeLine } from "_components/list/multiPurposeLine";


export const SelectProducts = (props) => {
   
    const {type} = props
    const { t, i18n } = useTranslation();
    const { theme} = useTheme();   
    const color = theme.onBody;
  

    const iconDefaultSize = 36;
    const [selectableProducts,setSelectableProducts] = useState([])


  useEffect(()=> {
    console.log("useFX")
    const _sameFamilyProducts = getSameFamilyProducts(type,false);
    console.log("/useFX")
    const _availableProducts = Object.keys(_sameFamilyProducts).reduce(function (r, k) {           
      //if(_components.indexOf(Number(k)) == -1 ) r.push(Number(k))
      r.push(_sameFamilyProducts[k])
      return r
  }, []);
    console.log("_availableProducts",_availableProducts)
    setSelectableProducts(_availableProducts);
  },[type])

  const selectCallBack = (id) => {
    console.log("selectCallBack",id);

    const newSelectableProducts = JSON.parse(JSON.stringify(selectableProducts)) || [];

    newSelectableProducts.map((v,i) => {
      
      if(v.id == id) {
       
        v.value = (v.value != undefined) ? !v.value : true;
      }
    });
    console.log("newSelectableProducts",newSelectableProducts)
    setSelectableProducts(newSelectableProducts)

  }


    return (
           <>
           {
             selectableProducts.map((v,i) => {
               return (
                <MultiPurposeLine key={'pmp'+i} title={v.name} actionType="select" callback={selectCallBack} id={v.id} value={v.value}/>
               )
             })
           }
          </>
        )
}