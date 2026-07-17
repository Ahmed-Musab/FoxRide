import React, { useRef, useCallback, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import SidebarLayout from '../../components/SidebarLayout';
import BackButton from '../../components/BackButton';
import { useFocusEffect } from '@react-navigation/native';
import ProfileModal from '../../components/ProfileModal';
import { useQuery } from '@tanstack/react-query';
import { getBookings } from '../../api/bookings/getBookings';
import { getPendingBookings } from '../../api/bookings/getPendingBookings';
import { getApprovedBookings } from '../../api/bookings/getApprovedBookings';
import { getCompletedBookings } from '../../api/bookings/getCompletedBookings';
import { getRejectedBookings } from '../../api/bookings/getRejectedBookings';
import { getRecentPendingBooking } from '../../api/bookings/getRecentPendingBooking';
import { getRecentApprovedBooking } from '../../api/bookings/getRecentApprovedBooking';
import { getRecentRejectedBooking } from '../../api/bookings/getRecentRejectedBooking';

export default function EmployeeDashboardScreen() {

    const [open, setOpen] = useState(false);
    const scrollViewRef = useRef(null);

    const { data: bookings, isLoading: bookingsLoading, error: bookingsError } = useQuery({
        queryKey: ["bookings"],
        queryFn: getBookings,
    })

    const { data: pendingBookings, isLoading: pendingBookingsLoading, error: pendingBookingsError } = useQuery({
        queryKey: ["pendingBookings"],
        queryFn: getPendingBookings,
    })

    const { data: approvedBookings, isLoading: approvedBookingsLoading, error: approvedBookingsError } = useQuery({
        queryKey: ["approvedBookings"],
        queryFn: getApprovedBookings,
    })

    const { data: completedBookings, isLoading: completedBookingsLoading, error: completedBookingsError } = useQuery({
        queryKey: ["completedBookings"],
        queryFn: getCompletedBookings,
    })

    const { data: rejectedBookings, isLoading: rejectedBookingsLoading, error: rejectedBookingsError } = useQuery({
        queryKey: ["rejectedBookings"],
        queryFn: getRejectedBookings,
    })

    const { data: recentPendingBooking, isLoading: recentPendingBookingLoading, error: recentPendingBookingError } = useQuery({
        queryKey: ["recentPendingBooking"],
        queryFn: getRecentPendingBooking,
    })

    const { data: recentApprovedBooking, isLoading: recentApprovedBookingLoading, error: recentApprovedBookingError } = useQuery({
        queryKey: ["recentApprovedBooking"],
        queryFn: getRecentApprovedBooking,
    })

    const { data: recentRejectedBooking, isLoading: recentRejectedBookingLoading, error: recentRejectedBookingError } = useQuery({
        queryKey: ["recentRejectedBooking"],
        queryFn: getRecentRejectedBooking,
    })

    useFocusEffect(
        useCallback(() => {
            scrollViewRef.current?.scrollTo({ y: 0, animated: false });
        }, [])
    );

    return (
        <SidebarLayout>
            <View style={{ flex: 1 }}>
                <ScrollView ref={scrollViewRef} style={styles.container} contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
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

                    {/* Content Area */}
                    <View style={styles.content}>

                        {/* Statistics Section Title */}
                        <Text style={styles.sectionTitle}>Your Booking Statistics</Text>

                        {/* Stats Grid */}
                        <View style={styles.statsGrid}>
                            {/* All Bookings */}
                            <View style={styles.statsCard}>
                                <View style={styles.cardHeader}>
                                    <View style={styles.iconContainer}>
                                        <Image source={require('../../assets/allBookingsIcon.png')} style={{ height: 35, width: 35 }} />
                                    </View>
                                    {bookingsLoading ? <ActivityIndicator size="small" color="#0000ff" /> : bookingsError ? <Text style={[styles.cardValue, { color: 'white' }]}>Error</Text> : <Text style={styles.cardValue}>{bookings?.length || 0}</Text>}
                                </View>
                                <View>
                                    <Text style={styles.cardLabel}>All Bookings</Text>
                                    <View style={{ width: '90%', height: 0.2, backgroundColor: '#3d4859ff', alignSelf: 'center' }} />
                                    <Text style={styles.cardDesc}>Total requested rides</Text>
                                </View>
                            </View>

                            {/* Pending Booking */}
                            <View style={styles.statsCard}>
                                <View style={styles.cardHeader}>
                                    <View style={styles.iconContainer}>
                                        <Image source={require('../../assets/pendingIcon.png')} style={{ height: 35, width: 35 }} />
                                    </View>
                                    {pendingBookingsLoading ? <ActivityIndicator size="small" color="#0000ff" /> : pendingBookingsError ? <Text style={[styles.cardValue, { color: 'white' }]}>Error</Text> : <Text style={styles.cardValue}>{pendingBookings?.length || 0}</Text>}
                                </View>
                                <View>
                                    <Text style={styles.cardLabel}>Pending</Text>
                                    <View style={{ width: '90%', height: 0.2, backgroundColor: '#3d4859ff', alignSelf: 'center' }} />
                                    <Text style={styles.cardDesc}>Awaiting approval</Text>
                                </View>
                            </View>

                            {/* Approved Bookings */}
                            <View style={styles.statsCard}>
                                <View style={styles.cardHeader}>
                                    <View style={styles.iconContainer}>
                                        <Image source={require('../../assets/approvedIcon.png')} style={{ height: 35, width: 35 }} />
                                    </View>
                                    {approvedBookingsLoading ? <ActivityIndicator size="small" color="#0000ff" /> : approvedBookingsError ? <Text style={[styles.cardValue, { color: 'white' }]}>Error</Text> : <Text style={styles.cardValue}>{approvedBookings?.length || 0}</Text>}
                                </View>
                                <View>
                                    <Text style={styles.cardLabel}>Approved</Text>
                                    <View style={{ width: '90%', height: 0.2, backgroundColor: '#3d4859ff', alignSelf: 'center' }} />
                                    <Text style={styles.cardDesc}>Scheduled journeys</Text>
                                </View>
                            </View>

                            {/* Completed Bookings */}
                            <View style={styles.statsCard}>
                                <View style={styles.cardHeader}>
                                    <View style={styles.iconContainer}>
                                        <Image source={require('../../assets/completedIcon.png')} style={{ height: 35, width: 35 }} />
                                    </View>
                                    {completedBookingsLoading ? <ActivityIndicator size="small" color="#0000ff" /> : completedBookingsError ? <Text style={[styles.cardValue, { color: 'white' }]}>Error</Text> : <Text style={styles.cardValue}>{completedBookings?.length || 0}</Text>}
                                </View>
                                <View>
                                    <Text style={styles.cardLabel}>Completed</Text>
                                    <View style={{ width: '90%', height: 0.2, backgroundColor: '#3d4859ff', alignSelf: 'center' }} />
                                    <Text style={styles.cardDesc}>Past successful rides</Text>
                                </View>
                            </View>

                            {/* Rejected Bookings */}
                            <View style={styles.statsCard}>
                                <View style={styles.cardHeader}>
                                    <View style={styles.iconContainer}>
                                        <Image source={require('../../assets/rejectedIcon.png')} style={{ height: 35, width: 35 }} />
                                    </View>
                                    {rejectedBookingsLoading ? <ActivityIndicator size="small" color="#0000ff" /> : rejectedBookingsError ? <Text style={[styles.cardValue, { color: 'white' }]}>Error</Text> : <Text style={styles.cardValue}>{rejectedBookings?.length || 0}</Text>}
                                </View>
                                <View>
                                    <Text style={styles.cardLabel}>Rejected</Text>
                                    <View style={{ width: '90%', height: 0.2, backgroundColor: '#3d4859ff', alignSelf: 'center' }} />
                                    <Text style={styles.cardDesc}>Declined booking requests</Text>
                                </View>
                            </View>
                        </View>

                        {/* Recent Activity Section */}
                        <View style={styles.activityContainer}>
                            <Text style={styles.sectionTitle}>Recent Booking Activity</Text>
                            <View style={styles.activityCard}>
                                {recentPendingBookingLoading ? <ActivityIndicator size="small" color="#0000ff" /> : recentPendingBookingError ? <Text style={[styles.cardValue, { color: 'white' }]}>Error</Text> : recentPendingBooking?.map((item) => (
                                    <View key={item._id} style={styles.activityItem}>
                                        <View style={styles.activityLeft}>
                                            <View style={[styles.statusIndicator, { backgroundColor: '#F59E0B' }]} />
                                            <View>
                                                <Text style={styles.activityTitle}>Booking ID: {item._id ? item._id.slice(-6).toUpperCase() : 'N/A'}</Text>
                                                <Text style={styles.activityDate}>Requested for {item.date ? new Date(item.date).toLocaleDateString() : ''} at {item.time}</Text>
                                                <View style={[styles.statusBadge, { backgroundColor: '#FEF3C7', borderRadius: 5 }]}>
                                                    <Text style={[styles.statusBadgeText, { color: '#B45309' }]}>{item.status}</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                )
                                )}
                                {recentApprovedBookingLoading ? <ActivityIndicator size="small" color="#0000ff" /> : recentApprovedBookingError ? <Text style={[styles.cardValue, { color: 'white' }]}>Error</Text> : recentApprovedBooking?.map((item) => (
                                    <View key={item._id} style={styles.activityItem}>
                                        <View style={styles.activityLeft}>
                                            <View style={[styles.statusIndicator, { backgroundColor: '#10B981' }]} />
                                            <View>
                                                <Text style={styles.activityTitle}>Booking ID: {item._id ? item._id.slice(-6).toUpperCase() : 'N/A'}</Text>
                                                <Text style={styles.activityDate}>Approved for {item.date ? new Date(item.date).toLocaleDateString() : ''} at {item.time}</Text>
                                                <View style={[styles.statusBadge, { backgroundColor: '#D1FAE5', borderRadius: 5 }]}>
                                                    <Text style={[styles.statusBadgeText, { color: '#047857' }]}>{item.status}</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                )
                                )}
                                {recentRejectedBookingLoading ? <ActivityIndicator size="small" color="#0000ff" /> : recentRejectedBookingError ? <Text style={[styles.cardValue, { color: 'white' }]}>Error</Text> : recentRejectedBooking?.map((item) => (
                                    <View key={item._id} style={styles.activityItem}>
                                        <View style={styles.activityLeft}>
                                            <View style={[styles.statusIndicator, { backgroundColor: '#EF4444' }]} />
                                            <View>
                                                <Text style={styles.activityTitle}>Booking ID: {item._id ? item._id.slice(-6).toUpperCase() : 'N/A'}</Text>
                                                <Text style={styles.activityDate}>Rejected for {item.date ? new Date(item.date).toLocaleDateString() : ''} at {item.time}</Text>
                                                <View style={[styles.statusBadge, { backgroundColor: '#FEE2E2', borderRadius: 5 }]}>
                                                    <Text style={[styles.statusBadgeText, { color: '#B91C1C' }]}>{item.status}</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                )
                                )}
                                <View style={{ width: '90%', height: 0.5, backgroundColor: '#3d4859ff', alignSelf: 'center' }} />
                            </View>
                        </View>
                    </View>
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
    scrollContainer: {
        paddingBottom: 40,
    },
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
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: 'white',
    },
    subtitle: {
        fontSize: 14,
        color: '#94A3B8',
        marginTop: 4,
    },
    content: {
        paddingHorizontal: 24,
        paddingTop: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#0f172a', // Higher contrast dark slate text color
        marginBottom: 14,
        letterSpacing: 0.3,
        textShadowColor: 'rgba(255, 255, 255, 0.8)', // Subtle white text outline for readability
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 3,
    },
    quickActionsContainer: {
        marginBottom: 26,
    },
    actionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    actionButton: {
        flex: 1,
        minWidth: 140,
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.02,
        shadowRadius: 6,
        elevation: 2,
    },
    actionIconBg: {
        width: 44,
        height: 44,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    actionIcon: {
        fontSize: 20,
    },
    actionLabel: {
        fontSize: 13,
        fontWeight: '700',
        color: '#1E293B',
        textAlign: 'center',
    },
    actionSubtext: {
        fontSize: 10,
        color: '#64748B',
        marginTop: 2,
        textAlign: 'center',
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 14,
        marginBottom: 28,
    },
    statsCard: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 16,
        minWidth: '47.5%',
        minHeight: 110,
        justifyContent: 'space-between',
        elevation: 15,
    },
    cardHeader: {
        alignItems: 'center',
    },
    iconContainer: {
        width: 38,
        height: 38,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardIcon: {
        fontSize: 18,
    },
    cardLabel: {
        fontSize: 16,
        fontWeight: '700',
        color: '#243b55',
        marginTop: 2,
        textAlign: 'center',
    },
    cardDesc: {
        fontSize: 10,
        color: '#0C7990',
        marginTop: 2,
        textAlign: 'center',
    },
    cardValue: {
        fontSize: 28,
        fontWeight: '800',
        color: '#0C7990',
    },
    activityContainer: {
        marginBottom: 24,

    },
    activityCard: {
        backgroundColor: '#E0F8F8',
        borderRadius: 16,
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.02,
        shadowRadius: 6,
        elevation: 2,
    },
    activityItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        flexWrap: "wrap",
    },
    activityLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12
    },
    statusIndicator: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    activityTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1E293B',
    },
    activityDate: {
        fontSize: 13,
        color: '#64748B',
        marginTop: 4,
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        width: 80,
        marginTop: 4
    },
    statusBadgeText: {
        fontSize: 10,
        fontWeight: '700',
        textAlign: 'center'
    },
    divider: {
        height: 1,
        backgroundColor: '#F1F5F9',
    }
});