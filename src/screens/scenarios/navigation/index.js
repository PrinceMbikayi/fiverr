import { createStackNavigator,TransitionPresets } from '@react-navigation/stack';
//--------------------------------
import { ScenarioHome } from '../index';


const noHeader = {
    headerShown: false,
    headerMode:'screen',
    tabBarVisible:false
  }



export const ProgrammationStack = createStackNavigator(
    {     
      ScenarioHome:   {screen:ScenarioHome,routeName:'ProgrammationHome',navigationOptions:noHeader} , 
      
     
    }
    ,{
        defaultNavigationOptions: {
          gestureEnabled: false,     
          ...TransitionPresets.SlideFromRightIOS,
          }
    });