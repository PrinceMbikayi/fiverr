import { useState, useEffect } from 'react';
import { useObject } from './index';
import { getImage,setImage } from '_components/objects/qrBasic/utils/image';
import { useSelector,useDispatch } from 'react-redux';

import * as ActionsTypes from '_actions/objectTypes';


export const useQrObject = (itemId) => {
   
   const uObject = useObject(itemId);
   
   const [image, setImage] = useState(null);
    const [tempImage, setTempImage] = useState(null);

   const getMyImage = async() => {
      
        //if(image) return image;
        const aImage = await getImage(itemId);
        setImage(aImage);
    //return aImage;
   }

   const dispatch = useDispatch();
  
   const setMyTempImage = (value) => {
        console.log("setMyTempImage alors on change !!",value);
        console.log("ActionsTypes",ActionsTypes)
        dispatch({'type':ActionsTypes.RUNTIME_DATAS,'payload':{'itemId':itemId,'key':"tempImage",'value':value}})
        
        //setTempImage(value)
   }


   useEffect(()=> {
       const init = async() => {
        getMyImage();
       }
       init();
   },[])
 

    return {
         ...uObject,
         getImage:getMyImage,
         image:image,
         setTempImage:setMyTempImage,
         tempImage:tempImage,
    }
}