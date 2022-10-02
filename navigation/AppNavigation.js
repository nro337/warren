import React, {useEffect, useState} from "react";
import { Button, Text, View } from "react-native";
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createStackNavigator } from "@react-navigation/stack";

import { Ionicons } from '@expo/vector-icons';

import { supabase } from '../database/supabase'
//import { session } from '@supabase/supabase-js'

import Homepage from "../src/Components/Homepage";
import Catalog from "../src/Components/Catalog"

const Tab = createBottomTabNavigator();

const Stack = createStackNavigator();


export default function AppNavigation({session}) {
  const [loading, setLoading] = useState(true)
  const [username, setUsername] = useState('')
  const [profile_id, setProfileID] = useState('')
  const [website, setWebsite] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')

  //console.log(session)

  useEffect(() => {
    if (session) getProfile()
  }, [session])

  async function getProfile() {
    try {
      setLoading(true)
      if (!session?.user) throw new Error('No user on the session!')

      let { data, error, status } = await supabase
        .from('profiles')
        .select(`username, website, avatar_url`)
        .eq('id', session?.user.id)
        .single()
      if (error && status !== 406) {
        throw error
      }

      if (data) {
        setUsername(data.username)
        setProfileID(data.id)
        setWebsite(data.website)
        setAvatarUrl(data.avatar_url)
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  async function updateProfile({
    username,
    website,
    avatar_url,
  }) {
    try {
      setLoading(true)
      if (!session?.user) throw new Error('No user on the session!')

      const updates = {
        id: session?.user.id,
        username,
        website,
        avatar_url,
        updated_at: new Date(),
      }

      let { error } = await supabase.from('profiles').upsert(updates)

      if (error) {
        throw error
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  function HomeStack() {
    return (
      <Stack.Navigator>
        <Stack.Screen name="Warren" component={Homepage} options={{
          headerRight:() => (
            <Button title="Sign Out" onPress={() => supabase.auth.signOut()} />
          ),
          headerLeft: () => (
            <Text>{username}</Text>
          )
        }} 
        />
      </Stack.Navigator>
    )
  }

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
            return <Ionicons name={iconName} size={size} color={color} />
          }
        })}
      >
        <Tab.Screen name="Home" component={HomeStack} options={{headerShown: false}} />
        <Tab.Screen name="Catalog" component={Catalog} />
      </Tab.Navigator>
    </NavigationContainer>
  )
}