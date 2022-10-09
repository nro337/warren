import { SafeAreaView } from "react-native-safe-area-context";
import { Box, Center, Column, NativeBaseProvider, Row, Text, Flex, Input, Button, IconButton, View, Icon, Pressable, ScrollView } from "native-base";
import { FlatList } from "react-native";
import { extendTheme } from 'native-base';
import { useEffect, useState } from "react";
import { supabase } from '../../database/supabase'

const config = {
  useSystemColorMode: false,
  initialColorMode: 'dark',
}

const customTheme = extendTheme({config})

export default function Catalog({route}) {
  const [loading, setLoading] = useState(true)
  const [warrantyList, setWarrantyList] = useState([]);

  const profile_id = route.params.profile_id
  console.log(profile_id)
  //TODO: Fix warranties select permissions

  // Any time warranty list changes, refresh catalog
  useEffect(() => {
    getWarranties()
  }, [profile_id])

  async function getWarranties() {
    try {
      setLoading(true)
      console.log("Trying")
      if (!profile_id) throw new Error('No user found!')

      let { data, error, status } = await supabase
        .from('warranties')
        .select(`id, created_at, item_pic_url, profile_id, receipt_pic_url, item_name, expiration_date`)
        .eq('id', profile_id)
        .single()
      if (error && status !== 406) {
        throw error
      }

      if (data) {
        //setWarrantyList()
        console.log(data)
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  const DATA = [
    {
      id: '123',
      title: "First Item",
    },
    {
      id: '456',
      title: "Second Item",
    },
  ];

  return (
    <NativeBaseProvider theme={customTheme}>
    <Box flex={1} bg="lightBlue.400" alignItems="center" justifyContent="center">
      <SafeAreaView >
        <FlatList 
            data={DATA}
            renderItem={({item}) => <Text>{item.title}</Text>}
            keyExtractor={item => item.id}
          />
      </SafeAreaView>
    </Box>
  </NativeBaseProvider>
  )
}