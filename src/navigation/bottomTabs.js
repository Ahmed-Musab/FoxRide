import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import EmployeeDashboardScreen from '../screens/dashboard/EmployeeDashboardScreen';
import AddComplaintScreen from '../screens/complaints/AddComplaintScreen';
import VehicleBookScreen from '../screens/vehicle/VehicleBookScreen';
import AddAlertsScreen from '../screens/alerts/AddAlertsScreen';
import CustomTabBar from './customTabBar';

const MyTabs = createBottomTabNavigator({
    tabBar: (props) => <CustomTabBar {...props} />,
    screenOptions: {
        headerShown: false,
        tabBarShowLabel: true,
    },
    screens: {
        Dashboard: EmployeeDashboardScreen,
        Bookings: VehicleBookScreen,
        Complaints: AddComplaintScreen,
        Alerts: AddAlertsScreen
    },
});

export default MyTabs;


