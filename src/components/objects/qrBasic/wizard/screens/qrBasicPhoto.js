import React from 'react';
import {useState,useRef,useEffect} from 'react';
import { useNavigation,useRoute} from '@react-navigation/native';
//----------------------------------------------------------------------
import SelectPhoto from '../../components/settings/selectPhoto';
import QrPublicWizardPhotoTemplateScreen from '_components/objects/qrBasic/wizard/screens/qrBasicPhotoTemplate.js';


const QrPublicWizardPhotoScreen = (props) => {

    const isMounted = useRef(false);   
    
   const navigation = useNavigation();
   const route = useRoute();
   const navigationParams = route?.params || {};    
   const {name,extra} = navigationParams || {}
 
   
    // DID MOUNT
    // exemple mount / unmount fonctional component
    useEffect(() => {
        isMounted.current = true;       
       
        // WILL UNMOUNT
        return () => (isMounted.current = false)
      }, []);

    const goBack = () => {       
      navigation.navigate('AddProduct')
    } 
    
    // ----------------------------------    
    const [imageSource,setImageSource] = useState();

    useEffect(()=> {
     // just refresh
    },[imageSource]);   

    // ----- PHOTO SELECT ---------
    const selectPhotoRef = useRef(); 
    const selectPhotoPickedRef = useRef({}); 

    const onOpenSelect = () => {  
      console.log(("la la la"))    
      selectPhotoRef.current.open(); 
    }
    const onSelectPhotoCallback = (cbProps ) => {
      const {action,source,base64data} = cbProps;      
      selectPhotoPickedRef.current = {"base64data":base64data,type:((source.indexOf('.jpeg')!= -1 || source.indexOf('.jpg')!= -1 ))? "jpeg" :"png"}
     
      switch(action) {
        case 'update' :
          if(source)setImageSource({uri:source});
          break;
      }
    }
    // ------------------------

    const onContinue = () => {
      console.log("onContinue",imageSource?.uri);
      // exemple spread condition
      const params = {...navigationParams,...selectPhotoPickedRef.current,...(imageSource?.uri && {upload: imageSource?.uri})}
      console.log("params",params);
      navigation.navigate("AddQrBasicComplete",params)
    }

    return (
      <QrPublicWizardPhotoTemplateScreen glop="glop" {...{imageSource,onContinue,onOpenSelect,goBack}}>
         <SelectPhoto ref={selectPhotoRef} callback={onSelectPhotoCallback} zIndex={5}/>     
      </QrPublicWizardPhotoTemplateScreen>
    )
}

export default QrPublicWizardPhotoScreen