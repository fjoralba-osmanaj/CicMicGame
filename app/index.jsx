// app/index.js
import { useNavigation } from 'expo-router';
import React, {useEffect} from 'react';
import { Text, StyleSheet,ImageBackground,Dimensions } from 'react-native';
import Game from '../Game'
import { SafeAreaView } from 'react-native-safe-area-context';


const { width, height } = Dimensions.get('window');
export default function HomeScreen() {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]); 
  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
            source={require('../assets/images/sfonde.jpg')}//Imazhi ne sfond
            blurRadius={4}
            style={styles.backgroundContainer}
            resizeMode="cover"
            
         > 
      
      
      <Game />
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 0,
    backgroundColor: '#000000'
  },
  backgroundContainer: {
    flex: 1,
    width: width,  // Ensure full screen width
    height: height, // Ensure full screen height
    
  }
});
