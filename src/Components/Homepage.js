import { Box, Center, Column, NativeBaseProvider, Row, Text, Flex, Input, Button, View, Pressable, ScrollView } from "native-base";
import { SafeAreaView } from "react-native-safe-area-context";
import { extendTheme } from 'native-base';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useState } from "react";
import * as ImagePicker from 'expo-image-picker'
import {Image} from "react-native"

const config = {
  useSystemColorMode: false,
  initialColorMode: 'dark',
}

const customTheme = extendTheme({config})

export default function Homepage({navigation}) {
  const [date, setDate] = useState(new Date(Date.now()));
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [image, setImage] = useState(null);
  
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShow(false);
    setDate(currentDate);
  };
  
  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };
  
  const showDatepicker = () => {
    showMode('date');
  };
  
  const showTimepicker = () => {
    showMode('time');
  };

  const pickImage = async () => {

    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  return (
    <NativeBaseProvider theme={customTheme}>
      <Box flex={1} bg="lightBlue.400" alignItems="center" justifyContent="center">
        <ScrollView pt="4" maxH="full">
          <Column space={4} alignItems="center" h="lg">
            <Center w="98%" h="1/6" bg="darkBlue.600" shadow={3}>
              <Row alignItems="center">
                <Column alignItems="center" w="1/2">
                  <Text fontSize={"xl"} alignSelf="center">Item Name</Text>
                </Column>
                <Column alignItems="center" w="1/2">
                  <Input size="lg" placeholder="Name" w="100%" mr="4" bg='white' color="black" />
                </Column>
              </Row>
            </Center>
            {
              image ? <Center w="98%" h="4/6" bg="darkBlue.600" shadow={3}>
              <Row alignItems="center">
                <Column alignItems="center" w="1/2">
                  <Text fontSize={"xl"} alignSelf="center">Picture</Text>
                </Column>
                <Column alignItems="center" w="1/2">
                  {image && <Image source={{ uri: image }} style={{ width: 150, height: 150 }} />}
                  <Button mt="8" onPress={() => pickImage()}>Pick an image</Button>
                </Column>
              </Row>
            </Center> : <Center w="98%" h="1/6" bg="darkBlue.600" shadow={3}>
              <Row alignItems="center">
                <Column alignItems="center" w="1/2">
                  <Text fontSize={"xl"} alignSelf="center">Picture</Text>
                </Column>
                <Column alignItems="center" w="1/2">
                  {/* <Input size="lg" placeholder="Name" w="100%" mr="4" bg='white' /> */}
                  <Button onPress={() => pickImage()}>Pick an image</Button>
                  {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
                </Column>
              </Row>
            </Center>
            }
            <Center w="98%" h="1/6" bg="darkBlue.600" shadow={3}>
              <Row alignItems="center">
                <Column alignItems="center" w="1/2">
                  <Text fontSize={"xl"} alignSelf="center">Date</Text>
                </Column>
                <Column alignItems="center" w="1/2">
                  <View w="100%" >
                    {show ? <Text></Text> :
                      <Row justifyContent="center" alignItems="center" space="4">
                        <Text fontSize={"lg"}>{date.toLocaleDateString()}</Text>
                        <Button size={"md"}  onPress={() => showDatepicker()}>Change</Button>
                      </Row>
                    }
                    {show && (<View justifyContent="flex-start" pb="4">
                      <DateTimePicker testID="dateTimePicker" value={date} mode={mode} is24Hour={true} onChange={onChange} display="calendar" />
                    </View>
                    )}
                  </View>
                </Column>
              </Row>
            </Center>
            <Center w="98%" h="1/6" bg="darkBlue.600" shadow={3}>
              <Row alignItems="center">
                <Column alignItems="center" w="1/2">
                  <Text fontSize={"xl"} alignSelf="center">Picture</Text>
                </Column>
                <Column alignItems="center" w="1/2">
                  <Input size="lg" placeholder="Name" w="100%" mr="4" bg='white' />
                </Column>
              </Row>
            </Center>
          </Column>
        </ScrollView>
      </Box>
    </NativeBaseProvider>
  )
}