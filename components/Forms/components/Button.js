import { StyleSheet, Text, View, Pressable } from 'react-native'
import React from 'react'
import Colors from '../../../constants/colors.js'

const Button = ({ children, onPress, mode, style, android_ripple, disabled }) => {
  return (
    <View style={[styles.outerButton, style, disabled && styles.outerDisabled]}>
      <Pressable
        onPress={!disabled ? onPress : () => { }}
        style={({ pressed }) => !disabled ? pressed && styles.pressed : styles.disabled}
        android_ripple={!disabled && { color: '#cf0000' }}
      >
        <View style={[styles.button]}>
          {/* <Text style={[styles.buttonText, mode === 'flat' && styles.flatText]}>{!disabled ? children : disabled}</Text> */}
          <Text style={[styles.buttonText, mode === 'flat' && styles.flatText]}>{children}</Text>
        </View>
      </Pressable>
    </View>
  )
}

export default Button

const styles = StyleSheet.create({
  button: {
    // padding: 12,
    // backgroundColor: Colors.primary500,
    // elevation: 8,
    // width: '100%'
  },
  disabled: {

  },
  outerDisabled: {
    backgroundColor: '#a895e2'
  },
  outerButton: {
    borderRadius: 3,
    margin: 8,
    overflow: 'hidden',
    // borderWidth: 1,
    // borderColor: 'black',
    // width: '100%'
    backgroundColor: '#5b29ec'
  },
  flat: {
    // backgroundColor: 'transparent'
  },
  buttonText: {
    padding: 12,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    // justifyContent: 'center',
    // backgroundColor: 'red'
    // backgroundColor: Colors.primary500,

  },
  flatText: {
    // color: Colors.nav.background
  },
  pressed: {
    // opacity: 0.75,
    // backgroundColor: Colors.primary100,
    borderRadius: 4
  }
})