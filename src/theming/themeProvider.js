import React, { useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
//import { Appearance, AppearanceProvider } from 'react-native-appearance';
import { Appearance} from 'react-native';
import store from '../store';
import {appRefresh,closeWS} from '_actions/app';


import THEMES from '_brand/themes';

const STORAGE_KEY = 'THEME_ID';
const ThemeContext = React.createContext();

export const ThemeContextProvider = ({ children }) => {
  const [themeID, setThemeID] = useState();

  useEffect(() => {
    (async () => {
      const storedThemeID = await AsyncStorage.getItem(STORAGE_KEY);
      const defaultMode = (THEMES.length == 1) ?  THEMES[0].key  :(Appearance.getColorScheme() == 'dark') ? "DARK" : "LIGHT"

      console.log("ThemeContextProvider",storedThemeID,defaultMode)

      if (storedThemeID) setThemeID(storedThemeID);
     
      else setThemeID(defaultMode);
      
     
     //setThemeID(THEMES[1].key);

     


    })();
  }, []);

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      //setThemeState(colorScheme)
      console.log("colorScheme",colorScheme)
     const newTheme =  (THEMES.length == 1) ?  THEMES[0].key  : (colorScheme == "dark") ? 'DARK' : 'LIGHT';
     console.log("new Theme",newTheme)
     setThemeID(newTheme)
    })
    return () => subscription.remove()
  }, [])




  return (
    <ThemeContext.Provider value={{ themeID, setThemeID }}>
      {!!themeID ? children : null}
    </ThemeContext.Provider>
  );
};

export function withTheme(Component) {
  return props => {
    const { themeID, setThemeID } = useContext(ThemeContext);

    const getTheme = themeID => THEMES.find(theme => theme.key === themeID);
    const setTheme = themeID => {
      
      console.log("storedThemeID dans with Theme",storedThemeID)
      AsyncStorage.setItem(STORAGE_KEY, themeID);
      setThemeID(themeID);
    };
    const getColors = () => {
      const theme = getTheme(themeID);
      return (
                {
                  bgColor : theme['color--bg'],
                  textColor : theme.onBody,
                  headerBackgroundColor : (theme["card--color--headerbg"] || "pink") , 
                  headerTextColor : theme["card--color--text"]                
                }
      )
    };
    const setThemeForTest = async() => {
      console.log("here")
      const storedThemeID = await AsyncStorage.getItem(STORAGE_KEY);
      
      const newThemeID = (storedThemeID == "DARK")? "LIGHT" : "DARK";
      AsyncStorage.setItem(STORAGE_KEY, newThemeID);
      console.log("here",storedThemeID,STORAGE_KEY,newThemeID)
      setThemeID(newThemeID);
      store.dispatch(appRefresh());
    }

    return (
      <Component
        {...props}
        themes={THEMES}
        theme={getTheme(themeID)}
        setTheme={setTheme}
        baseColors={getColors()}
        setThemeForTest={setThemeForTest}
      />
    );
  };
}

export const useTheme = () => {
  const { themeID, setThemeID } = useContext(ThemeContext);
  const getTheme = themeID => THEMES.find(theme => theme.key === themeID);

  const getColors = () => {
    const theme = getTheme(themeID);
    return (
              {
                bgColor : theme['color--bg'],
                textColor : theme.onBody,
                headerBackgroundColor : theme["card--color--headerbg"], 
                headerTextColor : theme["card--color--text"],
                cardIconColor :  theme["card--color--icon" ]               
              }
    )
  };
  let newTheme;
  const setTheme = () => {
    if(themeID == "DARK") {
      newTheme = "LIGHT"
    }else {
      newTheme = "DARK";
    }

    if(THEMES.length == 1)newTheme = THEMES[0].key
    setThemeID(newTheme)
    AsyncStorage.setItem(STORAGE_KEY, newTheme);
  }

  return { 
    themeID : themeID,
    theme:getTheme(themeID),
   
    changeTheme:setTheme,
    baseColors:getColors()
  }     
}
