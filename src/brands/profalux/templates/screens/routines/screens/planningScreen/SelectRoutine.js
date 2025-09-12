import '_brand/templates/screens/routines/locales'
import React from 'react';
import { useEffect} from 'react';
import { Text, FlatList } from 'react-native';
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from 'react-i18next';

import { useNavigation, useRoute } from '@react-navigation/native';
import Toast from 'react-native-root-toast';

import { find as lodashFind } from 'lodash';

import { useTheme } from '_theming/themeProvider';


import RoutineTemplate from '_brand/templates/screens/routines/components/RoutineTemplate';
import {getObjectsByTypeName } from '_helpers/selectors';
import { SelectRoutineItem } from '../../components/SelectRoutineItem';
import {useScenario} from '_brand/templates/screens/routines/hook/useScenario'


export const SelectRoutine = (props) => {

  const { } = props;

  const { t, i18n } = useTranslation();
  const tns = "routine";
  const { theme } = useTheme();
  const dispatch = useDispatch();

  const scenarios = useSelector(state => getObjectsByTypeName(state, "Associations")) || [];

  const uScenario = useScenario();
  const {
    selectedDay,
    updateDaySelection,
    dayActive,
    dailyRoutines,
    routineId,
    updateRoutineId,
    selectedRoutineTrigger,
    updateSelectedRoutineTrigger,
    modifyPlanning,
  } = uScenario;

  //const scenarios = getRoutines || [];
  console.log("GOT_SCENARIOS :", scenarios)


  const navigation = useNavigation();
  const route = useRoute();
  const navParams = route?.params || {};

  const { gotask } = navParams;
  console.log("NAVIGATION_PARAMS_SELECTION:", gotask);

  const borderColor = theme?.prflxBorderColor || 'orange';
  const textColor = theme?.prflxTextColor || 'black'


console.log("====> dailyRoutines ",dailyRoutines)


  useEffect(() => {

  }, [routineId]);

  let routines = (scenarios.length % 2 != 1) ? scenarios : [...scenarios, 'extra'];


  const handleCallBack = (routinePicked) => {

    updateRoutineId(routinePicked)
      navigation.navigate("AddRoutineToDayPlanning");
    
  }


  return (
    <RoutineTemplate onlyBack={true} title={`${t(tns + ":" + "ADD_ROUTINE")}`}>
      <Text style={{ fontSize: 14,color:textColor, fontWeight: '600', marginVertical:20, marginLeft:5 }}>{t(tns + ":" + "SELECT_SCENARIO_TO_ADD")} :</Text>
      <FlatList
        data={routines}
        renderItem={
          ({ item, index }) => <SelectRoutineItem
            item={item}
            iconSize={40}
            iconColor={textColor}
            callBack={() => handleCallBack(item)}
          />
        }
        keyExtractor={(item, index) => "key_" + item}
        numColumns={2}
      />

    </RoutineTemplate>

  )
};



