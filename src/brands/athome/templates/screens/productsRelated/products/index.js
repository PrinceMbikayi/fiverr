import React from 'react';

import {SafeAreaView,Alert,Text, Platform,BackHandler, View} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation,useRoute } from '@react-navigation/native';

import { useTheme} from '_theming/themeProvider'
import { HeaderWithMenu } from '_components/headers/header-with-menu';

import {AutomatedTestIdDisplay} from '_components/objects/@common/testAutomation/AutomatedTestId';
import {PageBody,OverBody} from '../../../styled/index';

import AddCircle from '_brand/images/icons/app/AddCircle';

const ProductsTemplateScreen = (props) => {
    
    const {children} = props
    const navigation = useNavigation();
    const { t, i18n } = useTranslation();
    const {theme } = useTheme();

    const showInfos = () => {
        console.log("voilà voilà");
        navigation.toggleDrawer();
    }
      const accessibilityLabel = "Screen_DASHBOARD";

      return (
        <SafeAreaView style={{flex:1,backgroundColor:theme.primary_2_darker ||  theme['body-with-cards'] || 'black'}} accessibilityLabel={accessibilityLabel}>
            <HeaderWithMenu title={t('SCREEN_TITLE_DASHBOARD')} noShadow bgColor="transparent"  no_extraButtons={[{action:showInfos,svgr:<AddCircle color="white"r/>}]}/>
            <AutomatedTestIdDisplay autoTestId={accessibilityLabel}/>
          
            <PageBody>
              
                {/*<OverBody pointerEvents='box-none'/>*/}
                {
                    children
                }
              
            
            </PageBody>
            
            
        </SafeAreaView>   
   
    )
    };

export default ProductsTemplateScreen;