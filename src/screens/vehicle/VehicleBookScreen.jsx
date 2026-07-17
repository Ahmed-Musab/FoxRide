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
import { createBooking } from '../../api/bookings/createBooking';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';

const bookingSchema = yup.object().shape({
  bookingFor: yup.string().required("Selection is required"),
  allowanceStaff: yup.boolean(),
  date: yup.string().required("Start date is required"),
  time: yup.string().required("Start time is required"),
  multipleDay: yup.boolean(),
  toDate: yup.string().when("multipleDay", {
    is: true,
    then: (schema) => schema.required("End date is required"),
    otherwise: (schema) => schema.notRequired()
  }),
  toTime: yup.string().when("multipleDay", {
    is: true,
    then: (schema) => schema.required("End time is required"),
    otherwise: (schema) => schema.notRequired()
  }),
  selfDriving: yup.boolean(),
  rentedCar: yup.boolean(),
  purpose: yup.string().required("Purpose of booking is required"),
  comments: yup.string(),
  bookingNature: yup.string().required("Booking nature is required"),
  locationType: yup.string().required("Location type is required"),
  department: yup.string().required("Department is required"),
  location: yup.string().required("Location is required"),
});

export default function VehicleBookScreen() {
  const [open, setOpen] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showToDatePicker, setShowToDatePicker] = useState(false);
  const [showToTimePicker, setShowToTimePicker] = useState(false);

  const navigation = useNavigation();
  const scrollViewRef = useRef(null);

  useFocusEffect(
    useCallback(() => {
      scrollViewRef.current?.scrollTo({ y: 0, animated: false });
    }, [])
  );

  const { control, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: yupResolver(bookingSchema),
    defaultValues: {
      bookingFor: 'Employee',
      allowanceStaff: false,
      date: '',
      time: '',
      multipleDay: false,
      selfDriving: false,
      rentedCar: false,
      purpose: '',
      bookingNature: 'Pickup',
      locationType: 'Single Location',
      department: '',
      location: '',
      comments: '',
    }
  });

  const isMultipleDay = watch('multipleDay');

  const formatDateDisplay = (dateStr) => {
    if (!dateStr) return 'Select Date';
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  };

  const formatTimeDisplay = (timeStr) => {
    if (!timeStr) return 'Select Time';
    const [hoursStr, minutesStr] = timeStr.split(':');
    const hours = parseInt(hoursStr, 10);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    const paddedHours = displayHours < 10 ? `0${displayHours}` : displayHours;
    return `${paddedHours}:${minutesStr} ${ampm}`;
  };

  const getDateObject = (dateStr) => {
    if (!dateStr) return new Date();
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day);
  };

  const getTimeObject = (timeStr) => {
    if (!timeStr) return new Date();
    const [hours, minutes] = timeStr.split(':').map(Number);
    const d = new Date();
    d.setHours(hours, minutes, 0, 0);
    return d;
  };

  const formatDateValue = (dateObj) => {
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formatTimeValue = (dateObj) => {
    const hours = String(dateObj.getHours()).padStart(2, '0');
    const minutes = String(dateObj.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const onSubmit = async (data) => {
    try {
      await createBooking(data, );
      alert('Booking Submitted Successfully!');
    } catch (error) {
      console.log('API Error:', error);
      alert(error.response?.data?.message || 'Failed to submit booking');
    }
  };

  const onError = (errors) => {
    console.log('Validation Errors:', errors);
    alert('Please fill out all required fields correctly.');
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

            {/* Allowance Staff */}
            <View style={styles.formGroup}>
              <Controller
                control={control}
                name="allowanceStaff"
                render={({ field: { onChange, value } }) => (
                  <TouchableOpacity
                    style={styles.checkboxWrapper}
                    onPress={() => onChange(!value)}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.checkboxOuter, value && styles.checkboxOuterChecked]}>
                      {value && <Text style={styles.checkboxCheckmark}>✓</Text>}
                    </View>
                    <Text style={styles.checkboxLabel}>Allowance Staff</Text>
                  </TouchableOpacity>
                )}
              />
              {errors.allowanceStaff && <Text style={styles.errorText}>{errors.allowanceStaff.message}</Text>}
            </View>

            {/* Select Date * */}
            <View style={styles.formGroup}>
              <Text style={styles.sectionLabel}>Select Date <Text style={styles.required}>*</Text></Text>
              <View style={styles.inputWrapperWithIcon}>
                <Controller
                  control={control}
                  name="date"
                  render={({ field: { onChange, value } }) => (
                    <>
                      <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => setShowDatePicker(true)}
                        style={[styles.input, styles.inputTouchable, errors.date && styles.inputError]}
                      >
                        <Text style={[styles.inputText, !value && styles.placeholderText]}>
                          {formatDateDisplay(value)}
                        </Text>
                      </TouchableOpacity>
                      {showDatePicker && (
                        <DateTimePicker
                          value={getDateObject(value)}
                          mode="date"
                          display="default"
                          onChange={(event, selectedDate) => {
                            setShowDatePicker(false);
                            if (selectedDate) {
                              onChange(formatDateValue(selectedDate));
                            }
                          }}
                        />
                      )}
                    </>
                  )}
                />
                <Image source={require('../../assets/allBookingsIcon.png')} style={styles.inputIcon} pointerEvents="none" />
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
                  render={({ field: { onChange, value } }) => (
                    <>
                      <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => setShowTimePicker(true)}
                        style={[styles.input, styles.inputTouchable, errors.time && styles.inputError]}
                      >
                        <Text style={[styles.inputText, !value && styles.placeholderText]}>
                          {formatTimeDisplay(value)}
                        </Text>
                      </TouchableOpacity>
                      {showTimePicker && (
                        <DateTimePicker
                          value={getTimeObject(value)}
                          mode="time"
                          is24Hour={false}
                          display="default"
                          onChange={(event, selectedDate) => {
                            setShowTimePicker(false);
                            if (selectedDate) {
                              onChange(formatTimeValue(selectedDate));
                            }
                          }}
                        />
                      )}
                    </>
                  )}
                />
                <Image source={require('../../assets/pendingIcon.png')} style={styles.inputIcon} pointerEvents="none" />
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

            <View style={styles.formGroup}>
              <Text style={styles.sectionLabel}>To Date <Text style={styles.required}>*</Text></Text>
              <View style={styles.inputWrapperWithIcon}>
                <Controller
                  control={control}
                  name="toDate"
                  render={({ field: { onChange, value } }) => (
                    <>
                      <TouchableOpacity
                        activeOpacity={0.7}
                        disabled={!isMultipleDay}
                        onPress={() => setShowToDatePicker(true)}
                        style={[
                          styles.input,
                          styles.inputTouchable,
                          !isMultipleDay && { backgroundColor: '#e2e8f0', opacity: 0.6 },
                          errors.toDate && styles.inputError
                        ]}
                      >
                        <Text style={[
                          styles.inputText,
                          !value && styles.placeholderText,
                          !isMultipleDay && { color: '#a0aec0' }
                        ]}>
                          {isMultipleDay ? formatDateDisplay(value) : 'Multiple Day Only'}
                        </Text>
                      </TouchableOpacity>
                      {isMultipleDay && showToDatePicker && (
                        <DateTimePicker
                          value={getDateObject(value)}
                          mode="date"
                          display="default"
                          onChange={(event, selectedDate) => {
                            setShowToDatePicker(false);
                            if (selectedDate) {
                              onChange(formatDateValue(selectedDate));
                            }
                          }}
                        />
                      )}
                    </>
                  )}
                />
                <Image source={require('../../assets/allBookingsIcon.png')} style={styles.inputIcon} pointerEvents="none" />
              </View>
              {errors.toDate && <Text style={styles.errorText}>{errors.toDate.message}</Text>}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.sectionLabel}>To Time <Text style={styles.required}>*</Text></Text>
              <View style={styles.inputWrapperWithIcon}>
                <Controller
                  control={control}
                  name="toTime"
                  render={({ field: { onChange, value } }) => (
                    <>
                      <TouchableOpacity
                        activeOpacity={0.7}
                        disabled={!isMultipleDay}
                        onPress={() => setShowToTimePicker(true)}
                        style={[
                          styles.input,
                          styles.inputTouchable,
                          !isMultipleDay && { backgroundColor: '#e2e8f0', opacity: 0.6 },
                          errors.toTime && styles.inputError
                        ]}
                      >
                        <Text style={[
                          styles.inputText,
                          !value && styles.placeholderText,
                          !isMultipleDay && { color: '#a0aec0' }
                        ]}>
                          {isMultipleDay ? formatTimeDisplay(value) : 'Multiple Day Only'}
                        </Text>
                      </TouchableOpacity>
                      {isMultipleDay && showToTimePicker && (
                        <DateTimePicker
                          value={getTimeObject(value)}
                          mode="time"
                          is24Hour={false}
                          display="default"
                          onChange={(event, selectedDate) => {
                            setShowToTimePicker(false);
                            if (selectedDate) {
                              onChange(formatTimeValue(selectedDate));
                            }
                          }}
                        />
                      )}
                    </>
                  )}
                />
                <Image source={require('../../assets/pendingIcon.png')} style={styles.inputIcon} pointerEvents="none" />
              </View>
              {errors.toTime && <Text style={styles.errorText}>{errors.toTime.message}</Text>}
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
                name="bookingNature"
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
              {errors.bookingNature && <Text style={styles.errorText}>{errors.bookingNature.message}</Text>}
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
                      onPress={() => onChange('Single Location')}
                      activeOpacity={0.7}
                    >
                      <View style={styles.radioOuter}>
                        {value === 'Single Location' && <View style={styles.radioInner} />}
                      </View>
                      <Text style={styles.radioLabel}>Single</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.radioWrapper}
                      onPress={() => onChange('Multiple Locations')}
                      activeOpacity={0.7}
                    >
                      <View style={styles.radioOuter}>
                        {value === 'Multiple Locations' && <View style={styles.radioInner} />}
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
                    <Picker
                      selectedValue={value}
                      onValueChange={onChange}
                      style={[
                        styles.picker,
                        errors.department && styles.inputError,
                      ]}
                    >
                      <Picker.Item label="Select Department" value="" enabled={false} />
                      <Picker.Item label='Human Resource' value='HR' />
                    </Picker>
                  )}
                />
              </View>
              {errors.department && <Text style={styles.errorText}>{errors.department.message}</Text>}
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
              onPress={handleSubmit(onSubmit, onError)}
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
  inputTouchable: {
    justifyContent: 'center',
  },
  inputText: {
    fontSize: 14,
    color: '#243b55',
  },
  placeholderText: {
    color: '#a0aec0',
  },
  inputError: {
    borderColor: '#EF4444',
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
    fontWeight: '500',
  },
  picker: {
    height: 50,
    width: '100%',
    color: '#0F172A',
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
    width: 16,
    height: 16,
    resizeMode: 'contain',
    tintColor: '#243b55',
  },

  /* ── Dropdowns ── */
  dropdownWrapper: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#fff',
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
