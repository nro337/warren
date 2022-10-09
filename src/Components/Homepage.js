import { Box, Center, Column, NativeBaseProvider, Row, Text, Flex, Input, Button, IconButton, View, Icon, Pressable, ScrollView } from "native-base";
import { SafeAreaView } from "react-native-safe-area-context";
import { extendTheme } from 'native-base';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState, useEffect } from "react";
import * as ImagePicker from 'expo-image-picker';
import {Permissions} from 'expo-image-picker';
import {Image, Alert} from "react-native";
import { Camera, CameraType } from "expo-camera";
import * as MediaLibrary from 'expo-media-library';
import { supabase } from '../../database/supabase'

import { FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';

const config = {
  useSystemColorMode: false,
  initialColorMode: 'dark',
}

const customTheme = extendTheme({config})

export default function Homepage({route}) {
  const [date, setDate] = useState(new Date(Date.now()));
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [image, setImage] = useState(null);
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraPermission, setCameraPermission] = ImagePicker.useCameraPermissions();
  const [itemName, setItemName] = useState('')

  const { params } = route.params
  const profile_id = params
  
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

  const openCamera = async () => {
    requestCameraPermission()
    if(cameraPermission.granted === true){
       let data =  await ImagePicker.launchCameraAsync({
         mediaTypes:ImagePicker.MediaTypeOptions.Images,
         allowsEditing:true,
         aspect:[1,1],
         quality:0.5
       })
      if(!data.cancelled){
        let newfile = { 
         uri:data.uri,
         type:`test/${data.uri.split(".")[1]}`,
         name:`test.${data.uri.split(".")[1]}` 
 
       }
        // handleUpload(newfile)
        console.log(newfile)
        setImage(newfile.uri)
      }
    }else{
      Alert.alert("you need to give up permission to work")
    }
  }

  const requestCameraPermission = async () => {
    const camPermissions = await ImagePicker.requestCameraPermissionsAsync()
    if (camPermissions.granted) {
      setCameraPermission(camPermissions)
    } else {
      Alert.alert('Camera permission not allowed!')
    }
  }

  const createAlbum = async () => {
    const res = await MediaLibrary.requestPermissionsAsync()
    if(res.granted) {
      let existingAlbum = await MediaLibrary.getAlbumAsync('Warren')
      if (existingAlbum != null) {
        console.log('Warren album already exists')
      } else {
        MediaLibrary.createAlbumAsync('Warren')
        .then(res => {
          console.log(res)
        })
        .catch(error => {
          console.log('err', error)
        })
      }
    } else {
      Alert.alert("You need to grant permission to create a new album")
    }
  }

  const submitWarranty = async () => {
    console.log("Submit triggered")
    let expiration_date = ((new Date()).toISOString()).toLocaleString()
    try {
      const { data, error } = await supabase
      .from('warranties')
      .insert([
        {item_name: itemName, expiration_date: expiration_date, profile_id: profile_id}
      ])
    } catch (error) {
      console.log(error)
    }
  }

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
                  <Input size="lg" placeholder="Name" w="100%" mr="4" bg='white' color="black" onChangeText={(newText) => setItemName(newText)} />
                </Column>
              </Row>
            </Center>
            {
              image ? <Center w="98%" h="4/6" bg="darkBlue.600" shadow={3}>
              <Row alignItems="center">
                <Column alignItems="center" w="1/2">
                  <Text fontSize={"xl"} alignSelf="center">Product Picture</Text>
                </Column>
                <Column alignItems="center" w="1/2">
                  <Row alignItems="center" mb="8" space="8">
                    <IconButton onPress={() => openCamera()} icon={<MaterialIcons name="add-a-photo" size={34} color="white" />} variant="solid" bg="primary.600"></IconButton>
                    <IconButton onPress={() => pickImage()} icon={<Ionicons name="md-images-outline" size={30} color="white" />} variant="solid" bg="primary.600"></IconButton>
                  </Row>
                  <Column alignItems="center">
                    {image && <Image source={{ uri: image }} style={{ width: 150, height: 150 }} />}
                  </Column>
                </Column>
              </Row>
            </Center> : <Center w="98%" h="1/6" bg="darkBlue.600" shadow={3}>
              <Row alignItems="center">
                <Column alignItems="center" w="1/2">
                  <Text fontSize={"xl"} alignSelf="center">Product Picture</Text>
                </Column>
                <Row alignItems="center" justifyContent="space-evenly" w="1/2">
                    {/* <Input size="lg" placeholder="Name" w="100%" mr="4" bg='white' /> */}
                  <IconButton onPress={() => openCamera()} icon={<MaterialIcons name="add-a-photo" size={34} color="white" />} variant="solid" bg="primary.600"></IconButton>
                  <IconButton onPress={() => pickImage()} icon={<Ionicons name="md-images-outline" size={30} color="white" />} variant="solid" bg="primary.600"></IconButton>
                </Row>
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
            <Center w="98%" h="1/6" bg="darkBlue.600" shadow={3}>
              <Row alignItems="center">
                <Column alignItems="center" w="1/2">
                  <Text fontSize={"xl"} alignSelf="center">Picture</Text>
                </Column>
                <Column alignItems="center" w="1/2">
                  <Button size={'md'} onPress={() => createAlbum()}>Test</Button>
                </Column>
              </Row>
            </Center>
            <Button size={'md'} onPress={() => submitWarranty()}>Submit</Button>
          </Column>
        </ScrollView>
      </Box>
    </NativeBaseProvider>
  )
}