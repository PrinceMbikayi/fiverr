import React from 'react';
import {useContext,useState,useRef,useEffect} from 'react';
import { useSelector,useStore} from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useNavigation,useRoute,StackActions,CommonActions } from '@react-navigation/native';

import {refreshObjectAction} from '_actions/asyncActions';
import {createQrCodeVDP} from '_api/objects';
import {setOptions} from '../../utils/settings';
import { getObjectsByNames } from '_helpers/selectors';

import QrPublicWizardCompleteTemplateScreen from '_brand/templates/components/objects/qrBasic/wizard/screens/qrBasicCompleteTemplate.js';


const QrPublicWizardCompleteScreen = (props) => {

    const isMounted = useRef(false)
    const { t, i18n } = useTranslation();

    
    const store = useStore()
    const navigation = useNavigation();
    const route = useRoute();
    const navigationParams = route?.params || {};   
    const {family_name ,comment,base64data,type,deviceUid} = navigationParams || {};    
    const [currentStep,setCurrentStep] = useState("upload");    
   

    const goCheck = () => {
      setCurrentStep("success");
    }

    const allObjectNames = useSelector(getObjectsByNames);

    const generateName = () => {
      const defaultName = t("qrbasic:DEFAULT_NAME");
      if(allObjectNames?.[defaultName] == undefined)return defaultName;
      let canUseName = false;
      let index = 0;
      while(!canUseName) {
        index++;
        if(allObjectNames?.[defaultName+" "+index] == undefined)canUseName = true;
      }
      return defaultName+" "+index   

    }

    const onCreateQrCodeVDP = async() => {
      const dd = new Date();
      const objectId = (deviceUid  != "generic") ? deviceUid : dd.getTime(); //"QrCodeVDP_TEST_"+dd.getTime(); 

      const name = generateName();
      console.log('name',name,"id",objectId)
      
      // ? response is global ? axios ??
      //console.log("response 222",response);

      const response = await createQrCodeVDP(name,objectId).catch((err)=> console.log("erreur creation",err));
      console.log("response",response);
      if(response?.errCode == 200) {
         
        const itemId = response?.id;
        const hasImage = (base64data) ? {"base64data":base64data,"type":type} : {};
        const respOptions =  await setOptions(itemId,{'family_name':family_name,'comment':comment,...hasImage}).catch((err)=> console.log("erreur respOptions",err)); ;
        console.log("respOptions",respOptions); 
         refreshObjectAction(itemId,store)
         goCheck();      
      }
    }

    // DID MOUNT   
    useEffect(() => {
        isMounted.current = true; 
        onCreateQrCodeVDP(); 
        // WILL UNMOUNT
        return () => {
            isMounted.current = false;
          
          }
      }, []);
      const goBack = () => {       
        navigation.navigate('AddProduct')
      }

      

    // Attention à la version wizard sans props goBack    

    
    const goToSelectProduct = (error) => {

      navigation.dispatch(
        CommonActions.navigate({
          name: 'AddProduct'            
        })
      );
      
     //if(!error) navigation.navigate("ProductDetails",params); 
     navigation.navigate('Home');      
    }

    //------------------------------------------------
  


    return (

      <QrPublicWizardCompleteTemplateScreen {...{currentStep,goToSelectProduct,goBack}}/>
        
    )        
}

export default QrPublicWizardCompleteScreen

