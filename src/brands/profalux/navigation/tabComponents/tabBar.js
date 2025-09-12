import React from "react";
import { useEffect } from "react";
import {View,Button} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


import MyTabButton from "./tabButton";

import { useTheme } from '_theming/themeProvider';

import ProfileIcon from '_brand/images/icons/app/Profile';
import ProfileIconBold from '_brand/images/icons/app/ProfileBold';

import HomeIcon from '_brand/images/icons/app/Home';
import HomeIconBold from '_brand/images/icons/app/HomeBold';

import ProgrammingIcon from '_brand/images/icons/app/ProgrammingArrows';
import ProgrammingIconBold from '_brand/images/icons/app/ProgrammingArrowsBold';

const  MyTabBar = (props) => {

    console.log("MyTabBar Props",props)
    const {navigation,state:myState} = props;

    const insets = {bottom:10};//useSafeAreaInsets();
    const go = useSafeAreaInsets();
  
    useEffect(()=> {
       if(myState && navigation) {
     
        console.log("navigation changed",myState?.routeNames[ myState.index])
       }
       

    },[myState])



    const navigateTo = (destination) => {
        navigation.navigate(destination)
    }

    const icons =   {
                        'Profil' : {'off' : <ProfileIcon/>,'on' : <ProfileIconBold/> },
                        'Accueil' : {'off' : <HomeIcon/>,'on' : <HomeIconBold/> },
                        'About' : {'off' : <ProgrammingIcon/>,'on' : <ProgrammingIconBold/> },
                    }

    const getIcon = (id) => {
        console.log("getIcon")
        if(icons[id]) {
            const active = (myState?.routeNames[ myState.index] == id) ? "on" : "off";
            const retVal = icons[id][active];
            return retVal;
        }
    }

    return (
      <View style={{flexDirection:'row',height:60+insets.bottom,borderTopWidth:1,borderTopColor:'#333',borderBottomWidth:1,borderBottomColor:'#333'}}>
        <MyTabButton title= "Accueil" destination="Accueil" callback={navigateTo} icon={getIcon('Accueil')}/>
        <MyTabButton title= "A propos" destination="About" callback={navigateTo}  icon={getIcon('About')}/>
        <MyTabButton title= "Profil" destination="Profil" callback={navigateTo}  icon={getIcon('Profil')}/>     
      </View>
    );
  }


  export default MyTabBar