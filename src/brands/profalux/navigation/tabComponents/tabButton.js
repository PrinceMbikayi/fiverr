import React from "react";
import {View,Button,TouchableOpacity,Text} from 'react-native'

const  MyTabButton = (props) => {

    console.log("MyTabButton",props)
    const {navigation,title = 'glop',destination,callback,icon} = props;
    console.log("icon",icon)
  
    return (
        <View style={{flex:1,minHeight:32}}>
            <TouchableOpacity
                    style={{alignItems:'center',justifyContent:'center',padding:8}}
                    onPress={() => {
                      callback(destination);
                    }}
        >
            {icon && 
                <View style={{height:20,width:20}}>
                    {icon}
                </View>
            }
            <Text>{title}</Text>
        </TouchableOpacity>
        </View>
        
    );
  }


  export default MyTabButton