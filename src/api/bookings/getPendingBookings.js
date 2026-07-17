import api from "../api"

export const getPendingBookings = async () => {
    try {
        const response = await api.get("/employee/getPendingBookingsByEmail");
        return response.data.bookings;
    } catch (error) {
        throw error;
    }
}