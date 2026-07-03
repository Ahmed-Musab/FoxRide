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

const complaintSchema = yup.object().shape({
  title: yup.string().required('Complaint title is required'),
  description: yup.string().required('Complaint description is required'),
  type: yup.string().required('Complaint type is required'),
  priority: yup.string().required('Complaint priority is required'),
  vrn: yup.string().required('VRN is required'),
  assetNo: yup.string().required('Asset number is required'),
  vehicleType: yup.string().required('Vehicle type is required'),
  assignedTo: yup.string().required('Assigned to is required'),
});

export default function AddComplaintScreen() {
  const [open, setOpen] = useState(false);
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(complaintSchema),
    defaultValues: {
      title: '',
      description: '',
      type: '',
      priority: '',
      vrn: '',
      assetNo: '',
      vehicleType: '',
      assignedTo: '',
    }
  });

  const navigation = useNavigation();
  const scrollViewRef = useRef(null);

  useFocusEffect(
    useCallback(() => {
      scrollViewRef.current?.scrollTo({ y: 0, animated: false });
    }, [])
  );

  const onSubmit = (data) => {
    alert('Complaint Submitted Successfully!');
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

        {/* ── Scrollable Form Card ── */}
        <ScrollView ref={scrollViewRef} contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.card}>
            {/* Title */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Complaint Title</Text>
              <Controller
                control={control}
                name="title"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    placeholder="Enter short title"
                    placeholderTextColor="#94A3B8"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    style={[styles.input, errors.title && styles.inputError]}
                  />
                )}
              />
              {errors.title && <Text style={styles.errorText}>{errors.title.message}</Text>}
            </View>

            {/* Description */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Complaint Description</Text>
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

            {/* Row for Type and Priority */}
            <View style={styles.row}>
              <View style={[styles.formGroup, styles.flexHalf]}>
                <Text style={styles.label}>Type</Text>
                <Controller
                  control={control}
                  name="type"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      placeholder="e.g. Mechanical"
                      placeholderTextColor="#94A3B8"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      style={[styles.input, errors.type && styles.inputError]}
                    />
                  )}
                />
                {errors.type && <Text style={styles.errorText}>{errors.type.message}</Text>}
              </View>

              <View style={[styles.formGroup, styles.flexHalf]}>
                <Text style={styles.label}>Priority</Text>
                <Controller
                  control={control}
                  name="priority"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      placeholder="High / Medium / Low"
                      placeholderTextColor="#94A3B8"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      style={[styles.input, errors.priority && styles.inputError]}
                    />
                  )}
                />
                {errors.priority && <Text style={styles.errorText}>{errors.priority.message}</Text>}
              </View>
            </View>

            {/* VRN */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>VRN</Text>
              <Controller
                control={control}
                name="vrn"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    placeholder="e.g. MH 04 AY 5987"
                    placeholderTextColor="#94A3B8"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    style={[styles.input, errors.vrn && styles.inputError]}
                  />
                )}
              />
              {errors.vrn && <Text style={styles.errorText}>{errors.vrn.message}</Text>}
            </View>

            {/* Asset No */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Asset No</Text>
              <Controller
                control={control}
                name="assetNo"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    placeholder="e.g. MP31V1234"
                    placeholderTextColor="#94A3B8"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    style={[styles.input, errors.assetNo && styles.inputError]}
                  />
                )}
              />
              {errors.assetNo && <Text style={styles.errorText}>{errors.assetNo.message}</Text>}
            </View>

            {/* Vehicle Type */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Vehicle Type</Text>
              <Controller
                control={control}
                name="vehicleType"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    placeholder="e.g. Truck, Van, Sedan"
                    placeholderTextColor="#94A3B8"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    style={[styles.input, errors.vehicleType && styles.inputError]}
                  />
                )}
              />
              {errors.vehicleType && <Text style={styles.errorText}>{errors.vehicleType.message}</Text>}
            </View>

            {/* Assigned To */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Assigned To</Text>
              <Controller
                control={control}
                name="assignedTo"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    placeholder="e.g. Ahmed, Zaid"
                    placeholderTextColor="#94A3B8"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    style={[styles.input, errors.assignedTo && styles.inputError]}
                  />
                )}
              />
              {errors.assignedTo && <Text style={styles.errorText}>{errors.assignedTo.message}</Text>}
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleSubmit(onSubmit)}
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
