import React, { useRef, useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image
} from 'react-native';
import SidebarLayout from '../../components/SidebarLayout';
import BackButton from '../../components/BackButton';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import ProfileModal from '../../components/ProfileModal';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

const bookingSchema = yup.object().shape({
  bookingFor: yup.string().required('Booking For is required'),
  allowanceApproved: yup.boolean(),
  date: yup.string().required('Date is required'),
  time: yup.string().required('Time is required'),
  multipleDay: yup.boolean(),
  selfDriving: yup.boolean(),
  rentedCar: yup.boolean(),
  purpose: yup.string().required('Purpose of booking is required'),
  natureOfBooking: yup.string().required('Nature of booking is required'),
  locationType: yup.string().required('Location type is required'),
  department: yup.string().required('Department is required'),
  employee: yup.string().required('Employee is required'),
  location: yup.string().required('Location is required'),
  coordinates: yup.string().required('Coordinates are required'),
  comments: yup.string(),
});

export default function VehicleBookScreen() {
  const [open, setOpen] = useState(false);
  const navigation = useNavigation();
  const scrollViewRef = useRef(null);

  useFocusEffect(
    useCallback(() => {
      scrollViewRef.current?.scrollTo({ y: 0, animated: false });
    }, [])
  );

  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(bookingSchema),
    defaultValues: {
      bookingFor: 'Employee',
      allowanceApproved: false,
      date: '',
      time: '',
      multipleDay: false,
      selfDriving: false,
      rentedCar: false,
      purpose: '',
      natureOfBooking: 'Pickup',
      locationType: 'Single',
      department: 'Group HR - Education',
      employee: '',
      location: '',
      coordinates: '',
      comments: '',
    }
  });

  const onSubmit = (data) => {
    alert('Booking Submitted Successfully!');
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
          <TouchableOpacity onPress={() => setOpen(true)}>
            <Image source={require('../../assets/contactButton.png')}
              style={styles.contactButton}
            />
          </TouchableOpacity>
        </View>
        <View style={{ width: '90%', height: 0.5, backgroundColor: '#3d4859ff', alignSelf: 'center' }} />

        {/* ── Form Card ── */}
        <ScrollView ref={scrollViewRef} contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.card}>

            {/* Booking For */}
            <View style={styles.formGroup}>
              <Text style={styles.sectionLabel}>Booking For</Text>
              <Controller
                control={control}
                name="bookingFor"
                render={({ field: { onChange, value } }) => (
                  <View style={styles.row}>
                    <TouchableOpacity
                      style={styles.radioWrapper}
                      onPress={() => onChange('Employee')}
                      activeOpacity={0.7}
                    >
                      <View style={styles.radioOuter}>
                        {value === 'Employee' && <View style={styles.radioInner} />}
                      </View>
                      <Text style={styles.radioLabel}>Employee</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.radioWrapper}
                      onPress={() => onChange('Guest')}
                      activeOpacity={0.7}
                    >
                      <View style={styles.radioOuter}>
                        {value === 'Guest' && <View style={styles.radioInner} />}
                      </View>
                      <Text style={styles.radioLabel}>Guest</Text>
                    </TouchableOpacity>
                  </View>
                )}
              />
              {errors.bookingFor && <Text style={styles.errorText}>{errors.bookingFor.message}</Text>}
            </View>

            {/* Allowance Staff Approved */}
            <View style={styles.formGroup}>
              <Controller
                control={control}
                name="allowanceApproved"
                render={({ field: { onChange, value } }) => (
                  <TouchableOpacity
                    style={styles.checkboxWrapper}
                    onPress={() => onChange(!value)}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.checkboxOuter, value && styles.checkboxOuterChecked]}>
                      {value && <Text style={styles.checkboxCheckmark}>✓</Text>}
                    </View>
                    <Text style={styles.checkboxLabel}>Allowance Staff Approved</Text>
                  </TouchableOpacity>
                )}
              />
            </View>

            {/* Select Date * */}
            <View style={styles.formGroup}>
              <Text style={styles.sectionLabel}>Select Date <Text style={styles.required}>*</Text></Text>
              <View style={styles.inputWrapperWithIcon}>
                <Controller
                  control={control}
                  name="date"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      placeholder="DD/MM/YYYY"
                      placeholderTextColor="#a0aec0"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      style={[styles.input, errors.date && styles.inputError]}
                    />
                  )}
                />
                <Image source={require('../../assets/allBookingsIcon.png')} style={styles.inputIcon} />
              </View>
              {errors.date && <Text style={styles.errorText}>{errors.date.message}</Text>}
            </View>

            {/* Select Time * */}
            <View style={styles.formGroup}>
              <Text style={styles.sectionLabel}>Select Time <Text style={styles.required}>*</Text></Text>
              <View style={styles.inputWrapperWithIcon}>
                <Controller
                  control={control}
                  name="time"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      placeholder="HH:MM AM/PM"
                      placeholderTextColor="#a0aec0"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      style={[styles.input, errors.time && styles.inputError]}
                    />
                  )}
                />
                <Image source={require('../../assets/pendingIcon.png')} style={styles.inputIcon} />
              </View>
              {errors.time && <Text style={styles.errorText}>{errors.time.message}</Text>}
            </View>

            {/* Multiple Day Booking */}
            <View style={styles.formGroup}>
              <Controller
                control={control}
                name="multipleDay"
                render={({ field: { onChange, value } }) => (
                  <TouchableOpacity
                    style={styles.checkboxWrapper}
                    onPress={() => onChange(!value)}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.checkboxOuter, value && styles.checkboxOuterChecked]}>
                      {value && <Text style={styles.checkboxCheckmark}>✓</Text>}
                    </View>
                    <Text style={styles.checkboxLabel}>Multiple Day Booking</Text>
                  </TouchableOpacity>
                )}
              />
            </View>

            {/* Self Driving */}
            <View style={styles.formGroup}>
              <Controller
                control={control}
                name="selfDriving"
                render={({ field: { onChange, value } }) => (
                  <TouchableOpacity
                    style={styles.checkboxWrapper}
                    onPress={() => onChange(!value)}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.checkboxOuter, value && styles.checkboxOuterChecked]}>
                      {value && <Text style={styles.checkboxCheckmark}>✓</Text>}
                    </View>
                    <Text style={styles.checkboxLabel}>Self Driving</Text>
                  </TouchableOpacity>
                )}
              />
            </View>

            {/* Rented Car Required */}
            <View style={styles.formGroup}>
              <Controller
                control={control}
                name="rentedCar"
                render={({ field: { onChange, value } }) => (
                  <TouchableOpacity
                    style={styles.checkboxWrapper}
                    onPress={() => onChange(!value)}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.checkboxOuter, value && styles.checkboxOuterChecked]}>
                      {value && <Text style={styles.checkboxCheckmark}>✓</Text>}
                    </View>
                    <Text style={styles.checkboxLabel}>Rented Car Required</Text>
                  </TouchableOpacity>
                )}
              />
            </View>

            {/* Purpose of Booking * */}
            <View style={styles.formGroup}>
              <Text style={styles.sectionLabel}>Purpose of Booking <Text style={styles.required}>*</Text></Text>
              <Controller
                control={control}
                name="purpose"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    placeholder="e.g. Event, Transport, Delivery"
                    placeholderTextColor="#a0aec0"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    style={[styles.input, errors.purpose && styles.inputError]}
                  />
                )}
              />
              {errors.purpose && <Text style={styles.errorText}>{errors.purpose.message}</Text>}
            </View>

            {/* Nature of Booking */}
            <View style={styles.formGroup}>
              <Text style={styles.sectionLabel}>Nature of Booking</Text>
              <Controller
                control={control}
                name="natureOfBooking"
                render={({ field: { onChange, value } }) => (
                  <View>
                    <View style={styles.row}>
                      <TouchableOpacity
                        style={styles.radioWrapper}
                        onPress={() => onChange('Pickup')}
                        activeOpacity={0.7}
                      >
                        <View style={styles.radioOuter}>
                          {value === 'Pickup' && <View style={styles.radioInner} />}
                        </View>
                        <Text style={styles.radioLabel}>Pickup</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.radioWrapper}
                        onPress={() => onChange('Dropoff')}
                        activeOpacity={0.7}
                      >
                        <View style={styles.radioOuter}>
                          {value === 'Dropoff' && <View style={styles.radioInner} />}
                        </View>
                        <Text style={styles.radioLabel}>Dropoff</Text>
                      </TouchableOpacity>
                    </View>
                    <View style={[styles.row, { marginTop: 10 }]}>
                      <TouchableOpacity
                        style={styles.radioWrapper}
                        onPress={() => onChange('N/A')}
                        activeOpacity={0.7}
                      >
                        <View style={styles.radioOuter}>
                          {value === 'N/A' && <View style={styles.radioInner} />}
                        </View>
                        <Text style={styles.radioLabel}>N/A</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              />
              {errors.natureOfBooking && <Text style={styles.errorText}>{errors.natureOfBooking.message}</Text>}
            </View>

            {/* Location Type */}
            <View style={styles.formGroup}>
              <Text style={styles.sectionLabel}>Location Type</Text>
              <Controller
                control={control}
                name="locationType"
                render={({ field: { onChange, value } }) => (
                  <View style={styles.row}>
                    <TouchableOpacity
                      style={styles.radioWrapper}
                      onPress={() => onChange('Single')}
                      activeOpacity={0.7}
                    >
                      <View style={styles.radioOuter}>
                        {value === 'Single' && <View style={styles.radioInner} />}
                      </View>
                      <Text style={styles.radioLabel}>Single</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.radioWrapper}
                      onPress={() => onChange('Multiple')}
                      activeOpacity={0.7}
                    >
                      <View style={styles.radioOuter}>
                        {value === 'Multiple' && <View style={styles.radioInner} />}
                      </View>
                      <Text style={styles.radioLabel}>Multiple</Text>
                    </TouchableOpacity>
                  </View>
                )}
              />
              {errors.locationType && <Text style={styles.errorText}>{errors.locationType.message}</Text>}
            </View>

            {/* Department */}
            <View style={styles.formGroup}>
              <Text style={styles.sectionLabel}>Department</Text>
              <View style={styles.dropdownWrapper}>
                <Controller
                  control={control}
                  name="department"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      placeholder="Group HR - Education"
                      placeholderTextColor="#0F172A"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      style={[styles.input, errors.department && styles.inputError]}
                    />
                  )}
                />
                <Text style={styles.dropdownArrow}>▼</Text>
              </View>
              {errors.department && <Text style={styles.errorText}>{errors.department.message}</Text>}
            </View>

            {/* Employee */}
            <View style={styles.formGroup}>
              <Text style={styles.sectionLabel}>Employee</Text>
              <View style={styles.dropdownWrapper}>
                <Controller
                  control={control}
                  name="employee"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      placeholder="Select Employee"
                      placeholderTextColor="#a0aec0"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      style={[styles.input, errors.employee && styles.inputError]}
                    />
                  )}
                />
                <Text style={styles.dropdownArrow}>▼</Text>
              </View>
              {errors.employee && <Text style={styles.errorText}>{errors.employee.message}</Text>}
            </View>

            {/* Location * */}
            <View style={styles.formGroup}>
              <Text style={styles.sectionLabel}>Location <Text style={styles.required}>*</Text></Text>
              <Controller
                control={control}
                name="location"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    placeholder="e.g. Head Office"
                    placeholderTextColor="#a0aec0"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    style={[styles.input, errors.location && styles.inputError]}
                  />
                )}
              />
              {errors.location && <Text style={styles.errorText}>{errors.location.message}</Text>}
            </View>

            {/* Coordinates * */}
            <View style={styles.formGroup}>
              <Text style={styles.sectionLabel}>Coordinates <Text style={styles.required}>*</Text></Text>
              <Controller
                control={control}
                name="coordinates"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    placeholder="e.g. 24.7136, 46.6753"
                    placeholderTextColor="#a0aec0"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    style={[styles.input, errors.coordinates && styles.inputError]}
                  />
                )}
              />
              {errors.coordinates && <Text style={styles.errorText}>{errors.coordinates.message}</Text>}
            </View>

            {/* Comments */}
            <View style={styles.formGroup}>
              <Text style={styles.sectionLabel}>Comments</Text>
              <Controller
                control={control}
                name="comments"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    placeholder="e.g. Event, Transport, Delivery"
                    placeholderTextColor="#a0aec0"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    style={[styles.input, errors.comments && styles.inputError]}
                  />
                )}
              />
              {errors.comments && <Text style={styles.errorText}>{errors.comments.message}</Text>}
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleSubmit(onSubmit)}
              style={styles.submitButton}
            >
              <Text style={styles.submitButtonText}>Book Vehicle</Text>
            </TouchableOpacity>
          </View>

          {/* View Bookings Button */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate('BookingsList')}
            style={{ backgroundColor: '#243b55', width: '50%', marginLeft: '25%', marginTop: 10, marginBottom: 20, justifyContent: 'center', padding: 12, borderRadius: 12, alignItems: 'center' }}
          >
            <Text style={{ textAlign: 'center', fontWeight: 'bold', color: '#fff', fontSize: 14 }}>View Bookings</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
      <ProfileModal open={open} close={() => setOpen(false)} />
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
    marginLeft: 52
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
    paddingBottom: 100,
  },

  /* ── Form Card ── */
  card: {
    margin: 16,
    padding: 20,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    gap: 20,
  },

  /* ── Form Items ── */
  formGroup: {
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    gap: 24,
    alignItems: 'center',
  },
  sectionLabel: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#243b55',
  },
  required: {
    color: '#ef4444',
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 14,
    color: '#243b55',
    backgroundColor: '#f8fafc',
  },
  inputError: {
    borderColor: '#EF4444',
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
    fontWeight: '500',
  },

  /* ── Radio Buttons ── */
  radioWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#063953',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#063953',
  },
  radioLabel: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#243b55',
  },

  /* ── Checkboxes ── */
  checkboxWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkboxOuter: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#cbd5e1',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  checkboxOuterChecked: {
    borderColor: '#063953',
  },
  checkboxCheckmark: {
    color: '#063953',
    fontWeight: 'bold',
    fontSize: 14,
  },
  checkboxLabel: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#243b55',
  },

  /* ── Icons inside Inputs ── */
  inputWrapperWithIcon: {
    position: 'relative',
    justifyContent: 'center',
  },
  inputIcon: {
    position: 'absolute',
    right: 14,
    width: 20,
    height: 20,
    resizeMode: 'contain',
    tintColor: '#243b55',
  },

  /* ── Dropdowns ── */
  dropdownWrapper: {
    position: 'relative',
    justifyContent: 'center',
  },
  dropdownArrow: {
    position: 'absolute',
    right: 14,
    color: '#000000',
    fontSize: 12,
  },

  /* ── Submit Button ── */
  submitButton: {
    height: 50,
    backgroundColor: '#063953',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
