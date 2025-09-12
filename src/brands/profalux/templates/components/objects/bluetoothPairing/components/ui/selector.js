
import {HeaderWithBack} from '_components/headers/header-with-back';
import React from 'react';
import {useState,useRef,useEffect} from 'react';
import { View,Text,SafeAreaView,ScrollView} from 'react-native';
import styled from 'styled-components/native'
import {H1,P} from  '_brand/templates/styled'; 
import Button from '_brand/templates/components/ui/Button';
import { find  as _find} from 'lodash';

import { MultiPurposeLine } from "_components/list/multiPurposeLine";



const ListSelector = (props) => {

    const {height = 64,callback,myList = [],emptyLabel} = props;

    console.log("** ListSelector",props);

    const Line = (props) => {
      const {label} = props;
      return (
              <Text>{label}</Text>
      )
    }

    useEffect(()=> {
      console.log("++++list",myList)
    },[myList]);


    const selectorCallback = (id) => {
      if(callback) {
        
        const selected = _find(myList,{label : id});
        const retValue = selected?.value || selected?.label;
        console.log("selectorCallback",retValue);
        callback(retValue);
      }
    }

     return  <Wrapper style={{height:height}}>
                <>
                {
                  myList.map((v,i) => {
                    
                    return (
                      <MultiPurposeLine title={v.label} paddingVertical={8} fullTouchable callback={selectorCallback} id={(v.label)} iconSize={12} key={"myList_"+i+"_key"}/>
                   
                    )
                  })
                }
                {(myList.length == 0 && emptyLabel) &&

                    <P>{emptyLabel}</P>
                
                }
                </>
            </Wrapper>       
  }




  export default ListSelector

  const Wrapper = styled.ScrollView`
    background-color:transparent;
    border-color:#CCC;
    border-width:1px;
    margin-top:12px;
`;