import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
// import FileSystem from 'react-native-filesystem'
// import CameraRoll from "@react-native-community/cameraroll";

const ManageBackground = () => {



  // useEffect(() => {
  //   // console.log(FileSystem.writeToFile());
  //   async function writeToFile() {
  //     try {

  //       const fileContents = 'This is a my content'
  //       await FileSystem.writeToFile('my-directory/my-file.txt', fileContents)
  //       console.log('file is written');
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   }
  //   writeToFile()
  // }, [])

  useEffect(() => {
    // console.log(CameraRoll.getPhotos());
  }, [])

  return (
    <View style={styles.screen}>
      <Text>ManageBackground</Text>
    </View>
  )
}

export default ManageBackground

const styles = StyleSheet.create({
  screen: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1
  }
})