import React, { Component } from 'react';
import { useEffect,useState } from 'react';
import { View} from 'react-native';
import AccessButton from '_components/forms/accessButton';


/**
 * @typedef Button
 * @property {string} title
 * @property {function} callback
 */


/**
 * 
 * @param {Object} props 
 * 
 */
export const ModalFooter = (props) => {


    const {description,callback} = props;
    const [buttons,setButtons] = useState([]);

    useEffect(()=> {
        if(description) {
            setButtons(description?.buttons || [])
        }
    },[])

    const buttonCallback = (id) => {
        console.log("buttonCallback",id)
        if (callback) {
            callback(id)
        }
    }


    return (
        <View style={{flexDirection:'row',justifyContent:'space-between',paddingLeft:15,paddingRight:15,paddingTop:10}}>
            {buttons.map((v,i)=> {
                return (
                            <View  style={{width:(buttons.length == 1)?'100%':'48%'}}>
                                <AccessButton specialColor="#000000" onPress={() => buttonCallback(v?.id)} title={v?.title}/>
                            </View>
                        )
                })
            }
        </View> 
    )
}