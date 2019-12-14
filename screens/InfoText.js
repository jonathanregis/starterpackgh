import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

const styles = StyleSheet.create({
  container: {
    padding: 5,
    backgroundColor: '#fafafc',
  },
  infoText: {
    fontSize: 16,
    marginLeft: 20,
    color: 'gray',
  },
})
const InfoText = ({ text }) => (
  <View style={styles.container}>
    <Text style={styles.infoText}>{text}</Text>
  </View>
)

export default InfoText
