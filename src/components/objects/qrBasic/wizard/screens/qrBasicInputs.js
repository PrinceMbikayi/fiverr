import React from 'react';
import {useContext,useState,useRef,useEffect} from 'react';

import { useTranslation } from 'react-i18next';
import { useNavigation,useRoute } from '@react-navigation/native';
import { useTheme } from '_theming/themeProvider';

import Template from '_brand/templates/components/objects/qrBasic/wizard/screens/qrBasicInputsTemplate.js';


const QrPublicWizardInputsScreen = (props) => {

    const isMounted = useRef(false)
    const { t, i18n } = useTranslation();
   
    
   const navigation = useNavigation();
   const route = useRoute();
   const navigationParams = route?.params || {}; 
   
    const {itemId,update : isUpdate, productId : atHomeObjectType,deviceSn,deviceUid} = navigationParams || {}
   
    const [startInstallIndex, setStartInstallIndex] = useState(0);
    const [startInstallCurrentPageTitle,setStartInstallCurrentPageTitle] = useState(t("doorkeeper:SETUP_TITLE"));  
  

    // DID MOUNT   
    useEffect(() => {
        isMounted.current = true;       
        if(isUpdate) {
                //   
        }
        // WILL UNMOUNT
        return () => (isMounted.current = false)
      }, []);

      
      const goBack = () => {       
        navigation.navigate('AddProduct')
      }
 
      const goBackStartPager = () => {
        setStartInstallIndex(startInstallIndex-1)
      }



    const onSubmit = (values) => {
      console.log('yoyoy',values)
      const params = {family_name:values.family_name,comment:values.comment,deviceSn:deviceSn,deviceUid:deviceUid};
      navigation.navigate("AddQrBasicPhoto",params)
    }


    return (
      <Template {...{onSubmit,goBack,goBackStartPager}}/>
    )        
}

export default QrPublicWizardInputsScreen