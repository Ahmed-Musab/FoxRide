import React, { useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, KeyboardAvoidingView, Platform, ScrollView, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { AuthContext } from '../../context/authContext';
import LinearGradient from 'react-native-linear-gradient';

const schema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().required("Password is required"),
});

const LoginScreen = () => {
  const role = 'employee';
  const { login } = useContext(AuthContext);
  const navigation = useNavigation();
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onSubmit = () => {
    login(role);
    navigation.navigate('EmployeeDashboard');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">

        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/foxrideLogo3.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* Form */}
        <View style={styles.formContainer}>
          <Text style={styles.label}>Email Address</Text>
          <Controller
            name="email"
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                placeholder="Enter your email"
                placeholderTextColor="#888"
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
              />
            )}
          />
          {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}

          <Text style={styles.label}>Password</Text>
          <Controller
            name="password"
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={{position: 'relative'}}>
              <TextInput
                placeholder="Enter your password"
                placeholderTextColor="#888"
                style={styles.input}
                secureTextEntry
                autoCapitalize="none"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
              />
              <TouchableOpacity>
               <Image source={require('../../assets/eyeIcon.png')} style={styles.eyeIcon} />
              </TouchableOpacity>
              </View>
            )}
          />
          {errors.password && <Text style={styles.error}>{errors.password.message}</Text>}

          <Pressable style={styles.forgotPassword} onPress={() => navigation.navigate('ForgotPassword')}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </Pressable>

          {/* Login Button */}
          <LinearGradient colors={['#0C7990', '#243b55']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <TouchableOpacity
              style={styles.button}
              activeOpacity={0.8}
              onPress={handleSubmit(onSubmit)}
            >
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 100
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 40
  },
  backButtonWrapper: {
    marginTop: 50,
    alignSelf: 'flex-start',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  logo: {
    height: 120,
    width: 120
  },
  headerSection: {
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#002147',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#666',
  },
  formContainer: {
    flex: 1,
    paddingTop: 30
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#243b55',
    marginBottom: 8,
  },
  eyeIcon: {
    position: 'absolute',
    right: 12,
    bottom: 30,
    width: 22,
    height: 22,
    resizeMode: 'contain'
  },
  input: {
    width: '100%',
    height: 52,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#F8FAFC',
    marginBottom: 16,
    elevation: 10
  },
  button: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 14,
    paddingBottom: 14
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    letterSpacing: 1,
  },
  error: {
    color: '#DC2626',
    fontSize: 12,
    marginTop: -10,
    marginBottom: 12,
    fontWeight: '500',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: '#243b55',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default LoginScreen;
