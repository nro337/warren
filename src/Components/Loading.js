import { SafeAreaView } from "react-native-safe-area-context";
import { Box, Center, Column, NativeBaseProvider, Row, Text, Flex, Input, Button, IconButton, View, Icon, Pressable, ScrollView } from "native-base";
import { FlatList } from "react-native";
import { extendTheme } from 'native-base';

const config = {
  useSystemColorMode: false,
  initialColorMode: 'dark',
}

const customTheme = extendTheme({config})

export default function Loading({route}) {

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
        <Text>Loading...</Text>
      </SafeAreaView>
    </Box>
  </NativeBaseProvider>
  )
}