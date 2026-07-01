import React from 'react';
import { View, Image, Pressable, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const SplashScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/splash.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      <Image
        source={require('../assets/foxrideLogo4.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Pressable style={styles.signInButton} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.signInButtonText}>Sign In</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  backgroundImage: {
    position: 'absolute',
    width: "100%",
    height: "100%",
    opacity: 0.4,
  },
  logo: {
    width: 250,
    height: 250,
    alignSelf: 'center',
    position: 'absolute',
    top: '10%',
  },
  signInButton: {
    backgroundColor: '#243b55',
    width: '50%',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    position: 'absolute',
    bottom: 100,
  },
  signInButtonText: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#fff',
    fontSize: 14,
  },
});

export default SplashScreen;