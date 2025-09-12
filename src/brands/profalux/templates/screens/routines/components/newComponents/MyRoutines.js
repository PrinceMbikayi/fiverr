import '_brand/templates/screens/routines/locales'
import React from 'react';
import { View, ScrollView } from 'react-native';
import { useSelector } from "react-redux";
import { getObjectsByTypeName } from '_helpers/selectors';
import { getObjectById } from '_helpers/objects';

import { RoutineWidgets } from '_brand/templates/screens/routines/components/RoutineWidgets';
import { useEcoConfort } from '_brand/templates/screens/routines/hook/useEcoConfort'
import {isDateInRange} from '_brand/templates/screens/routines/utils/ecoConfortUtils'



export const MyRoutines = (props) => {
    const routines = useSelector(state => getObjectsByTypeName(state, "Associations")) || [];
    const application = useSelector(state => getObjectsByTypeName(state, "application")) || [];
    const scenarioLst = routines.concat(application)


    // scenarioLst.map((item) => {
    //     const scenario = getObjectById(item);
    //     console.log('scenario', scenario);
    // });
    // console.log('scenarioLst', scenarioLst);

    return (
        <View>
            <ScrollView  showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
                <RoutineWidgets source={scenarioLst}/>
                <View style={{ height: 100, width: '100%', backgroundColor: 'transparent', marginTop:10 }}></View>
            </ScrollView>
        </View>
    )
}