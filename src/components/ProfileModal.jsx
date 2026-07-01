import React, { useContext } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { AuthContext } from '../context/authContext';
import { useNavigation } from '@react-navigation/native';

export default function ProfileModal({ open, close }) {
    const { logout } = useContext(AuthContext);
    const navigation = useNavigation();

    const handleLogout = () => {
        logout();
        close();
        navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
        });
    };

    return (
        <Modal
            visible={open}
            animationType="fade"
            transparent={true}
            onRequestClose={close}
        >
            <TouchableOpacity 
                style={styles.modalOverlay} 
                activeOpacity={1} 
                onPress={close}
            >
                <TouchableOpacity 
                    style={styles.modalContent} 
                    activeOpacity={1}
                >
                    {/* Back Chevron Button */}
                    <TouchableOpacity onPress={close} style={styles.backButton}>
                        <Image source={require('../assets/backButton.png')} style={styles.backButtonImage} />
                    </TouchableOpacity>

                    {/* Information Title */}
                    <Text style={styles.title}>Information</Text>

                    {/* Profile Section */}
                    <View style={styles.profileSection}>
                        {/* Circle Avatar */}
                        <View style={styles.avatarCircle}>
                            <View style={styles.avatarHead} />
                            <View style={styles.avatarBody} />
                        </View>

                        {/* User Details */}
                        <Text style={styles.userName}>Ahmed Musab</Text>
                        <Text style={styles.userDetail}>ahmed.musab@foxit.pk</Text>
                        <Text style={styles.userDetail}>03330226330</Text>
                    </View>

                    {/* Logout Button */}
                    <TouchableOpacity onPress={handleLogout} style={styles.logoutButton} activeOpacity={0.7}>
                        <Text style={styles.logoutIcon}>🚪</Text>
                        <Text style={styles.logoutText}>Logout</Text>
                    </TouchableOpacity>
                </TouchableOpacity>
            </TouchableOpacity>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '90%',
        height: '80%',
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 15,
        elevation: 10,
    },
    backButton: {
        alignSelf: 'flex-start',
        padding: 8,
    },
    backButtonImage: {
        width: 20,
        height: 20,
        tintColor: '#64748B',
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#063953',
        marginTop: 16,
    },
    profileSection: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarCircle: {
        width: 160,
        height: 160,
        borderRadius: 80,
        backgroundColor: '#E2E8F0',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        marginBottom: 24,
    },
    avatarHead: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#94A3B8',
        marginBottom: 8,
    },
    avatarBody: {
        width: 100,
        height: 50,
        borderRadius: 40,
        backgroundColor: '#94A3B8',
    },
    userName: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#063953',
        marginBottom: 8,
    },
    userDetail: {
        fontSize: 16,
        color: '#475569',
        marginBottom: 6,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 'auto',
        paddingVertical: 12,
        alignSelf: 'flex-start',
    },
    logoutIcon: {
        fontSize: 20,
        marginRight: 8,
    },
    logoutText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#DC2626',
    },
});