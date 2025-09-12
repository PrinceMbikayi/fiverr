import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';

import AboutScreen from '_screens/about';
//import ProductsScreen from '_screens/products';
import ProductsScreen from '_brand/templates/screens/productsRelated/products/ProductsScreen';
import {ProductDetailsScreen} from '_brand/screens/productDetails';

import { ProductStack } from './productStack';



const Stack = createStackNavigator();

export const  AppStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="ProductsScreen" 
      screenOptions={{
        headerShown: false,      
      }}    
    >
      <Stack.Screen
        name="productsScreen"
        component={ProductStack}       
      />
     
    </Stack.Navigator>
  );
}