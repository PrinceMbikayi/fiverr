import React from 'react';
import {useEffect,useState,useContext} from 'react';
import { View,Text,TouchableHighlight } from 'react-native';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/native';
import {SvgCss} from 'react-native-svg';
import { useNavigation,useRoute,StackActions } from '@react-navigation/native';



import { useTheme } from '_theming/themeProvider';
import PureIconRender from '_components/pureIconRender';
import {domusIcons} from '_assets/icons/domusIcons';
import {StyledIconWrapperView} from '_components/ui/styled/icons';
import {Api} from '_api';

import {airHomeIcons} from '_assets/icons/airhomeIcons';

export const TypeSolarPanel = (props) => {
    
    const { t, i18n } = useTranslation();
    const { statuses,itemId,activeStatusesImages,typeName} = props;
    const {theme} = useTheme();
    const iconSize = 64;
    const iconFillColor = theme["card--color--icon"];    
    const iconWrapperColor = theme["card--color--icon--wrapper--background"] || "transparent";
    const navigation = useNavigation();
    const route = useRoute();
    const navigationParams = route?.params || {};
    
    const iconXmlSource = airHomeIcons['solarPanelAirwell']
   

    const[isOnOff,setIsOnOff] = useState(false);

    useEffect(() => {
       
        const possibleStatuses = ['on','off','open','close'];
        if(statuses == undefined) {
            setIsOnOff(false);
        } else {
            const ret = possibleStatuses.indexOf(statuses.status) != -1
            setIsOnOff(ret)
        }
        
    }, []);

    const displayTemp = () => {
        return "3.5 kW"
    }

    const expandMore = () => {
       
        navigation.navigate('ProductDetails',{itemId:itemId});    
    }

    return (
            <StyledMainView> 
                <TouchableHighlight disabled activeOpacity={0.2} underlayColor="#DDDDDD" onPress={()=>{expandMore()}} style={{flex:1,alignItems:'center',justifyContent:'center'}}>  
                    <View style={{flex:1,flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
                        <View style={{flex:1,alignItems:'center',justifyContent:'center',height:'100%'}}>            
                            <StyledIconWrapperView size={iconSize*(1.6)} backgroundColor={iconWrapperColor} > 
                                <TouchableHighlight disabled activeOpacity={0.3} underlayColor="#DDDDDD" onPress={()=>{togglePlug()}}>                       
                                    <SvgCss xml={iconXmlSource} width={iconSize} height={iconSize}  fill={iconFillColor}  viewBox="0 0 48 48" preserveAspectRatio="xMinYMin slice"/>
                                </TouchableHighlight>               
                            </StyledIconWrapperView>
                        </View>
                        <View style={{flex:1,alignItems:'center',justifyContent:'center',height:'100%'}}>       
                            <ProductionText>{displayTemp()}</ProductionText>
                        </View>
                    </View>
                    
                    </TouchableHighlight>   
            </StyledMainView>
    )
}

const StyledMainView = styled.View`
                    flex: 1; 
                    min-height:150px;
                `;
const ProductionText = styled.Text`
    font-weight:bold;
    font-size:48px;
    
`;

