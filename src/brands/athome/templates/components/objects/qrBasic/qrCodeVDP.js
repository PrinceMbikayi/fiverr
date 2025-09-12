
import './locales'

import React from 'react';
import {useEffect,useState} from 'react';

import { useTheme } from '_theming/themeProvider';
import {useQrObject} from '_hooks/object/qrObject';
import {QrCodeVDPWidgetView} from './QrCodeVDPWidgetView';


/**
 * it's the Virtual Video DoorPhone Widget intel container in list view
 * @param {Object} props 
 * @param {number} props.itemId
 * @param {function} [props.showDetailsCallback]
 * @returns JSX
 */
export const TypeQrCodeVDP = (props) => {    

  
    const { itemId,activeStatusesImages,typeName,showDetailsCallback} = props;
    const uObject = useQrObject(itemId);
    const {widgetReferenceDatas,statuses,name,connected,status,getStatus : getMyStatus,execute,toggle} = uObject;
   // console.log("uObject",uObject);
    const {image,getImage,tempImage,setTempImage} = uObject;

    useEffect(()=> {
        //console.log("image just change",image)
        setImageSource(image)
    },[image])


    const {theme,baseColors} = useTheme();
    const iconColor = theme['card--color--icon'];
    
    
    const currentObjectDatas = widgetReferenceDatas; //useSelector(state => getObjectById(state,itemId)) 
    const [openActions,setOpenActions] = useState([]);

    const settingsActions = () => {
        if(currentObjectDatas.actions) {

        
            const toOpen = currentObjectDatas.actions.reduce((r,v,i) => {
                if(v.name == "STRIKE" || v.name == "GATE")r.push(v.name)
                return r
            },[])
            setOpenActions(toOpen)
        }
    }   
    // addImage
    useEffect(() => {       
        //console.log("statuses à changé",statuses);
        //onDefaultImageError("redraw")
    }, [statuses]); 

    useEffect(() => {       
        //console.log("statuses.refreshSnap à changé",statuses.refreshSnap);
        getImage();
    }, [statuses.refreshSnap]); 

   
    // just needed when doorkeeper is created
    useEffect(() => {       
        settingsActions();
    }, [currentObjectDatas.actions]); 

      
    const onLayout = (e) => {
       //
    }  
    const imgWidth = 100;
    const [myHeight,setMyHeight] = useState(imgWidth+20);
    const textColor = theme['card--color--text'];
    // image
    //const default_image = require('./assets/default-image.png');
    const [imageSource, setImageSource] = useState(image);
    
    const onDefaultImageError = async(err) => {

        console.log("--------------- onDefaultImageError --------------- => onDefaultImageError",err);
        console.log("err")
        console.log("--------------- onDefaultImageError ---------------")
    }


    return (
       <QrCodeVDPWidgetView imageSource={imageSource} family_name={statuses?.family_name} comment={statuses?.family_name} />
     
    )
}