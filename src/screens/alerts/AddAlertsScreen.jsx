import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Pressable,
  Image
} from 'react-native';
import SidebarLayout from '../../components/SidebarLayout';
import BackButton from '../../components/BackButton';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigation } from '@react-navigation/native';

const alertSchema = yup.object().shape({
  vehicleNo: yup.string().required('Vehicle number is required'),
  alertType: yup.string().required('Alert type is required'),
  alertName: yup.string().required('Alert name is required'),
  date: yup.string().required('Date is required'),
  status: yup.string().required('Status is required'),
});

export default function AddAlertsScreen() {
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(alertSchema),
    defaultValues: {
      vehicleNo: '',
      alertType: '',
      alertName: '',
      date: '',
      status: '',
    }
  });

  const navigation = useNavigation();

  const onSubmit = (data) => {
    alert('Alert Submitted Successfully!');
    console.log(data);
  };

  return (
    <SidebarLayout>
      <View style={styles.container}>
        {/* Header Block */}
        <View style={styles.header}>
          <BackButton />
          <View style={styles.titleWrapper}>
            <Image style={styles.logo} source={require('../../assets/foxrideLogo5.png')} />
          </View>
          <TouchableOpacity>
            <Image source={require('../../assets/contactButton.png')}
              style={styles.contactButton}
            />
          </TouchableOpacity>
        </View>
        <View style={{ width: '90%', height: 0.5, backgroundColor: '#3d4859ff', alignSelf: 'center' }} />

        {/* ── Scrollable Form Card ── */}
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.card}>
            
            {/* Vehicle No */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Vehicle No <Text style={styles.required}>*</Text></Text>
              <Controller
                control={control}
                name="vehicleNo"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    placeholder="e.g. MP31V1234"
                    placeholderTextColor="#94A3B8"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    style={[styles.input, errors.vehicleNo && styles.inputError]}
                  />
                )}
              />
              {errors.vehicleNo && <Text style={styles.errorText}>{errors.vehicleNo.message}</Text>}
            </View>

            {/* Alert Type */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Alert Type <Text style={styles.required}>*</Text></Text>
              <Controller
                control={control}
                name="alertType"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    placeholder="e.g. Wheel Alignment, Tyre Pressure"
                    placeholderTextColor="#94A3B8"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    style={[styles.input, errors.alertType && styles.inputError]}
                  />
                )}
              />
              {errors.alertType && <Text style={styles.errorText}>{errors.alertType.message}</Text>}
            </View>

            {/* Alert Name */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Alert Name <Text style={styles.required}>*</Text></Text>
              <Controller
                control={control}
                name="alertName"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    placeholder="e.g. Oil Change, Low Tyre Pressure"
                    placeholderTextColor="#94A3B8"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    style={[styles.input, errors.alertName && styles.inputError]}
                  />
                )}
              />
              {errors.alertName && <Text style={styles.errorText}>{errors.alertName.message}</Text>}
            </View>

            {/* Date */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Date <Text style={styles.required}>*</Text></Text>
              <Controller
                control={control}
                name="date"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    placeholder="DD/MM/YYYY"
                    placeholderTextColor="#94A3B8"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    style={[styles.input, errors.date && styles.inputError]}
                  />
                )}
              />
              {errors.date && <Text style={styles.errorText}>{errors.date.message}</Text>}
            </View>

            {/* Status */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Status <Text style={styles.required}>*</Text></Text>
              <Controller
                control={control}
                name="status"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    placeholder="e.g. Active, Pending, Inactive"
                    placeholderTextColor="#94A3B8"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    style={[styles.input, errors.status && styles.inputError]}
                  />
                )}
              />
              {errors.status && <Text style={styles.errorText}>{errors.status.message}</Text>}
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleSubmit(onSubmit)}
              style={styles.submitButton}
            >
              <Text style={styles.submitButtonText}>Submit Alert</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* View Alerts Navigation Button */}
        <Pressable style={{ backgroundColor: '#243b55', width: '50%', marginLeft: '25%', justifyContent: 'center', padding: 12, borderRadius: 12, marginBottom: 26, alignItems: 'center' }}
          onPress={() => navigation.navigate('AlertsList')}
        >
          <Text style={{ textAlign: 'center', fontWeight: 'bold', color: '#fff', fontSize: 14 }}>View Alerts</Text>
        </Pressable>

      </View>
    </SidebarLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },

  /* Header Block */
  header: {
    paddingVertical: 24,
    paddingHorizontal: 15,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center'
  },
  contactButton: {
    height: 32,
    width: 32,
    resizeMode: 'contain',
    marginLeft: 60
  },
  logo: {
    height: 42,
    width: 142,
    resizeMode: 'contain'
  },
  titleWrapper: {
    marginTop: 11,
    marginLeft: 75
  },

  /* ── Scroll Area ── */
  scrollContainer: {
    paddingBottom: 40,
  },

  /* ── Form Card ── */
  card: {
    margin: 16,
    padding: 20,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    gap: 16,
  },

  /* ── Form Items ── */
  formGroup: {
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
  },
  required: {
    color: '#EF4444',
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingHorizontal: 14,
    fontSize: 14,
    color: '#0F172A',
    backgroundColor: '#F8FAFC',
  },
  inputError: {
    borderColor: '#EF4444',
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
    fontWeight: '500',
  },

  submitButton: {
    minHeight: 50,
    backgroundColor: '#243b55',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 14,
    padding: 10,
    fontWeight: '700',
    textAlign: 'center',
  },
});
