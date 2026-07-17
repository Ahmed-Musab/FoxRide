import React, { useRef, useCallback, useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  Platform
} from 'react-native';
import SidebarLayout from '../../components/SidebarLayout';
import BackButton from '../../components/BackButton';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import ProfileModal from '../../components/ProfileModal';
import { createWorkOrderEmployee } from '../../api/bookings/createWorkOrderEmployee';
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { getVehicles } from '../../api/bookings/getVehicles';
import { useQuery } from '@tanstack/react-query';
import { AuthContext } from '../../context/authContext';

const locations = [
  "Lahore", "Karachi", "Islamabad", "Faisalabad", "Multan", "Raiwind", "Sialkot", "Gujranwala", "Bahawalpur", "Rahim Yar Khan"
];

const vendors = [
  "Toyota Motors", "Honda Service Center", "Honda Fort", "Suzuki Township", "Local Workshop", "Other Vendor"
];

const workOrderSchema = yup.object({
  vehicleId: yup.string().required("Vehicle is required"),
  vrn: yup.string().required("VRN is required"),
  vehicleType: yup.string().required("Type is required"),
  make: yup.string().required("Make is required"),
  lastMeterReading: yup.number().required("Last updated mileage is required"),
  currentMeterReading: yup.number()
    .required("Current mileage is required")
    .typeError("Current mileage must be a number")
    .min(yup.ref("lastMeterReading"), "Current mileage cannot be less than last updated mileage"),
  location: yup.string().required("Location is required"),
  vendor: yup.string().required("Vendor is required"),
  isOutsideVendor: yup.boolean().default(false),
  workType: yup.string().required("Work Type is required"),
  date: yup.string().required("Date is required"),
  invoiceAmount: yup.number()
    .required("Invoice amount is required")
    .typeError("Invoice amount must be a number")
    .min(0, "Invoice amount cannot be negative"),
  comments: yup.string().nullable(),
  documentUrl: yup.string().nullable()
});

export default function CreateWorkOrderScreen() {
  const [open, setOpen] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const { user } = useContext(AuthContext);

  const { control, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    resolver: yupResolver(workOrderSchema),
    defaultValues: {
      vehicleId: '',
      vrn: '',
      vehicleType: '',
      make: '',
      lastMeterReading: 0,
      currentMeterReading: '',
      location: '',
      vendor: '',
      isOutsideVendor: false,
      workType: '',
      date: new Date().toISOString().split("T")[0],
      invoiceAmount: '',
      comments: '',
      documentUrl: ''
    }
  });

  const watchDate = watch('date');

  const { data: vehicles, isLoading: vehiclesLoading, error: vehiclesError } = useQuery({
    queryKey: ['vehicles'],
    queryFn: getVehicles,
  });

  const navigation = useNavigation();
  const scrollViewRef = useRef(null);

  useFocusEffect(
    useCallback(() => {
      scrollViewRef.current?.scrollTo({ y: 0, animated: false });
    }, [])
  );

  const handleVehicleChange = (vId) => {
    setValue("vehicleId", vId);
    if (!vId) {
      setValue("vrn", "");
      setValue("vehicleType", "");
      setValue("make", "");
      setValue("lastMeterReading", 0);
      return;
    }
    const vehicle = vehicles?.find(v => v._id === vId);
    if (vehicle) {
      setValue("vrn", vehicle.VRN);
      setValue("vehicleType", vehicle.vehicleType);
      setValue("make", vehicle.make);
      setValue("lastMeterReading", vehicle.mileage || 0);
    }
  };

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

  const showDateChooser = () => {
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value: getDateObject(watchDate),
        onChange: (event, selectedDate) => {
          if (selectedDate) {
            setValue('date', formatDateValue(selectedDate), { shouldValidate: true });
          }
        },
        mode: 'date',
        display: 'default',
      });
    } else {
      setShowDatePicker(true);
    }
  };

  const onSubmit = async (data) => {
    try {
      await createWorkOrderEmployee(data);
      Alert.alert('Success', 'Work Order Logged Successfully!');
    } catch (error) {
      console.log('API Error:', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to create work order');
    }
  };

  const onError = (errors) => {
    console.log('Validation Errors:', errors);
    Alert.alert('Validation Error', 'Please fill out all required fields correctly.');
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

            {/* Vehicle Selection */}
            <View style={styles.formGroup}>
              <Text style={styles.sectionLabel}>Vehicle</Text>
              <View style={styles.dropdownWrapper}>
                <Controller
                  control={control}
                  name="vehicleId"
                  render={({ field: { onChange, value } }) => (
                    <Picker
                      selectedValue={value}
                      onValueChange={(val) => {
                        onChange(val);
                        handleVehicleChange(val);
                      }}
                      style={[
                        styles.picker,
                        errors.vehicleId && styles.inputError,
                      ]}
                    >
                      <Picker.Item label="Select Vehicle" value="" enabled={false} />
                      {vehiclesLoading ? (
                        <Picker.Item label="Loading..." value="" />
                      ) : vehiclesError ? (
                        <Picker.Item label="Error loading vehicles" value="" />
                      ) : (
                        vehicles?.map((vehicle) => (
                          <Picker.Item 
                            key={vehicle._id} 
                            label={`${vehicle.VRN} (${vehicle.make} - ${vehicle.model})`} 
                            value={vehicle._id} 
                          />
                        ))
                      )}
                    </Picker>
                  )}
                />
              </View>
              {errors.vehicleId && <Text style={styles.errorText}>{errors.vehicleId.message}</Text>}
            </View>

            {/* VRN (Read-only) */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>VRN</Text>
              <Controller
                control={control}
                name="vrn"
                render={({ field: { value } }) => (
                  <TextInput
                    value={value}
                    editable={false}
                    placeholder="Auto-populated from Vehicle"
                    placeholderTextColor="#94A3B8"
                    style={[styles.input, styles.inputDisabled]}
                  />
                )}
              />
            </View>

            {/* Vehicle Type (Read-only) */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Vehicle Type</Text>
              <Controller
                control={control}
                name="vehicleType"
                render={({ field: { value } }) => (
                  <TextInput
                    value={value}
                    editable={false}
                    placeholder="Auto-populated Type"
                    placeholderTextColor="#94A3B8"
                    style={[styles.input, styles.inputDisabled]}
                  />
                )}
              />
            </View>

            {/* Make (Read-only) */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Make</Text>
              <Controller
                control={control}
                name="make"
                render={({ field: { value } }) => (
                  <TextInput
                    value={value}
                    editable={false}
                    placeholder="Auto-populated Make"
                    placeholderTextColor="#94A3B8"
                    style={[styles.input, styles.inputDisabled]}
                  />
                )}
              />
            </View>

            {/* Last Meter Reading (Read-only) */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Meter Reading (Last Updated)</Text>
              <Controller
                control={control}
                name="lastMeterReading"
                render={({ field: { value } }) => (
                  <TextInput
                    value={String(value)}
                    editable={false}
                    placeholder="Last updated mileage"
                    placeholderTextColor="#94A3B8"
                    style={[styles.input, styles.inputDisabled]}
                  />
                )}
              />
            </View>

            {/* Current Meter Reading */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Meter Reading (Current)</Text>
              <Controller
                control={control}
                name="currentMeterReading"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    placeholder="Enter current reading"
                    placeholderTextColor="#94A3B8"
                    keyboardType="numeric"
                    onBlur={onBlur}
                    onChangeText={(val) => onChange(val ? Number(val) : '')}
                    value={value !== '' ? String(value) : ''}
                    style={[styles.input, errors.currentMeterReading && styles.inputError]}
                  />
                )}
              />
              {errors.currentMeterReading && <Text style={styles.errorText}>{errors.currentMeterReading.message}</Text>}
            </View>

            {/* Location Dropdown */}
            <View style={styles.formGroup}>
              <Text style={styles.sectionLabel}>Location</Text>
              <View style={styles.dropdownWrapper}>
                <Controller
                  control={control}
                  name="location"
                  render={({ field: { onChange, value } }) => (
                    <Picker
                      selectedValue={value}
                      onValueChange={onChange}
                      style={[
                        styles.picker,
                        errors.location && styles.inputError,
                      ]}
                    >
                      <Picker.Item label="Select Location" value="" enabled={false} />
                      {locations.map(loc => (
                        <Picker.Item key={loc} label={loc} value={loc} />
                      ))}
                    </Picker>
                  )}
                />
              </View>
              {errors.location && <Text style={styles.errorText}>{errors.location.message}</Text>}
            </View>

            {/* Vendor Dropdown */}
            <View style={styles.formGroup}>
              <Text style={styles.sectionLabel}>Vendor</Text>
              <View style={styles.dropdownWrapper}>
                <Controller
                  control={control}
                  name="vendor"
                  render={({ field: { onChange, value } }) => (
                    <Picker
                      selectedValue={value}
                      onValueChange={onChange}
                      style={[
                        styles.picker,
                        errors.vendor && styles.inputError,
                      ]}
                    >
                      <Picker.Item label="Select Vendor" value="" enabled={false} />
                      {vendors.map(vend => (
                        <Picker.Item key={vend} label={vend} value={vend} />
                      ))}
                    </Picker>
                  )}
                />
              </View>
              {errors.vendor && <Text style={styles.errorText}>{errors.vendor.message}</Text>}
            </View>

            {/* Outside Vendor Toggle */}
            <View style={styles.formGroup}>
              <Controller
                control={control}
                name="isOutsideVendor"
                render={({ field: { onChange, value } }) => (
                  <TouchableOpacity
                    style={styles.checkboxWrapper}
                    onPress={() => onChange(!value)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.checkboxOuter}>
                      {value && <View style={styles.checkboxInner} />}
                    </View>
                    <Text style={styles.checkboxLabel}>Outside Vendor</Text>
                  </TouchableOpacity>
                )}
              />
            </View>

            {/* Work Type */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Work Type</Text>
              <Controller
                control={control}
                name="workType"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    placeholder="e.g. Engine Oil, AC Service, Tyre Repair"
                    placeholderTextColor="#94A3B8"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    style={[styles.input, errors.workType && styles.inputError]}
                  />
                )}
              />
              {errors.workType && <Text style={styles.errorText}>{errors.workType.message}</Text>}
            </View>

            {/* Date */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Date</Text>
              <View style={styles.inputWrapperWithIcon}>
                <Controller
                  control={control}
                  name="date"
                  render={({ field: { value } }) => (
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={showDateChooser}
                      style={[styles.input, styles.inputTouchable, errors.date && styles.inputError]}
                    >
                      <Text style={[styles.inputText, !value && styles.placeholderText]}>
                        {formatDateDisplay(value)}
                      </Text>
                    </TouchableOpacity>
                  )}
                />
                <Image source={require('../../assets/allBookingsIcon.png')} style={styles.inputIcon} pointerEvents="none" />
              </View>
              {Platform.OS !== 'android' && showDatePicker && (
                <DateTimePicker
                  value={getDateObject(watchDate)}
                  mode="date"
                  display="default"
                  onChange={(event, selectedDate) => {
                    setShowDatePicker(false);
                    if (selectedDate) {
                      setValue('date', formatDateValue(selectedDate), { shouldValidate: true });
                    }
                  }}
                />
              )}
              {errors.date && <Text style={styles.errorText}>{errors.date.message}</Text>}
            </View>

            {/* Invoice Amount */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Invoice Amount</Text>
              <Controller
                control={control}
                name="invoiceAmount"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    placeholder="Enter amount"
                    placeholderTextColor="#94A3B8"
                    keyboardType="numeric"
                    onBlur={onBlur}
                    onChangeText={(val) => onChange(val ? Number(val) : '')}
                    value={value !== '' ? String(value) : ''}
                    style={[styles.input, errors.invoiceAmount && styles.inputError]}
                  />
                )}
              />
              {errors.invoiceAmount && <Text style={styles.errorText}>{errors.invoiceAmount.message}</Text>}
            </View>

            {/* Document URL (Optional field) */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Document URL (Optional)</Text>
              <Controller
                control={control}
                name="documentUrl"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    placeholder="Optional invoice document link"
                    placeholderTextColor="#94A3B8"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value || ''}
                    style={[styles.input, errors.documentUrl && styles.inputError]}
                  />
                )}
              />
              {errors.documentUrl && <Text style={styles.errorText}>{errors.documentUrl.message}</Text>}
            </View>

            {/* Comments (Optional description textarea) */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Comments</Text>
              <Controller
                control={control}
                name="comments"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    placeholder="Enter description or notes"
                    placeholderTextColor="#94A3B8"
                    multiline
                    numberOfLines={3}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value || ''}
                    style={[styles.input, styles.textArea, errors.comments && styles.inputError]}
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
              <Text style={styles.submitButtonText}>Log Work Order</Text>
            </TouchableOpacity>

          </View>

          <TouchableOpacity style={{ backgroundColor: '#243b55', width: '50%', marginLeft: '25%', justifyContent: 'center', padding: 12, borderRadius: 12, marginTop: 10, marginBottom: 20, alignItems: 'center' }}
            onPress={() => navigation.navigate('WorkOrderList')}
          >
            <Text style={{ textAlign: 'center', fontWeight: 'bold', color: '#fff', fontSize: 14 }}>View Work Orders</Text>
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
    zIndex: 10,
    elevation: 5,
  },
  dropdownWrapper: {
    height: 48,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  picker: {
    height: 48,
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
  inputDisabled: {
    backgroundColor: '#E2E8F0',
    color: '#64748B',
  },

  /* ── Checkbox Toggle ── */
  checkboxWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginVertical: 4,
  },
  checkboxOuter: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#243b55',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxInner: {
    width: 10,
    height: 10,
    backgroundColor: '#243b55',
  },
  checkboxLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
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
