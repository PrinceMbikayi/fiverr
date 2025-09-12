import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator} from 'react-native';



export const LoadingAnimation = (props) =>{

    const {topText, downText, isToptext =true, isDowntext=false, children,} = props;

    return (
        <View style={{justifyContent:'center', alignItems:'center', padding:20}}>

                <View>
                        {
                        isToptext && 
                        <Text  style={styles.text}> {topText}</Text>
                    }
                    <View style={{marginTop:90}}>
                        <ActivityIndicator  size="large" color='#3E495E' style={{ transform: [{ scaleX: 2 }, { scaleY: 2 }] }}/>
                    </View>
                    {
                        isDowntext &&
                        <Text  style={[styles.text, {marginTop:90}]}> {downText} </Text>
                    }
                </View>
        </View>
    )
}


const styles = StyleSheet.create({
    text:{
        fontSize:16,
        fontWeight:'400',
        alignItems:'center',
        justifyContent:'center',
        textAlign:'center',
        color:'#3E495E'
    },
})