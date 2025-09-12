import { useState, useEffect } from 'react';
import { useSelector,useDispatch ,useStore} from 'react-redux';
import {useAppGlobal} from '_helpers/appGlobalProvider';
import {getObjectById,getObjectByIdSimple} from '_helpers/selectors';
import {Api} from '_api';

import{getUser} from '_helpers/selectors';

import { getUserCredentials,deleteUserCredentials,
    getIsTester as getStoredTesterStatus,
    getStoredTesterOptions,updateStoredTesterOptions  } from '../services/storage';

/**
 * 
 * @callback Logout
 *
 * @returns {void}
 */


/**
 * @typedef {Object} uUser
 * @property {boolean} isLoggedIn - some comment
 * @property {Logout} logout - log user out
 * @property {Array} userFavorite - user favorite objects
 */

/**
 * Get the User state.
 *
 * @returns {uUser}
 */
const useUser = () => {

    const [unique, setUnique] = useState(Date.now());
    const userDatas  = useSelector(state => state.user);
    const store = useStore();

    console.log("USER_INFOS :", userDatas)

    const getCredentials = async() => {

        const result = await getUserCredentials(store);     
        return result
       }


    return {
        isLoggedIn:userDatas?.loggedIn,
        unique:unique,
        //Harold export user favorite objects
        userFavorite:userDatas?.favorite,
        userDefaultWeather:userDatas?.defaultWeather,
        getCredentials
    }
}

export default useUser