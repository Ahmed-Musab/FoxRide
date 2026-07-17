import api from "../api"

export const getApprovedBookings = async () => {
    try {
        const response = await api.get("/employee/getApprovedBookingsByEmail");
        return response.data.bookings;
    } catch (error) {
        throw error;
    }
}