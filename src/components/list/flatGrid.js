import React from 'react';
import { StyleSheet, Text, View, Image,Dimensions } from 'react-native';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/native';

import { LightPleasureItem } from '_components/ui/lightPleasure';



const areEqual = (prevProps, nextProps) => {
    
    const noReRender = (prevProps.lightPleasures === nextProps.lightPleasures)
   //console.log("noReRender",noReRender);
   return noReRender;
    


    // no render -> return true;
}

export const FlatGrid = React.memo(props => {

    const { t, i18n } = useTranslation();
    const lightPleasures = props.lightPleasures;

    const callback = (index) =>  {
        //console.log("in flatgrid", index)
        props.callback(index);
    }
    const FillGrid = () => {


        return (
            lightPleasures.map(function (lp,index) {
                return (
                    <View style={[styles.box]} key={"lp"+index.toString()}>
                        <LightPleasureItem color={lp.color} label={t(lp.label)} index={index} callback={callback}/> 
                    </View>
                )
              })

        )


    }



    return (
        <View style={{flex:1}}>
            <View style={{flexDirection:"row",flexWrap:'wrap',justifyContent:'space-around'}}>
               
                <FillGrid/>
            </View>
        </View>
           
       
    )

},areEqual);

const boxWidth = (Dimensions.get('window').width / 4.0)

const styles = {
    box:{
        flex:1,
        justifyContent: 'center',
        alignItems:'center',
       
        minWidth:boxWidth,
        width: boxWidth,
        height:boxWidth,
        
       
    }
}