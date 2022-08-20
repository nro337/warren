import React, {useEffect, useState} from "react";
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createStackNavigator } from "@react-navigation/stack";

import { Ionicons } from '@expo/vector-icons';

import Homepage from "../src/Components/Homepage";
import Catalog from "../src/Components/Catalog"

const Tab = createBottomTabNavigator();

const Stack = createStackNavigator();

function HomeStack({navigation}) {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Warren" component={Homepage} />
    </Stack.Navigator>
  )
}

export default function AppNavigation() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Home"
        screenOptions={({route}) => ({
          tabBarIcon: ({focused, color, size}) => {
            let iconName;
            if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline';
              color = focused ? 'darkblue' : 'gray';
              
            } else if (route.name == 'Catalog') {
              iconName = focused ? 'list' : 'list-outline';
            }
            // else if (route.name === 'Result List') {
            //   iconName = focused ? 'trophy' : 'trophy-outline';
            // } else if (route.name === 'Settings') {
            //   iconName = focused ? 'settings' : 'settings-outline';
            // }
            return <Ionicons name={iconName} size={size} color={color} />
          }
        })}
      >
        <Tab.Screen name="Home" component={HomeStack} options={{headerShown: false}}/>
        <Tab.Screen name="Catalog" component={Catalog} />
      </Tab.Navigator>
    </NavigationContainer>
  )
}