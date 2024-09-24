import { StyleSheet, Text, View, ActivityIndicator } from 'react-native'
import React from 'react'

const LoadingOverlay = ({ message }) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={"white"} />
      <Text>{message}</Text>
    </View>
  )
}

export default LoadingOverlay

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: 'lightblue'
  }
})

/**
 * Parent component manages state that controls rendering
 *  const [isFetching, setIsFetching] = useState(true)
 *  const [isSubmitting, setIsSubmitting] = useState(true)
 * 
 * if(isFetching) return LoadingOverlay
 */