import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import EmployeeDashboardScreen from '../screens/dashboard/EmployeeDashboardScreen';
import AddComplaintScreen from '../screens/complaints/AddComplaintScreen';
import VehicleBookScreen from '../screens/vehicle/VehicleBookScreen';
import AddAlertsScreen from '../screens/alerts/AddAlertsScreen';
import { Image } from 'react-native';
import CustomTabBar from './customTabBar';

const MyTabs = createBottomTabNavigator({
    tabBar: (props) => <CustomTabBar {...props} />,
    screenOptions: ({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarIcon: ({ focused }) => {
            let icon;

            switch (route.name) {
                case 'Dashboard':
                    icon = focused ? alertIconActive : alertIconInactive;
                    break;
                case 'BookingsList':
                    icon = focused ? alertIconActive : alertIconInactive;
                    break;
                case 'ComplaintsList':
                    icon = focused ? alertIconActive : alertIconInactive;
                    break;
                case 'Alerts':
                    icon = focused ? alertIconActive : alertIconInactive;
                    break;
            }
            return (
                    <Image
                        source={icon}
                        style={{
                            width: 20,
                            height: 20,
                            resizeMode: 'contain',
                        }}
                    />
            );
        }
    }),
    screens: {
        Dashboard: EmployeeDashboardScreen,
        Bookings: VehicleBookScreen,
        Complaints: AddComplaintScreen,
        Alerts: AddAlertsScreen
    },
});

export default MyTabs;


