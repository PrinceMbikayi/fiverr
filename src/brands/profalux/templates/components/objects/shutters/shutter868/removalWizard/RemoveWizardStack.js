import React from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { createStackNavigator,TransitionSpecs,TransitionPresets } from '@react-navigation/stack';

import { RemoveWizardHomeScreen } from './RemoveWizardHomeScreen';
import { MaisonScreen } from '_brand/templates/screens/maison/MaisonScreen';
import { getDetailsComponent } from '_brand/navigation/productDetails'





const Stack = createStackNavigator();

  export const  RemoveWizardStack = () => {

    const navigation = useNavigation();
    const route = useRoute();
    const navParams = route?.params || {};

    const { itemId } = navParams;
    console.log("NAVPARAMS :", navParams)

    return (
      <Stack.Navigator
        initialRouteName="RemoveWizardHomeScreen" 
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: '#FFFFFF' },
          ...TransitionPresets.SlideFromRightIOS,
        }}
      >


          <Stack.Screen name="RemoveWizardHomeScreen" component={RemoveWizardHomeScreen} />
          <Stack.Screen name="ProductDetails" component={getDetailsComponent} />
      </Stack.Navigator>
    );
  }
  