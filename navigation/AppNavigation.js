import React, {useEffect, useState, createContext, useContext} from "react";
import { Button, Text, View } from "react-native";
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createStackNavigator } from "@react-navigation/stack";

import { Ionicons } from '@expo/vector-icons';

import { supabase } from '../database/supabase'
import { Session } from '@supabase/supabase-js'

import Homepage from "../src/Components/Homepage";
import Catalog from "../src/Components/Catalog"
import Loading from "../src/Components/Loading"

const Tab = createBottomTabNavigator();

const Stack = createStackNavigator();


export default function AppNavigation({route, navigation, session}) {
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
        setProfileID(session.user.id)
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

  function HomeStack({navigation, route}) {
    route.params = pid
    return (
        <Stack.Navigator>
          {!loading ? <Stack.Screen name="Warren" component={Homepage} initialParams={route} options={(navigation, route) => ({
            headerRight:() => (
              <Button title="Sign Out" onPress={() => supabase.auth.signOut()} />
            ),
            headerLeft: () => (
              <Text style={{fontSize: 15, marginLeft: 10, marginTop: 5, fontWeight: "400"}}>{username}</Text>
            )
          })} 
          /> : <Stack.Screen name="Warren" component={Loading} />
          }
        </Stack.Navigator>
    )
  }
  
  // Here is reference that allowed this to work: https://stackoverflow.com/questions/61127168/react-navigation-v5-how-to-get-route-params-of-the-parent-navigator-inside-the 
  // Recommended by official Nav docs: https://reactnavigation.org/docs/nesting-navigators  
  const DEFAULT_CONTEXT = {
    pid: profile_id
  }
  const ParentContext = createContext(DEFAULT_CONTEXT);
  const { pid } = useContext(ParentContext);
  return (
      <NavigationContainer>
        <ParentContext.Provider value={{pid}}>
        <Tab.Navigator
          initialRouteName="Home"
          screenOptions={({route, navigation}) => ({
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
          { loading ? <Tab.Screen name="Loading Catalog" component={Loading} /> : <Tab.Screen name="Catalog" component={Catalog} initialParams={{profile_id}} /> }
        </Tab.Navigator>
        </ParentContext.Provider>
      </NavigationContainer>
  )
}