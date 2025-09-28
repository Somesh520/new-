
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar, StyleSheet } from 'react-native';
import CustomDrawer from './src/components/CustomDrawer';
import { AuthProvider, useAuth } from './src/context/AuthContext';

import WelcomeScreen from './src/screen/WelcomeScreen';
import SignInScreen from './src/screen/SignInScreen';
import SignUpScreen from './src/screen/SignUpScreen';
import HomeScreen from './src/screen/HomeScreen';
import TasksScreen from './src/screen/TasksScreen';
import CustomerManagement from './src/screen/CustomerManagement';
import { ServiceLogsScreen } from './src/screen/ServiceLogs';
import MachineHistoryScreen from './src/screen/MachineHistory';
import NotificationsScreen from './src/screen/NotificationsScreen';
import ProfileScreen from './src/screen/ProfileScreen';
import AddCustomerScreen from './src/components/AddCustomerScreen';

const AuthNavigator = () => (
  <AuthStack.Navigator
    screenOptions={{
      headerShown: false,
      contentStyle: { backgroundColor: 'transparent' },
    }}
    initialRouteName="Welcome"
  >
    <AuthStack.Screen name="Welcome" component={WelcomeScreen} />
    <AuthStack.Screen name="SignIn" component={SignInScreen} />
    <AuthStack.Screen name="SignUp" component={SignUpScreen} />
  </AuthStack.Navigator>
);

export type AuthStackParamList = {
  Welcome: undefined;
  SignIn: undefined;
  SignUp: undefined;
};
export type MainTabParamList = {
  HomeScreen: undefined;
  TasksScreen: undefined;
  ProfileScreen: undefined;
  Customers: undefined;
  ServiceLogs: undefined;
  MachineHistory: undefined;
  Notifications: undefined;
  AddCustomer: undefined;
  SignUp: undefined;
};

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const MainStack = createNativeStackNavigator<MainTabParamList>();
const MainStackNavigator = ({ openDrawer }: { openDrawer: () => void }) => (
  <MainStack.Navigator
    screenOptions={{
      headerShown: false,
      contentStyle: { backgroundColor: 'transparent' },
    }}
    initialRouteName="HomeScreen"
  >
    <MainStack.Screen name="HomeScreen">
      {props => <HomeScreen {...props} openDrawer={openDrawer} />}
    </MainStack.Screen>
    <MainStack.Screen name="AddCustomer" component={AddCustomerScreen} />
    <MainStack.Screen name="TasksScreen">
      {props => <TasksScreen {...props} openDrawer={openDrawer} />}
    </MainStack.Screen>
    <MainStack.Screen name="ProfileScreen" component={ProfileScreen} />
    <MainStack.Screen name="Customers" component={CustomerManagement} />
    <MainStack.Screen name="ServiceLogs">
      {props => <ServiceLogsScreen {...props} openDrawer={openDrawer} />}
    </MainStack.Screen>
    <MainStack.Screen name="MachineHistory">
      {props => <MachineHistoryScreen {...props} openDrawer={openDrawer} />}
    </MainStack.Screen>
    <MainStack.Screen name="Notifications">
      {props => <NotificationsScreen {...props} openDrawer={openDrawer} />}
    </MainStack.Screen>
    <MainStack.Screen name="SignUp" component={SignUpScreen} />
  </MainStack.Navigator>
);

const AppContent = () => {
  const { isUserLoggedIn, user } = useAuth();
  const [drawerVisible, setDrawerVisible] = React.useState(false);
  const openDrawer = () => setDrawerVisible(true);
  const closeDrawer = () => setDrawerVisible(false);

  // Wrap NavigationContainer with SafeAreaView to safely render under notches etc.
  return (
    <SafeAreaView style={styles.safeArea}>
      <NavigationContainer>
        <StatusBar
          barStyle="dark-content"
          backgroundColor="transparent"
          translucent={true}
        />
        {/* Render CustomDrawer at top level, pass role from user */}
        <CustomDrawer visible={drawerVisible} closeDrawer={closeDrawer} role={user?.role || "Guest"} />
        {/* Pass openDrawer to HomeScreen as a prop */}
        {isUserLoggedIn ? <MainStackNavigator openDrawer={openDrawer} /> : <AuthNavigator />}
      </NavigationContainer>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </SafeAreaProvider>
  );
}

export default App;
