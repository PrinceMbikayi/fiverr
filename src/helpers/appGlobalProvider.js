import React, { useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-community/async-storage';

import store from '../store';


import {omit as lodashOmit} from 'lodash'





const AppContext = React.createContext();



export const AppContextProvider = ({ children }) => {

  
  
  const [videoFS, setVideoFS] = useState(false);
  const [objectsMap,setObjectsMap] = useState({});
  const [objectsDisguised,setObjectsDisguised] = useState({});


  useEffect(() => {
    (async () => {
        /*
      const storedThemeID = await AsyncStorage.getItem(STORAGE_KEY);
      const defaultMode = (Appearance.getColorScheme() == 'dark') ? "DARK" : "LIGHT"

      if (storedThemeID) setThemeID(storedThemeID);
     
      else setThemeID(defaultMode);
      
     
     //setThemeID(THEMES[1].key);

    */ 


    })();
  }, []);

  useEffect(() => {
    
  }, [])




  return (
    <AppContext.Provider value={{ videoFS, setVideoFS , objectsMap, setObjectsMap,objectsDisguised,setObjectsDisguised }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppGlobal = () => {
    const { videoFS, setVideoFS,objectsMap, setObjectsMap , objectsDisguised, setObjectsDisguised } = useContext(AppContext);
    
    const disguisedPrefix = "d_";

    const setVideoFullscreen = (val) => {
      setVideoFS(val)
    }
  
    const getObjectsMap = () => {
      return objectsMap;
    }
    const getObjectMapped = (typeName,itemId) => {
    
      const ret = objectsMap?.products?.[typeName]?.mapTo || typeName;
      /*
      console.log("----------------------------")
      console.log(typeName + "-> "+ret);
      console.log("----------------------------")
      */
      /*
      if(ret != undefined) {
        console.log("-------------->  objectsMap +++",typeName,ret);
      }
    */
      return ret;
    }

    const doSetObjectsMap = (data) => {
      setObjectsMap(data);
    }


    const getObjectDisguised = (itemId) => {
        return objectsDisguised?.[disguisedPrefix+itemId]
    }

    const setObjectDisguised = (itemId,typeName) => {
      const toAdd = {[disguisedPrefix+itemId] : typeName}
      console.log("setdisguise",{...objectsDisguised,...toAdd})
       setObjectsDisguised({...objectsDisguised,...toAdd});
    }

    const removeObjectDisguised = (itemId) => {
        setObjectsDisguised(lodashOmit(objectsDisguised,disguisedPrefix+itemId))      
    }


    return { 
      
        isVideoFullscreen:videoFS,
        setVideoFullscreen:setVideoFullscreen,
        getObjectsMap:getObjectsMap,
        getObjectMapped:getObjectMapped,
        setObjectsMap:doSetObjectsMap,
        getObjectDisguised:getObjectDisguised,
        setObjectDisguised:setObjectDisguised,
        removeObjectDisguised:removeObjectDisguised
  
    }     
  }


