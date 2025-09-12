import { useSelector } from 'react-redux'
import {getUser,getObjectRuntimeDatas} from '_helpers/selectors'

import {disguiseEnabled} from '_config/products/core'

export const useMimic = () => {

    const userDatas = useSelector(state =>getUser(state));
    const runtimeDatas = useSelector(getObjectRuntimeDatas);
    const _isTester = () => {
        return userDatas?.isTester || false
    }

    const _canDisguise = (typeName) => {
        //console.log("disguiseEnabled",disguiseEnabled)
        return (disguiseEnabled[typeName] != undefined);
    }

    const _getDisguise = (itemId) => {
        return runtimeDatas?.[itemId]?.disguiseType
    }

    const _getAvailableDisguises = (typeName) => {
        return disguiseEnabled[typeName]
    }


    return {
        isTester:_isTester,
        canDisguise: _canDisguise,
        disguiseType:_getDisguise,
        getDisguiseType:_getDisguise,
        getAvailableDisguises:_getAvailableDisguises
    }    
}
