import React, {useState,useEffect,useRef} from 'react';
import { useDispatch } from 'react-redux';

import ModalContainer from '_brand/templates/components/ui/modal/modalContainer';
import {useGlobalModal} from '_components/ui/globalModal';
import { useTranslation } from 'react-i18next';

import { useUser } from '_hooks/useUserHigher';
import {  deleteSavNotification } from '_actions/notificationPush';



/******************************** 

    USE POSTMAN TO TEST
    
*****************************/

const SavModal = (props) => {

    console.log("SavModal 2 ",JSON.stringify(props))

    const uUser = useUser();
    const {onClose,notification} = props;

   const savState = props?.notification?.message?.state;

    const globalModal = useGlobalModal();
    const dispatch = useDispatch();

    // "ACCEPTED","CANCELED","CREATED","INTERRUPTED","REJECTED","TERMINATED" 
    const statesDisplayed = ["CANCELED","CREATED","TERMINATED" ]

    useEffect(() => {   
        console.log("savState",savState)
        if(statesDisplayed.indexOf(savState) != -1) {
            doGenerateCode(); 
        }   
     
             
    }, [savState]);


   
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
        console.log("AAAALLLLOOOOOWWWW AAAACCCCCCEEESSSSSS")
   
      
        deleteNotification()
        globalModal.close();

        uUser.assAccess(true)
    }

    const onCancel = () => {
        deleteNotification()
        globalModal.close();
        uUser.assAccess(false)
    }

    const onButtonCancel = () => {
        onCancel();
       
    }

    const simpleClose = () => {
        uUser.assAccess(false)
        globalModal.close();
    }


  const popupButtons = () => {
    return [
               
            ]
    }

    const deleteNotification = () => {
        console.log("onCancel acivated cb");
        const toDispatch = deleteSavNotification();       
        dispatch(toDispatch);
    }

   
                            
                  


    const doGenerateCode = () => {


       let dynContent = {title:"no title",body:"no body",buttons:[]}

        switch(savState) {
            case "TERMINATED" : 

                dynContent = {
                    "title" :"ASS_ACCESS_TERMINATED_TITLE",
                    "body" : "ASS_ACCESS_TERMINATED_BODY",
                    "buttons" : [
                                    {label:"OK",callback:simpleClose},                                                            
                                ]
                    }
                break;
            
            case "CREATED" : 

                dynContent = {
                    "title" :"ALLOW_ASS_ACCESS_TITLE",
                    "body" : "ALLOW_ASS_ACCESS_BODY",
                    "buttons" : [
                                    {label:t(tns+":"+"AGREE"),callback:onAllowAccess},
                                    {label:t("CANCEL"),callback:onButtonCancel,altStyle:true,noBorder:true}
                                ]
                    };
                    break;

            case "CANCELED" : 

                    dynContent = {
                        "title" :"ASS_ACCESS_CANCELED_TITLE",
                        "body" : "ASS_ACCESS_CANCELED_BODY",
                        "buttons" : [
                                         {label:"OK",callback:simpleClose},       
                                    ]
                        };
                        break;


                    
    
        }



        console.log("doGenerateCode !!!!!!!!!!!",dynContent)
        const content = <ModalContent 
                            title = {t(tns+":"+dynContent.title)}
                            description = {t(tns+":"+dynContent.body)}
                            buttons={dynContent.buttons}
                            
                        /> 
        globalModal.setContent(content,{type:'centered'},onCancel);    
      
        globalModal.open();
    }
    //---------------------------------
    return (<></>)
    ;
}

export default SavModal