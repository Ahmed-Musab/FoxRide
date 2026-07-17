import api from "../api"

export const getCompletedBookings = async () => {
    try {
        const response = await api.get("/employee/getCompletedBookingsByEmail");
        return response.data.bookings;
    } catch (error) {
        throw error;
    }
}