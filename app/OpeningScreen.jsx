import React from 'react';
import { View, Text, Dimensions, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

const OpeningScreen = ({ onStartGame }) => {
  return (
    <ImageBackground
      source={require('../assets/images/sfonde.jpg')}
      blurRadius={2} 
      style={styles.backgroundContainer}
      resizeMode="cover"
      
    > 
      {/* Emri i lojes me animacion te thjeshte */}
      <SafeAreaView style={styles.contentContainer}> 
        <Animatable.Text //Adapted from JavascriptMastery-React Native
          animation="fadeInDown" //https://www.jmastery.pro
          duration={1500} 
          style={styles.title}
        >
        Cic Mic           
        </Animatable.Text>

        <Animatable.View 
          animation="fadeInUp" 
          duration={1500} 
          delay={500}
        >
          <TouchableOpacity style={styles.button} onPress={onStartGame}>
            <Text style={styles.buttonText}>Start Game</Text>
          </TouchableOpacity>
        </Animatable.View>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundContainer: {
    flex: 1,
    width: width, 
    height: height, 
    
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%', 
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.3)', 
  },
  title: {
    
    fontSize: width * 0.15, 
    fontWeight: 'bold',
    color: '#E4BB90',
    marginBottom: height * 0.05,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 10,
    includeFontPadding: false 
  },
  button: {
    backgroundColor: '#5D3810',
    paddingHorizontal: width * 0.08,
    paddingVertical: height * 0.02,
    borderRadius: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    
  },
  buttonText: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    color: '#140B01',
  },
});

export default OpeningScreen;