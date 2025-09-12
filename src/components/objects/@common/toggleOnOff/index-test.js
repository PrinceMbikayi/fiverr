import React from 'react';
import {useEffect,useState,useRef} from 'react';
import { Text } from 'react-native';
import { View} from 'react-native'; // be careful it's used in Styled Component
// --- Appium ----
import { Platform } from 'react-native';
import { getBundleId } from 'react-native-device-info';


import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components/native';

import {updateStatus,updateMeStatus,updateGroupStatus} from '_actions/objects';
import { useTheme } from '_theming/themeProvider';
import { WidgetIconButton } from '@components/ui/buttons/widgetIconButton';

import {Api} from '_api';
import { Assets} from '_helpers/assets';

import {getObjectById,getWidgetReference} from '_helpers/selectors';
import {useAppGlobal} from '_helpers/appGlobalProvider';

import { useObject } from '_hooks/object';

import {StatusPanel} from '_components/objects/@common/testAutomation/statusPanel';

/**
 * Toggle On / Off Widget needed for Plug Widget render and others
 * 
 * @param {Object} props
 * @param {object} props.statuses object statusDictionary
 * @param {number} props.itemId
 * @param {string} props.typeName
 * @param {string} [props.newIcon] in case typeName is not present in domusIcons
 */

const getStatusesImages = (itemId) => {
    let activeStatusesImages = (itemId != undefined) ? Assets.getStatusesIcons(itemId) : [];
    return activeStatusesImages;
}

const areEqual = (prevProps, nextProps) => {
  
    console.log("ToggleOnOffComp -------> areEqual",nextProps);
    return true;
    const noReRender = (prevProps.callback === nextProps.callback)
    return noReRender;
    // no render -> return true;
}

const ToggleOnOffComp = (props) => {
   
    /*
    const {itemId} = props
    const uObject = useObject(itemId);
    const {name,connected,status,getStatus : getMyStatus,execute,toggle} = uObject;
    
    console.log("nonono yeah",name,connected,getMyStatus('__firmware'),status)

*/
    const {itemId} = props;
    const uObject = useObject(itemId);
    const {getId,objectDatas,execute} = uObject;
    //const objectDatas2 = useSelector(state => state?.objects?.entities?.objects?.[itemId]);
    //const objectDatas2 = useSelector(state => getObjectById(state,itemId));  
    console.log("******************** je refais 3.4 !!!! "+getId()+"  ************************");
    console.log("++",objectDatas)

    return (
            <>
                {/*<StatusPanel autoTestId={props?.automatedTestId} itemId={itemId} />  */}
                <StyledMainView> 
                   <Text>voilou</Text>
                </StyledMainView>
            </>
    )
}

export default React.memo(ToggleOnOffComp,areEqual)


const StyledMainView = styled.View`
                    flex: 1; 
                    min-height:150px;
                `;

