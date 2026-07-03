import React, { useRef, useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image
} from 'react-native';
import SidebarLayout from '../../components/SidebarLayout';
import BackButton from '../../components/BackButton';
import { useFocusEffect } from '@react-navigation/native';
import ProfileModal from '../../components/ProfileModal';

// Column definitions with fixed widths for proper table layout
const COLUMNS = [
  { key: 'title', label: 'Title', width: 110 },
  { key: 'type', label: 'Type', width: 130 },
  { key: 'priority', label: 'Priority', width: 110 },
  { key: 'VRN', label: 'VRN', width: 80 },
  { key: 'assetNo', label: 'Asset No', width: 110 }
];

// Sample data rows — replace with real data from API/state
const TABLE_DATA = [
  {
    assetNo: 'MP31V1234',
    VRN: 'MH 04 AY 5987',
    title: 'Break down',
    type: 'Mechanical issue',
    priority: 'High'
  },
  {
    assetNo: 'MP31V5678',
    VRN: 'DL 03 BK 1122',
    title: 'Flat Tyre',
    type: 'Mechanical issue',
    priority: 'Low'
  },
  {
    assetNo: 'MP31V9101',
    VRN: 'UP 16 CZ 3344',
    title: 'Maintenance',
    type: 'General service',
    priority: 'Low'
  }
];

// Badge colours for status cells
const BADGE_STYLE = {
  Active: { bg: '#DCFCE7', text: '#15803D' },
  Inactive: { bg: '#FEE2E2', text: '#B91C1C' },
  Pending: { bg: '#FEF3C7', text: '#B45309' },
  'N/A': { bg: '#F1F5F9', text: '#64748B' },
};

function StatusBadge({ value }) {
  const colors = BADGE_STYLE[value] || { bg: '#F1F5F9', text: '#334155' };
  return (
    <View style={[styles.badge, { backgroundColor: colors.bg }]}>
      <Text style={[styles.badgeText, { color: colors.text }]}>{value}</Text>
    </View>
  );
}

export default function ComplaintsListScreen() {
  const [open, setOpen] = useState(false);
  const scrollViewRef = useRef(null);

  useFocusEffect(
    useCallback(() => {
      scrollViewRef.current?.scrollTo({ y: 0, animated: false });
    }, [])
  );

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

        {/* ── Table Card ── */}
        <View style={styles.card}>
          {/* Outer Vertical Scroll */}
          <ScrollView ref={scrollViewRef} showsVerticalScrollIndicator={false}>
            {/* Inner Horizontal Scroll */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View>
                {/* Table Head */}
                <View style={styles.tableHead}>
                  {COLUMNS.map((col) => (
                    <Text
                      key={col.key}
                      style={[styles.headCell, { width: col.width }]}
                      numberOfLines={1}
                    >
                      {col.label}
                    </Text>
                  ))}
                </View>

                {/* Table Body */}
                <View style={styles.tableBodyContainer}>
                  {TABLE_DATA.map((row, rowIdx) => (
                    <TouchableOpacity
                      key={rowIdx}
                      activeOpacity={0.75}
                      style={[
                        styles.tableRow,
                        rowIdx % 2 === 0 ? styles.rowEven : styles.rowOdd,
                      ]}
                    >
                      {COLUMNS.map((col) => (
                        <View
                          key={col.key}
                          style={[styles.bodyCell, { width: col.width }]}
                        >
                          {col.badge ? (
                            <StatusBadge value={row[col.key]} />
                          ) : (
                            <Text style={styles.bodyCellText} numberOfLines={1}>
                              {row[col.key]}
                            </Text>
                          )}
                        </View>
                      ))}
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </ScrollView>
          </ScrollView>
        </View>
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

  /* ── Card wrapper ── */
  card: {
    flex: 1,
    margin: 16,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    overflow: 'hidden',
    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },

  /* ── Table Head ── */
  tableHead: {
    flexDirection: 'row',
    backgroundColor: '#243b55',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  headCell: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.4,
    paddingHorizontal: 6,
  },

  /* ── Table Rows ── */
  tableBodyContainer: {
    paddingBottom: 12,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 11,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  rowEven: {
    backgroundColor: '#ffffff',
  },
  rowOdd: {
    backgroundColor: '#F8FAFC',
  },

  /* ── Body Cells ── */
  bodyCell: {
    paddingHorizontal: 6,
    justifyContent: 'center',
  },
  bodyCellText: {
    fontSize: 13,
    color: '#334155',
  },

  /* ── Status Badge ── */
  badge: {
    alignSelf: 'flex-start',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3,
  },

  /* ── Subtitle ── */
  headerSubtitle: {
    fontSize: 13,
    fontWeight: '500',
    color: '#94A3B8',
    letterSpacing: 0.3,
  }
});
