import React from 'react';
import {useEffect,useState,useCallback} from 'react';
import { Image} from 'react-native';
import { useSelector} from 'react-redux';
import { getObjectById,getDefaultImage } from '_helpers/selectors';

export const QrCodeVDPImage = (props) => { 

    const { image,itemId,width : imgWidth,height,radius,selected} = props;     

    // image  
    //const defaultImage = useSelector(state =>getDefaultImage(state,itemId)); 
    const [imageSource, setImageSource] = useState(image);

    
    useEffect(() => {     
       setImageSource(image);
       
    }, [image]); 
    

    useEffect(()=> {
        if(selected) setImageSource(selected)
    },[selected])

    const [calcSize, setCalcSize] = useState(null);

    const onLayout = useCallback(event => {
        const { width, height } = event.nativeEvent.layout;       
        setCalcSize({ width, height });
      }, []);

    return (
        <Image source={imageSource} no_onLayout={onLayout} fadeDuration={0} style={{height: calcSize?.width || imgWidth, width: imgWidth,borderRadius:radius, aspectRatio:1,alignSelf:'center'}} />
      
    )
}
