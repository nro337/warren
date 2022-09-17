import React, { useState } from 'react'
import { Alert, StyleSheet, View, Image, Text, SafeAreaView } from 'react-native'
import { supabase } from '../../database/supabase'
import { Button, Input } from 'react-native-elements'

export default function Auth() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const warren_profile = '../../assets/warren_profile.png'

  async function signInWithEmail() {
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })

    if (error) Alert.alert(error.message)
    setLoading(false)
  }

  async function signUpWithEmail() {
    setLoading(true)
    const { error } = await supabase.auth.signUp({
      email: email,
      password: password,
    })

    if (error) Alert.alert(error.message)
    setLoading(false)
  }

  return (
    <SafeAreaView style={{backgroundColor: '#132554'}}>
      <View style={{backgroundColor: '#132554', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center'}}>
        <View style={[styles.warren_profile_wrapper]}>
          <Image source={require(warren_profile)} style={styles.warren_profile} />
        </View>
        <View style={[styles.verticallySpaced]}>
          <Input
            label="Email"
            leftIcon={{ type: 'font-awesome', name: 'envelope', color: 'white' }}
            onChangeText={(text) => setEmail(text)}
            value={email}
            placeholder="email@address.com"
            autoCapitalize={'none'}
            inputStyle={{color: 'white'}}
          />
        </View>
        <View style={styles.verticallySpaced}>
          <Input
            label="Password"
            leftIcon={{ type: 'font-awesome', name: 'lock', color: 'white' }}
            onChangeText={(text) => setPassword(text)}
            value={password}
            secureTextEntry={true}
            placeholder="Password"
            autoCapitalize={'none'}
            inputStyle={{color: 'white'}}
          />
        </View>
        <View style={[styles.verticallySpaced, styles.button_padding]}>
          <Button title="Sign in" disabled={loading} onPress={() => signInWithEmail()} />
        </View>
        <View style={[styles.verticallySpaced, styles.button_padding]}>
          <Button title="Sign up" disabled={loading} onPress={() => signUpWithEmail()} />
        </View>
        <View style={styles.text_ref_wrapper}>
          <Text style={styles.text_ref}>Logo courtesy of Facetype.com</Text>
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 12,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: 'stretch',
  },
  button_padding: {
    paddingHorizontal: 10,
    marginTop: 16
  }, 
  mt20: {
    marginTop: 40,
  },
  warren_profile_wrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  warren_profile: {
    width: 300,
    height: 300
  },
  text_ref_wrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginTop: 40,
    marginBottom: 200
  }, 
  text_ref: {
    fontSize: 8,
    color: 'white'
  }
})