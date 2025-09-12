import React from 'react';

import {SafeAreaView, View} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation,useRoute } from '@react-navigation/native';

import { useTheme} from '_theming/themeProvider'
import { HeaderWithMenu } from '_brand/templates/components/headers/header-with-menu';

import {AutomatedTestIdDisplay} from '_components/objects/@common/testAutomation/AutomatedTestId';
import {iconsJs} from '_brand/utils/iconsJs';
import { MultiPurposeWidgetLine } from "_brand/templates/components/objects/common/MultiPurposeWidgetLine";
import { ScrollView } from 'react-native-gesture-handler';


const ProductsTemplateScreen = (props) => {
    
    const {children} = props
    const navigation = useNavigation();
    const { t, i18n } = useTranslation();
    const {theme } = useTheme();

    const widgetbgColor = theme?.prflxwidgetbgColor||'white';

    const showInfos = () => {
       console.log("voilà voilà");
        navigation.toggleDrawer();
    }
    const handleOnPress = (id) =>{
        navigation.toggleDrawer();
    }
      const accessibilityLabel = "Screen_DASHBOARD";


      const bgColor = theme?.prflxbgColor || 'white';
      const headerBgColor = theme?.prflxHeaderBackground || 'white';
      const borderColor = theme?.prflxBorderColor || 'red';
      const textColor = theme?.prflxTextColor||'black'
     

    console.log("ProductTemplateScreen ready !!!!!!")

      return (
            <SafeAreaView style={{height:'100%', backgroundColor:'white' || bgColor}} accessibilityLabel={accessibilityLabel}>
                {/* <StatusBar no_hidden={true} barStyle="dark-content"/> */}
            
                <View style={{flex:1, backgroundColor:'transparent'}}>

                                     {/* marginTop:-60, paddingTop:65.5, height:Platform.OS == "ios"? '16%':'18.5%'*/}
                    <View   style={{backgroundColor:headerBgColor}}>
                        <HeaderWithMenu 
                            noShadow 
                            bgColor={"transparent"} 
                            hideBurger = {false} 
                            extraButtons={[
                                    {
                                        action:showInfos,
                                        //svgr:<AddCircle color="white"r/>
                                        svgr:<MultiPurposeWidgetLine 
                                                isPressable={false}
                                                icons={[iconsJs.kebabIcon]} 
                                                iconSize={25}
                                                //onPress = {handleOnPress} 
                                                //active = {sendCurrentActive}
                                                //iconWrapperStyle = {{borderColor:textColor, borderWidth:2}}
                                            />
                                    }
                                ]}/>
                    </View> 
                    <AutomatedTestIdDisplay autoTestId={accessibilityLabel}/>
                    <ScrollView 
                            style={{height:'100%', backgroundColor:bgColor,  paddingHorizontal:10,}}
                            showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}
                        >
                        {
                            children
                        }
                    
                    <View style={{height:51, width:300, backgroundColor:'transparent'}}></View>
                    </ScrollView> 
                    

                </View>
                </SafeAreaView> 
    )
    };

export default ProductsTemplateScreen;