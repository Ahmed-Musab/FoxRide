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
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import ProfileModal from '../../components/ProfileModal';
import { addComplaint } from '../../api/bookings/addComplaint';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { getBookings } from '../../api/bookings/getBookings';
import { useQuery } from '@tanstack/react-query';
import { getDrivers } from '../../api/bookings/getDrivers';

const complaintSchema = yup.object().shape({
  complaintType: yup.string().required("Select Complaint Type"),
  description: yup.string().required("Description is required"),
  priority: yup.string().required("Select Priority"),
  complaintDate: yup.string().required("Complaint date is required"),
  complaintAgainst: yup.string().required("Complaint against is required"),
  booking: yup.string().required("Select Booking")
});

export default function AddComplaintScreen() {
  const [open, setOpen] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(complaintSchema),
    defaultValues: {
      complaintType: '',
      description: '',
      priority: '',
      complaintDate: '',
      complaintAgainst: '',
      booking: '',
    }
  });

  const { data: bookings, isLoading: bookingsLoading, error: bookingsError } = useQuery({
    queryKey: ['bookings'],
    queryFn: getBookings,
  });

  const { data: drivers, isLoading: driversLoading, error: driversError } = useQuery({
    queryKey: ['drivers'],
    queryFn: getDrivers,
  });

  const navigation = useNavigation();
  const scrollViewRef = useRef(null);

  useFocusEffect(
    useCallback(() => {
      scrollViewRef.current?.scrollTo({ y: 0, animated: false });
    }, [])
  );

  const formatDateDisplay = (dateStr) => {
    if (!dateStr || typeof dateStr !== 'string') return 'Select Date';
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    const [year, month, day] = parts;
    return `${day}/${month}/${year}`;
  };

  const getDateObject = (dateStr) => {
    if (!dateStr || typeof dateStr !== 'string') return new Date();
    const parts = dateStr.split('-');
    if (parts.length !== 3) return new Date();
    const [year, month, day] = parts.map(Number);
    if (isNaN(year) || isNaN(month) || isNaN(day)) return new Date();
    return new Date(year, month - 1, day);
  };

  const formatDateValue = (dateObj) => {
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const onSubmit = async (data) => {
    try {
      await addComplaint(data);
      alert('Complaint Submitted Successfully!');
    } catch (error) {
      console.log('API Error:', error);
      alert(error.response?.data?.message || 'Failed to submit complaint');
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

        {/* ── Scrollable Form Card ── */}
        <ScrollView ref={scrollViewRef} contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.card}>

            {/* Complaint Type */}
            <View style={styles.formGroup}>
              <Text style={styles.sectionLabel}>Complaint Type</Text>
              <View style={styles.dropdownWrapper}>
                <Controller
                  control={control}
                  name="complaintType"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Picker
                      selectedValue={value}
                      onValueChange={onChange}
                      style={[
                        styles.picker,
                        errors.complaintType && styles.inputError,
                      ]}
                    >
                      <Picker.Item label="Select Complaint Type" value="" enabled={false} />
                      <Picker.Item label='Car Problem' value='Car Problem' />
                      <Picker.Item label='Driver Problem' value='Driver Problem' />
                      <Picker.Item label='Other' value='Other' />
                    </Picker>
                  )}
                />
              </View>
              {errors.complaintType && <Text style={styles.errorText}>{errors.complaintType.message}</Text>}
            </View>

            {/* Description */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Description</Text>
              <Controller
                control={control}
                name="description"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    placeholder="Provide details about the issue..."
                    placeholderTextColor="#94A3B8"
                    multiline
                    numberOfLines={4}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    style={[styles.input, styles.textArea, errors.description && styles.inputError]}
                  />
                )}
              />
              {errors.description && <Text style={styles.errorText}>{errors.description.message}</Text>}
            </View>

            {/* Row for Priority and Complaint Against */}
            <View style={styles.row}>
              <View style={[styles.formGroup, styles.flexHalf]}>
                <Text style={styles.sectionLabel}>Priority</Text>
                <View style={styles.dropdownWrapper}>
                  <Controller
                    control={control}
                    name="priority"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <Picker
                        selectedValue={value}
                        onValueChange={onChange}
                        style={[
                          styles.picker,
                          errors.priority && styles.inputError,
                        ]}
                      >
                        <Picker.Item label="Select Priority" value="" enabled={false} />
                        <Picker.Item label='High' value='High' />
                        <Picker.Item label='Medium' value='Medium' />
                        <Picker.Item label='Low' value='Low' />
                      </Picker>
                    )}
                  />
                </View>
                {errors.priority && <Text style={styles.errorText}>{errors.priority.message}</Text>}
              </View>

              <View style={[styles.formGroup, styles.flexHalf]}>
                <Text style={styles.label}>Complaint Against</Text>
                <View style={styles.dropdownWrapper}>
                  <Controller
                    control={control}
                    name="complaintAgainst"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <Picker
                        selectedValue={value}
                        onValueChange={onChange}
                        style={[
                          styles.picker,
                          errors.complaintAgainst && styles.inputError,
                        ]}
                      >
                        <Picker.Item label="Select Complaint Against" value="" enabled={false} />
                        {
                          driversLoading ? (
                            <Picker.Item label="Loading..." value="" />
                          ) :
                            driversError ? (
                              <Picker.Item label="Error" value="" />
                            ) :
                              drivers?.map((driver) => (
                                <Picker.Item key={driver._id} label={driver.email} value={driver.email} />
                              ))
                        }
                      </Picker>
                    )}
                  />
                </View>
                {errors.complaintAgainst && <Text style={styles.errorText}>{errors.complaintAgainst.message}</Text>}
              </View>
            </View>

            {/* Complaint Date */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Complaint Date</Text>
              <View style={styles.inputWrapperWithIcon}>
                <Controller
                  control={control}
                  name="complaintDate"
                  render={({ field: { onChange, value } }) => (
                    <>
                      <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => setShowDatePicker(true)}
                        style={[styles.input, styles.inputTouchable, errors.complaintDate && styles.inputError]}
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
              {errors.complaintDate && <Text style={styles.errorText}>{errors.complaintDate.message}</Text>}
            </View>

            {/* Booking */}
            <View style={styles.formGroup}>
              <Text style={styles.sectionLabel}>Booking</Text>
              <View style={styles.dropdownWrapper}>
                <Controller
                  control={control}
                  name="booking"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Picker
                      selectedValue={value}
                      onValueChange={onChange}
                      style={[
                        styles.picker,
                        errors.booking && styles.inputError,
                      ]}
                    >
                      <Picker.Item label="Select Booking" value="" enabled={false} />
                      {
                        bookings?.map((booking) => (
                          <Picker.Item
                            key={booking._id}
                            label={`${booking.purpose} - ${booking.date ? new Date(booking.date).toLocaleDateString() : ""} (${booking.status})`}
                            value={booking.purpose}
                          />
                        ))
                      }
                    </Picker>
                  )}
                />
              </View>
              {errors.booking && <Text style={styles.errorText}>{errors.booking.message}</Text>}
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleSubmit(onSubmit, onError)}
              style={styles.submitButton}
            >
              <Text style={styles.submitButtonText}>Submit Complaint</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={{ backgroundColor: '#243b55', width: '50%', marginLeft: '25%', justifyContent: 'center', padding: 12, borderRadius: 12, marginTop: 10, marginBottom: 20, alignItems: 'center' }}
            onPress={() => navigation.navigate('ComplaintsList')}
          >
            <Text style={{ textAlign: 'center', fontWeight: 'bold', color: '#fff', fontSize: 14 }}>View Complaints</Text>
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
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  flexHalf: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
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
  inputTouchable: {
    justifyContent: 'center',
  },
  inputText: {
    fontSize: 14,
    color: '#0F172A',
  },
  placeholderText: {
    color: '#94A3B8',
  },
  inputIcon: {
    position: 'absolute',
    right: 14,
    width: 16,
    height: 16,
    resizeMode: 'contain',
    tintColor: '#243b55',
  },
  inputWrapperWithIcon: {
    position: 'relative',
    justifyContent: 'center',
  },
  dropdownWrapper: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  picker: {
    height: 50,
    width: '100%',
    color: '#0F172A',
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
  },
  textArea: {
    height: 100,
    paddingVertical: 12,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: '#EF4444',
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
    fontWeight: '500',
  },

  /* ── Submit Button ── */
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
