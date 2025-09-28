import React from 'react';
import { Animated, StyleSheet, View, TouchableOpacity, Text, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { MainTabParamList, AuthStackParamList } from '../../App';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function CustomDrawer({
  visible,
  closeDrawer,
  role,
}: {
  visible: boolean,
  closeDrawer: () => void,
  role: string,
}) {
  // Use union type to allow both main and auth stack navigation
  const navigation = useNavigation<
    NativeStackNavigationProp<MainTabParamList | AuthStackParamList>
  >();
  const [animation] = React.useState(new Animated.Value(-SCREEN_WIDTH));

  React.useEffect(() => {
    Animated.timing(animation, {
      toValue: visible ? 0 : -SCREEN_WIDTH,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [visible, animation]);

  return (
    <Animated.View style={[styles.drawer, { left: animation }]}>
      <View style={styles.menu}>
  <TouchableOpacity onPress={() => { (navigation as any).navigate('ProfileScreen'); closeDrawer(); }}>
          <Text style={styles.menuText}>Profile</Text>
        </TouchableOpacity>
  <TouchableOpacity onPress={() => { (navigation as any).navigate('HomeScreen'); closeDrawer(); }}>
          <Text style={styles.menuText}>Home</Text>
        </TouchableOpacity>

  {(role === "Management" || role === "Service Head") && (
          <TouchableOpacity onPress={() => { (navigation as any).navigate('SignUp'); closeDrawer(); }}>
            <Text style={styles.menuText}>Create New User</Text>
          </TouchableOpacity>
        )}
      </View>
      <TouchableOpacity style={styles.overlay} onPress={closeDrawer} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  drawer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: SCREEN_WIDTH * 0.75,
    backgroundColor: '#fff',
    zIndex: 10,
    elevation: 20,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  menu: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  menuText: {
    fontSize: 18,
    marginVertical: 20,
    color: '#111',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: SCREEN_WIDTH * 0.75,
    width: SCREEN_WIDTH * 0.25,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
});
