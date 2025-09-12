import React from 'react';
import {useState} from 'react';
import { View,Text,Pressable} from 'react-native';
//-----------------------------------------------------------
import { useTheme } from '_theming/themeProvider';

// ========================> component begin  here

export const TabSelector = (props) => {
        

        const {containerStyle,tabStyle,tabStyleSelected,tabTextStyle,tabTextStyleSelected} = props;
        const tabs = props.tabs;
        const callback = props.callback;
        const [selectedTabIndex,setSelectedTabIndex] = useState(0)

        const tabSelect = (tabIndex) =>  {
            
            setSelectedTabIndex(tabIndex)
            if(callback)callback(tabs[tabIndex].tabId);
        }

        const containerStyleBase = {flex:1,height:40,minHeight:40,maxHeight:40,backgroundColor:'transparent',flexDirection:'row',justifyContent:'center',alignItems:'center'};
        const extraContainerStyle = props.containerStyle || {};

        // ------ sub component -------------
        const HeaderTab = (props) => {

            const onSelect = () => {
                
                if(props.callback) {                   
                    props.callback(props.tabIndex);                   
                }
            }
        
            const styleBase = {flex:1,minHeight:40}
            const styleExtra = props?.tabStyle || {}
            const styleExtraSelected = props.tabStyleSelected || {}

            const styleTextBase = {textTransform:'uppercase'}
            const styleTextExtra = props.tabTextStyle || {}
            const styleTextExtraSelected = props.tabTextStyleSelected || {}
            
            return (
                <View style={[styleBase,styleExtra,(props.tabIndex == props.selectedTabIndex)? styleExtraSelected:{}]}>
                        <Pressable onPress={onSelect} style={{alignItems:'center',justifyContent:'center',height:'100%'}}>
                            <View>
                                <Text style={[styleTextBase,styleTextExtra,(props.tabIndex == props.selectedTabIndex)? styleTextExtraSelected:{}]}>{props.title}</Text>
                            </View>
                        </Pressable>
                    </View>
            )
        }




        //--------------- the component ----------------------------
        return (
            <View style={[containerStyleBase,extraContainerStyle]}>
                {
                    tabs.map((val,i) => {
                        return (
                            <HeaderTab  title={val.title}
                                        tabId={val.tabId}
                                        tabIndex={i}
                                        selectedTabIndex={selectedTabIndex}
                                        containerStyle={containerStyle}
                                        tabStyle={tabStyle}
                                        tabStyleSelected={tabStyleSelected}
                                        tabTextStyle={tabTextStyle}
                                        tabTextStyleSelected={tabTextStyleSelected}
                                        callback={tabSelect}
                                        key={"headerTab_"+i}
                                                                           
                                        />
                        )
                    })
                }
            </View>
        )


}