import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { supabase } from './database/supabase'
import Auth from './src/Components/Auth';
import { session } from '@supabase/supabase-js'
import 'react-native-url-polyfill/auto'

import AppNavigation from './navigation/AppNavigation';

export default function App() {
  const [session, setSession] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  return (
  <>
    {session && session.user ? <AppNavigation key={session.user.id} session={session} /> : <Auth />}
  </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
