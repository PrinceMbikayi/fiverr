import '_brand/templates/screens/routines/locales'
import React from 'react';
import {useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from 'react-i18next';

import { useNavigation, useRoute } from '@react-navigation/native';

import RoutineTemplate from '_brand/templates/screens/routines/components/RoutineTemplate';
import { useTheme } from '_theming/themeProvider'
import { getObjectsByTypeName } from '_helpers/selectors';
import { MyRoutines } from '_brand/templates/screens/routines/components/newComponents/MyRoutines';
import { MyPlanning } from '_brand/templates/screens/routines/components/newComponents/MyPlanning';
import {RoutineAndPlanningRoutesButtons} from "_brand/templates/screens/routines/components/newComponents/RoutineAndPlanningRoutesButtons"
import {useScenario} from '_brand/templates/screens/routines/hook/useScenario'
// HTMLText import removed - was only used in commented code


const RoutinesHomeScreen = (props) => {

    console.log("ROUTINE_HOMESCREEN :", props)

    const uScenario = useScenario();
    const {
        resetCurrentDay, updateRoutineOrPlanningRoot, routineMenu
    } = uScenario;


    const htmlStyles = {"base":{fontSize:20,lineHeight:24,color:"black"},"a" : {"textDecorationLine":"underline",color:"orange"}};

const onPressText = (url) => {
    console.log('URL :', url);
}

    const { t, i18n } = useTranslation();
    const tns = "routine";

    const navigation = useNavigation();
    const route = useRoute();

    const handleOnPress = (active) => {
        console.log('HOOOP :', active);
        if(active == "routine"){
            updateRoutineOrPlanningRoot('routine')
            resetCurrentDay()
            navigation.navigate("RoutinesHomeScreen")
            //navigation.navigate("RoutineHomeStack",{screen:"RoutinesHomeScreen"})
        }else{
            updateRoutineOrPlanningRoot('planning')
            resetCurrentDay()
            //navigation.navigate("RoutinesHomeScreen")
            navigation.navigate("PlanningStack", {screen:"PlanningHomeScreen"})
        }
    }

    return (
        <RoutineTemplate withKebab={true} title={routineMenu?.title}  >
            <RoutineAndPlanningRoutesButtons onPress={handleOnPress} active={routineMenu?.routineOrPlanning} title ={routineMenu?.title}/>
                <MyRoutines/>
                {/* <HTMLText source={t(tns + ":" + "WINTER_ECOCONFORT_SHUTTERS_POSITION") } color="red"  styles={htmlStyles} onPress={onPressText}/> */}
        </RoutineTemplate>

    )
};

export default RoutinesHomeScreen
