import React, { Component } from 'react';
import { View,ScrollView, Text,SafeAreaView} from 'react-native';
import {useContext,useState,useRef,useEffect} from 'react';

import {LineWithIcon}  from './base/lineIcon'
import { useTheme } from '_theming/themeProvider';
import AccessButton from '_components/forms/accessButton';




export const SelectBox = (props) => {

    const {isMulti,options,selectedValues} = props
    console.log("SelectBox",props)

    const { theme} = useTheme();


    const selectionCallback = (params) => {
        console.log("params",params)
        const pos = selection.indexOf(params.id)
        let newSelection = [...selection]
        if(pos!=-1) {
            newSelection.splice(pos,1)
        } else {
            newSelection.push(params.id)
        }
        setSelection(newSelection)
    }

    const selectionDirectCallback = (params) => {
        props.singleSelectionCallback(params.id);
    }

    const [selection,setSelection] = useState([])

    useEffect(() => {
        //isMounted.current = true;
        setSelection(props.selectedValues || []);
        /*
        return () => (isMounted.current = false)
        */
      }, [props.selectedValues]);




    const checkSelection = (id) => {
        return (selection.indexOf(id) != -1)
    }

    const textColor = theme['card--color--text'] || 'white'

    const lineContentColor = { iconColor:textColor,textColor:textColor,color:textColor};

    const RenderItem = (props) => {
       // console.log("RenderItem",props)
        const {option,isSelected} = props
        if(isMulti) {
            return (
               
                <View>
                    <LineWithIcon fullTouchable={true} iconRight={(isSelected)? 'minus-circle' : 'plus-circle'} isAppIcon callback={selectionCallback} params={{id:option.id}} {...lineContentColor} >
                        <Text style={{color:lineContentColor.color}}>{option.item}</Text>
                    </LineWithIcon>
                </View>
              
                )
        } else {
            return (
                <View>
                    <LineWithIcon callback={selectionDirectCallback} params={{id:option.id}} fullTouchable={true} {...lineContentColor}>
                        <Text style={{color:lineContentColor.color}}>{option.item}</Text>
                    </LineWithIcon>
                </View>
            )

        }
        
    }

    return (
        <>
       <ScrollView style={{backgroundColor:'transparent',flex:1}}>
           {
               options.map((v,i) => {
                   return (
                       <RenderItem option={v} isSelected={checkSelection(v.id)}/>
                   )
               })
           }
       </ScrollView>
       { props.validate &&
        
        <View style={{flexDirection:'row',height:60}}>
                    <View style={{flex:1}}>
                        <AccessButton title={props.cancel.label}  onPress={()=> props.cancel.callback()} specialColor={textColor}/>  
                    </View>
                    <View style={{flex:1}}>
                        <AccessButton title={props.validate.label}  onPress={()=> props.validate.callback(selection,props.validate.type)} specialColor={textColor}/> 
                    </View>
                </View>
        
       }
       </>
    )


}