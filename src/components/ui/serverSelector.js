import React, { Component, useState,useEffect,useRef } from 'react';
import {View,TouchableOpacity,Text,TextInput} from 'react-native'
import {multiServers} from '_config/AppConfig';
 
import {getServer} from '_services/storage'
 
//--- Appium -----
import {buildTestId} from '_helpers/appium';
 
 
 
 
const ServerSelector = (props) => {
 
    const {onSelectServer,selectedServerIndex,customServerUrl, customServerHandler} = props
    console.log("ServerSelector",props)   
 
    const MyInput = (mprops) => {
 
 
      const {callback} = mprops;
 
      useEffect(()=> {
        console.log("props changed",callback,mprops)
      },[callback]);
  
     
      console.log("MyInput props",mprops)
      const [customServerUrl,setCustomServerUrl] = useState("");
      const [storeServer, setStoreServer] = useState("");

      const currentServerRef = useRef
  
      useEffect(()=> {
        console.log("INIT_SERVER")
        // const init = async()=> {
        //   console.log("ServerSelector init async")
        //   const server = await getServer();
        //   setStoreServer(server)
        //   console.log("INIT_SERVER",server)
        //   let showThis = server;
        //   if(!server) {
        //     showThis = "https://profalux.avidsen.one"
        //   }
        //  if(customServerHandler) {
        //   customServerHandler(showThis)
        //  }
        //   setCustomServerUrl(showThis)
        // };
        // init();
 
      });




      useEffect(()=> {
       console.log('MY_STORE_SERVER :', storeServer);
      },[storeServer]);
 
 
      useEffect(()=> {
        console.log('PPPPPPPPHHHH', customServerHandler);
      },[customServerHandler]);
 
 
      const heyBlur = () => {
          console.log("callback",callback)
          if(callback) {
            console.log('callback exists so heyBlur',customServerUrl)
            callback(customServerUrl)
          }
      }
      const custUrl = (text) => {
        console.log("custUrl",text)
        setCustomServerUrl(text);
        console.log('CUSSSSSSTTTTT', customServerHandler );
        if(customServerHandler) {
          customServerHandler(text)
        }
       
      }
  
      return (
      <View style={{borderWidth:1,borderColor:'red'}}>
        
          <TextInput  placeholder="Enter custom URL" secureTextEntry={false}                 
                  onBlur={heyBlur}
                  onChangeText={text => custUrl(text)}
                  placeholderTextColor='black'
                  defaultValue={customServerUrl}
                    
          />
      
     
      </View>
      )
  }
 
 
 
 
  useEffect(()=> {
    console.log("customServerHandler changed",customServerHandler)
  },[customServerHandler]);
 
 
  const localSelect = (val)=>{
    console.log('VALLLLLLLL :', val);
    onSelectServer(val)
  }
 
 
 
    return (
      <>
        <View style={{flexDirection:"row",marginTop:2}}>
          {
            
            multiServers.map((v,i) => {
              console.log('SHOW_MULTI_SERVER :', v, i);
              const colWidth = (100/multiServers.length)+"%";
              const serverTest = buildTestId("server_"+v.label);
              return (
                <View style={{minWidth:colWidth}} key={"servs_"+i}>
                  <TouchableOpacity style={{backgroundColor:'red',padding:10,borderRightWidth:1
                    ,borderRightColor:'#777777',
                    backgroundColor:(i == selectedServerIndex) ?'orange':'transparent'}}
                    onPress = {()=> localSelect(i)}
                    accessibilityLabel={'server_'+v.label}
                    {...serverTest}
                    >
                    <Text style={{alignSelf:'center'}}>{v.label}</Text>
                  </TouchableOpacity>
                </View>
              )
            })
          }
      </View>
    
        <View  style={{opacity: (selectedServerIndex == (multiServers.length-1)) ? 1 : 0}}>
           {/* <MyInput customServerUrl={customServerUrl} callback={customServerHandler}/> */}
        </View>        
        </>
    )
  }
  
  export default ServerSelector;