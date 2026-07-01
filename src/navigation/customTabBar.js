import React from 'react';
import {
    View,
    TouchableOpacity,
    Text,
    Image,
    StyleSheet,
} from 'react-native';

import alertIcon from '../assets/alertIcon.png';
import dashboardIcon from '../assets/dashboardIcon.png';
import allBookingsIcon from '../assets/allBookingsIcon.png';
import complaintIcon from '../assets/complaintIcon.png';

export default function CustomTabBar({ state, descriptors, navigation }) {
    return (
        <View style={styles.container}>
            {state.routes.map((route, index) => {
                const focused = state.index === index;

                let icon;
                let displayName = route.name;

                switch (route.name) {
                    case 'Dashboard':
                        icon = dashboardIcon;
                        displayName = 'Dash';
                        break;

                    case 'Bookings':
                        icon = allBookingsIcon;
                        displayName = 'Book';
                        break;

                    case 'Complaints':
                        icon = complaintIcon;
                        displayName = 'Ad Comp.';
                        break;

                    case 'Alerts':
                        icon = alertIcon;
                        displayName = 'Alerts';
                        break;
                }

                return (
                    <TouchableOpacity
                        key={route.key}
                        onPress={() => navigation.navigate(route.name)}
                        style={[
                            styles.item,
                            focused && styles.activeItem,
                        ]}
                    >
                        <Image
                            source={icon}
                            style={[
                                styles.icon,
                                {
                                    tintColor: focused
                                        ? '#063953'
                                        : '#FFFFFF',
                                },
                            ]}
                        />

                        <Text
                            style={[
                                styles.label,
                                {
                                    color: focused
                                        ? '#063953'
                                        : '#FFFFFF',
                                },
                            ]}
                        >
                            {displayName}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: '#063953',
        marginHorizontal: 15,
        marginBottom: 15,
        borderRadius: 30,
        padding: 8,
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'space-between',
        alignItems: 'center',
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },

    item: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        paddingHorizontal: 8,
        borderRadius: 20,
        gap: 4,
        flex: 1
    },

    activeItem: {
        backgroundColor: '#FFFFFF'
    },

    icon: {
        width: 18,
        height: 18,
        resizeMode: 'contain',
    },

    label: {
        fontWeight: '700',
        fontSize: 11,
    },
});