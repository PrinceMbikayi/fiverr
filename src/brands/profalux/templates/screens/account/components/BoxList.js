import React from 'react';
import {useState,useEffect, useRef} from 'react';
import {Platform,BackHandler, StyleSheet, View, Text, Pressable} from 'react-native';
import {useSelector,useDispatch} from "react-redux";
import { useTranslation } from 'react-i18next';

import { useNavigation,useRoute } from '@react-navigation/native';


import { useTheme} from '_theming/themeProvider'
import {getAllObjects,getObjectsByTypeName,getUser, getObjectsByTypes} from '_helpers/selectors';

import {getObjectById} from '_helpers/objects';

import {BoxItem} from '_brand/templates/screens/account/components/BoxItem'

export const BoxList = (props) => {

    const {onPress, isPressable, hasBorder} = props
    
    const { t, i18n } = useTranslation();
    const {theme } = useTheme();
    const nonConnectedGray = theme?.prflxNonConnectedGray || '#CCC'

    const dispatch = useDispatch();
    
    const navigation = useNavigation();
    const route = useRoute();
    const navParams = route?.params || {}; 



    const gateways = useSelector(state =>getObjectsByTypeName(state,"Gateway"));
    const [gatewayList, setGatewayList] = useState([]);

    const gatewayFlagRef = useRef(0);

    useEffect(() => {
        console.log("GATEWAYS LIST :", gateways)
        let gatewayList = [];
        let gtwList;
        Array.isArray(gateways) ? gtwList = gateways : gtwList = [gateways]
        console.log("IS GATE WAY PRESENT  :", gateways)
        console.log(" LET'S CHECK IF WE HAVE AN ARRAY OF GATEWAY :", gtwList)
        gtwList.map((gtw)=>{
            const gtwData =  getObjectById(gtw)
            console.log(" GATE WAY DATA :", (gtwData?.realName).slice(0,10))
            //if( (gtwData?.realName).slice(0,10) !='WebBrowser' ) gatewayList.push(gtwData?.id)
            //if(gtwData?.realName != 'System' && gtwData?.realName != "ABox" && (gtwData?.realName).slice(0,10) !='WebBrowser'  ) gatewayList.push(gtwData?.id)//&& (gtwData?.realName).length == 24
            if(gtwData?.realName != 'System' && (gtwData?.realName).slice(0,10) !='WebBrowser' && (gtwData?.realName).length == 24 ) gatewayList.push(gtwData?.id)

        })
        setGatewayList(gatewayList)
        },[gateways]);

        useEffect(()=> {
            //console.log("Gate way list to process :", gatewayList)
        },[gatewayList]);


        console.log("ALL_MY_BOX :", gateways)

        const handlePress = (id)=>{
            console.log('BOX_ID :', id);
            onPress(id)
        }

        return(
            <View>
                {gatewayList.map((gtw, index)=>{
                    const gtwData =  getObjectById(gtw)
                    console.log("Gate way list to process :", gtwData)
                    const connected = gtwData?.connected
                    


                    return(
                        <Pressable 
                            onPress={()=>handlePress(gtw)} 
                            disabled={isPressable ? false : true}
                            key={index} 
                            style={{ 
                                backgroundColor:hasBorder ?'white' :'transparent', 
                                //backgroundColor:hasBorder ? (connected ? 'white' : nonConnectedGray) :'transparent', 
                                marginTop:10, borderRadius:10, padding:0, borderColor:'orange', 
                                borderWidth:hasBorder ? 1:0
                                }}>
                            <View style={{
                                            opacity:1
                                            //opacity:connected ? 1 : 0.5
                                        }}>
                                <BoxItem
                                    itemId = {gtw}
                                    onPress ={() => console.log("Hello")}
                                    boxName={gtwData?.name}
                                    boxIndex = {index +1}
                                    imgSource={require('_brand/templates/screens/addObject/images/boxCalyps.png')}
                                    imgStyle={{ width: 150, height: 100, marginTop: 5 }}
                                />
                            </View>
                        </Pressable >
                    )
                })}

            </View>
        )
}

const styles = StyleSheet.create({
    validateButton: {
        color:"#FFFFFF",
        borderRadius: 0,
        height: 40,
        marginBottom: 10,
        backgroundColor:'#3E495E',
        width:'50%',
        borderRadius:12,
    },
    text: {
        marginTop:23,
        fontWeight:'400',
        fontSize: 16,
        textAlign:'center',
        color: '#3E495E'
    },
})