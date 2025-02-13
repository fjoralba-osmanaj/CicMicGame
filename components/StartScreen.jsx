import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Button from './Button';

const StartScreen = ({ onStartGame }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nine Men's Morris</Text>
      <Button onPress={onStartGame} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
  },
});

export default StartScreen;