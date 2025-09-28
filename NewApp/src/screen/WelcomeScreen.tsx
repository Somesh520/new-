import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Platform,
} from 'react-native';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../App';

type WelcomeScreenProps = NativeStackScreenProps<AuthStackParamList, 'Welcome'>;

const PALE_BLUE = '#E7EFFC';
const KANCHAN_BLUE = '#264B89';
const WHITE = '#fff';

const WelcomeScreen = ({ navigation }: WelcomeScreenProps) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.centerBlock}>
        <View style={styles.logoRow}>
          <Image
            // Use your drop icon here (jpg/png, ideally transparent background)
            source={require('../assets/images/Icons.jpg')}
            style={styles.logoIcon}
            resizeMode="contain"
          />
          
          <View style={styles.logoLabelBlock}>
            <Text style={styles.logoLabel}>KANCHAN</Text>
            <View style={styles.labelUnderline} />
            <Text style={styles.logoSince}>SINCE 1984</Text>
          </View>
        </View>
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('SignIn')}
        activeOpacity={0.82}
      >
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PALE_BLUE,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  centerBlock: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
  },
  logoIcon: {
    width: 62,  // ensures square and big as per your reference
    height: 62,
    marginRight: 10,
  },
  logoLabelBlock: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginLeft: 2,
  },
  logoLabel: {
    color: KANCHAN_BLUE, 
    fontSize: 28, 
    fontWeight: "bold",
    letterSpacing: 2.5,
    fontFamily: Platform.select({ ios: 'serif', android: 'serif' }),
    marginBottom: 0,
    marginLeft: 2,
  },
  labelUnderline: {
    marginTop: 0,
    height: 2,
    backgroundColor: "#21417B",
    borderRadius: 99,
    width: 110, // adjust width for match
    marginBottom: 3,
  },
  logoSince: {
    color: "#254B88",
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 1,
    marginLeft: 2,
    marginTop: 2,
  },
  button: {
    backgroundColor: KANCHAN_BLUE,
    paddingVertical: 15,
    borderRadius: 26,
    width: '88%',
    alignSelf: 'center',
    alignItems: 'center',
    marginBottom: 34,
    elevation: 5,
    shadowColor: "#587BBA",
    shadowRadius: 11,
    shadowOpacity: 0.16,
    shadowOffset: { width: 0, height: 2 },
  },
  buttonText: {
    color: WHITE,
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.8,
  },
});

export default WelcomeScreen;
