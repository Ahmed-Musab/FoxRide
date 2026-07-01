import * as React from 'react';
import { createStaticNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from './src/screens/SplashScreen';
import LoginScreen from './src/screens/auth/LoginScreen';
import AddComplaintScreen from './src/screens/complaints/AddComplaintScreen';
import AuthContextProvider from './src/context/authContext';
import ForgotPasswordScreen from './src/screens/auth/ForgotPasswordScreen';
import RegisterScreen from './src/screens/auth/RegisterScreen';
import BottomTabs from './src/navigation/bottomTabs';
import AlertsListScreen from './src/screens/alerts/AlertsListScreen';
import VehicleBookScreen from './src/screens/vehicle/VehicleBookScreen';
import AddAlertsScreen from './src/screens/alerts/AddAlertsScreen';

const RootStack = createNativeStackNavigator({
  initialRouteName: 'Splash',
  screens: {
    Splash: SplashScreen,
    Login: LoginScreen,
    EmployeeDashboard: BottomTabs,
    AddComplaint: AddComplaintScreen,
    ForgotPassword: ForgotPasswordScreen,
    Register: RegisterScreen,
    AlertsList: AlertsListScreen,
    VehicleBook: VehicleBookScreen,
    AddAlerts: AddAlertsScreen,
  },
  screenOptions: {
    headerShown: false,
  },
});

const Navigation = createStaticNavigation(RootStack);

export default function App() {
  return (
    <AuthContextProvider>
      <Navigation />
    </AuthContextProvider>
  );
}