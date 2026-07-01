import React from 'react';
import { TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function BackButton() {
  const navigation = useNavigation();

  // If there's no screen to go back to, don't render the back button.
  if (!navigation.canGoBack()) {
    return null;
  }

  return (
    <TouchableOpacity
      onPress={() => navigation.goBack()}
      activeOpacity={0.7}
    >
      <Image source={require('../assets/backButton.png')} style={styles.icon} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  icon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    marginTop: 4
  },
});
