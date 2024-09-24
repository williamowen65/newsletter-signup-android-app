import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import Button from './Button'

const IconButton = ({ icon, color, size, onPress, label }) => {
  return (
    <Button onPress={onPress} style={styles.iconButton}>
      <View style={styles.buttonContainer}>
        <Ionicons name={icon} color="red" size={30} />
        {label && <Text style={{ color: 'black', paddingLeft: 10 }}>{label}</Text>}
      </View>
    </Button>
  )
}

export default IconButton

const styles = StyleSheet.create({
  iconButton: {
    backgroundColor: 'transparent',
    justifyContent: 'center'
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center'
    // backgroundColor: 'red'
  }
})