import React, {useState,useEffect,useRef} from 'react';
import { useDispatch } from 'react-redux';

import ModalContainer from '_brand/templates/components/ui/modal/modalContainer';
import {useGlobalModal} from '_components/ui/globalModal';
import { useTranslation } from 'react-i18next';

import {  deleteSavNotification } from '_actions/notificationPush';

const SavModal = (props) => {




const {onClose} = props;

   

    const globalModal = useGlobalModal();
    const dispatch = useDispatch();

    useEffect(() => {      
       doGenerateCode(); 
             
    }, []);


   
    /************** SAV  *****************/

    const { t, i18n } = useTranslation();
    const tns = "account"
    const ModalContent = (props) => {
        return (
            <ModalContainer {...props}/>
        )
    }

    const onAllowAccess = () => {

        //todo
        deleteNotification()
        globalModal.close();
    }

    const onCancel = () => {
        deleteNotification()
        globalModal.close();
    }

    const onButtonCancel = () => {
        onCancel();
       
    }

  const popupButtons = () => {
    return [
                {label:t(tns+":"+"AGREE"),callback:onAllowAccess},
                {label:t("CANCEL"),callback:onButtonCancel,altStyle:true,noBorder:true}
            ]
    }

    const deleteNotification = () => {
        console.log("onCancel acivated cb");
        const toDispatch = deleteSavNotification();       
        dispatch(toDispatch);
    }



    const doGenerateCode = () => {
        console.log("doGenerateCode !!!!!!!!!!!")
        const content = <ModalContent 
                            title = {t(tns+":"+"ALLOW_ASS_ACCESS_TITLE")}
                            description = {t(tns+":"+"ALLOW_ASS_ACCESS_DESCRIPTION")}
                            buttons={popupButtons()}
                            
                        /> 
        globalModal.setContent(content,{type:'centered'},onCancel);    
      
        globalModal.toggle();
    }
    //---------------------------------
    return (<></>)
    ;
}

export default SavModal