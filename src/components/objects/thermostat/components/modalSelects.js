/* à reporter sur master production */

import React, { Component } from 'react';
import { View, Text,SafeAreaView,TouchableOpacity} from 'react-native';
import styled from 'styled-components/native';


import { useTheme } from '_theming/themeProvider';


export const MultiSelectRender = (props) => {

    const {theme} = useTheme();
    const {type,title,addMore,options,selection,textColor =  theme.onBody} = props;

  
    const mColor = textColor || "green"


    return (
        <View style={{flexWrap: 'wrap',alignItems: 'flex-start',flexDirection:'row',marginTop:10,marginBottom:10}}>
        {
            selection.map((v,i) => {
                 const _obj = options[v]
                return ( 
                            <SelectedItemWrapper color={textColor}>
                                <Text style={{color:mColor,paddingLeft:10,paddingRight:10}}>{_obj.name}</Text>
                            </SelectedItemWrapper>                       
                        )
             })
        }
            <SelectedItemWrapper style={{width:30}} color={textColor}>
                    <TouchableOpacity onPress={()=> {addMore(type,title)}} style={{alignItems:'center',justifyContent:'center'}}>
                        <Text style={[{color:textColor,fontSize:24,borderWidth:1,borderColor:'transparent'},(Platform.OS === 'ios') ? {marginTop:-4}:{}]}>+</Text>
                    </TouchableOpacity>
            </SelectedItemWrapper>
        </View>
    )
}


export const SimpleSelectRender = (props) => {
        //<SimpleSelectRender options={delay_options} selection={selectedDelay} placeHolder={placeholderDelay} type="delay" addMore={onOpenSimplePopUp}/> 
        const {options,title,selection,placeHolder,type,addMore} = props;

        console.log("SimpleSelectRender props",props);
        const {theme} = useTheme();
        const textColor = theme.onBody


        return (
            <TouchableOpacity onPress={() => addMore(type,title)} style={{justifyContent:'center',marginTop:10,marginBottom:10,paddingLeft:20}}>
                <>
                {Object.keys(selection).length === 0 &&
                    <Text style={{color:textColor}}>{placeHolder}</Text>
                }
                {Object.keys(selection).length !== 0 &&
                    <Text style={{color:textColor}}> {'>'} {selection.item}</Text>
                }                
                </>
            </TouchableOpacity>
        )
    }

//-----------------------------------------------------
    const SelectedItemWrapper = styled.View`

    margin-right:10px;
    border-color:${props => props.color || 'red'};
    border-width:1px;
    height:30px;
    align-items:center;
    justify-content:center;
    border-radius:15px;
    margin-bottom:10px;
   
   
    
`;



