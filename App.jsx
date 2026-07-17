import * as React from 'react';
import { createStaticNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from './src/screens/SplashScreen';
import LoginScreen from './src/screens/auth/LoginScreen';
import ComplaintsListScreen from './src/screens/complaints/ComplaintsListScreen';
import AuthContextProvider from './src/context/authContext';
import ForgotPasswordScreen from './src/screens/auth/ForgotPasswordScreen';
import RegisterScreen from './src/screens/auth/RegisterScreen';
import BottomTabs from './src/navigation/bottomTabs';
import AlertsListScreen from './src/screens/alerts/AlertsListScreen';
import BookingsListScreen from './src/screens/vehicle/BookingsListScreen';
import WorkOrderListScreen from './src/screens/workOrder/WorkOrderListScreen';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

const RootStack = createNativeStackNavigator({
  initialRouteName: 'Splash',
  screens: {
    Splash: SplashScreen,
    Login: LoginScreen,
    EmployeeDashboard: BottomTabs,
    ForgotPassword: ForgotPasswordScreen,
    Register: RegisterScreen,
    AlertsList: AlertsListScreen,
    ComplaintsList: ComplaintsListScreen,
    BookingsList: BookingsListScreen,
    WorkOrderList: WorkOrderListScreen,
  },
  screenOptions: {
    headerShown: false,
  },
});

const Navigation = createStaticNavigation(RootStack);

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
    <AuthContextProvider>
      <Navigation />
    </AuthContextProvider>
    </QueryClientProvider>
  );
}