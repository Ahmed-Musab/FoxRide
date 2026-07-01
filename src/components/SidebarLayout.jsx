import React, { useContext, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Image } from 'react-native';
import { useNavigation, useNavigationState } from '@react-navigation/native';
import { AuthContext } from '../context/authContext';
import LinearGradient from 'react-native-linear-gradient';
import ProfileModal from './ProfileModal';

export default function SidebarLayout({ children }) {
  const { role, logout, isMinimized, setIsMinimized } = useContext(AuthContext);
  const navigation = useNavigation();

  const [open, setOpen] = useState(false);

  // Get the current route name
  const currentRoute = useNavigationState((state) => {
    if (state && state.routes && state.index !== undefined) {
      return state.routes[state.index].name;
    }
    return '';
  });

  // If no role is active (not logged in), just render children normally without sidebar
  if (!role) {
    return <View style={styles.flex1}>{children}</View>;
  }

  const handleLogout = () => {
    logout();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  return !isMinimized ? (
    <SafeAreaView style={styles.container}>
      <View style={styles.mainWrapper}>
        <LinearGradient colors={['#002147ff', '#3c6ca1ff']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.sidebar}>

          <TouchableOpacity
            style={styles.hamburgerButton}
            onPress={() => setIsMinimized(true)}
            activeOpacity={0.7}
          >
            <Text style={styles.hamburgerText}>☰</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.contactButton}
            onPress={() => setOpen(true)}
            activeOpacity={0.7}
          >
            <Image source={require('../assets/contactButton.png')}
              style={styles.contactButton}
            />
            <Text style={styles.label}>Profile</Text>
          </TouchableOpacity>


          <TouchableOpacity
            style={[styles.logoutButton]}
            onPress={handleLogout}
            activeOpacity={0.8}
          >
            <View style={styles.linkContainer}>
              <Text style={styles.iconText}>🚪</Text>
              <Text style={styles.labelLogout}>Logout</Text>
            </View>
          </TouchableOpacity>
        </LinearGradient>

        {/* Right Content Area */}
        <View style={styles.contentArea}>
          {children}
        </View>
      </View>
      <ProfileModal open={open} close={() => setOpen(false)} />
    </SafeAreaView>
  )
    :
    (
      <>
        <TouchableOpacity
          style={[styles.hamburgerButton, { position: 'absolute', top: 25, left: 52, zIndex: 1, backgroundColor: '#243b55', borderRadius: 8 }]}
          onPress={() => setIsMinimized(false)}
          activeOpacity={0.7}
        >
          <Text style={styles.hamburgerText}>☰</Text>
        </TouchableOpacity>

        {/* Right Content Area */}
        <View style={styles.contentArea}>
          {children}
        </View>
      </>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#243b55'
  },
  mainWrapper: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebar: {
    width: 64,
    paddingHorizontal: 8,
    alignItems: 'center',
    borderTopRightRadius: 20,
    gap: 20
  },
  contactButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 8
  },
  linksContainer: {
    marginTop: 5,
    width: '100%',
  },
  linkButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 0,
    height: 48,
  },
  linkContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  label: {
    fontSize: 9,
    fontWeight: '600',
    color: 'white',
    marginTop: 2,
    textAlign: 'center',
    width: 56,
  },
  activeLabel: {
    color: '#196cd6ff',
    fontWeight: '700',
  },
  labelLogout: {
    fontSize: 9,
    fontWeight: '700',
    color: '#ffffff',
    marginTop: 2,
    textAlign: 'center',
    width: 56,
  },
  activeLinkButton: {
    backgroundColor: '#ffffff', // Oxford Blue background for active tab
    borderRadius: 10
  },
  iconText: {
    fontSize: 18,
  },
  logoutButton: {
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 0,
  },
  contentArea: {
    flex: 1,
    flexShrink: 1,
    backgroundColor: '#F8FAFC',
    overflow: 'hidden',
  },
  flex1: {
    flex: 1,
  },
  hamburgerButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 8
  },
  hamburgerText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff',
    textAlign: 'center'
  }
});
