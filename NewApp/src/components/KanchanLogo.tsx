import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

const KanchanLogo = ({ size = 120 }) => {
  return (
    <View style={[styles.logoContainer, { width: size, height: size }]}>
      <Image
        source={require('../assets/images/kanchan-logo.png')}
        style={[styles.logo, { width: size, height: size }]}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: '100%',
    height: '100%',
  },
});

export default KanchanLogo;
