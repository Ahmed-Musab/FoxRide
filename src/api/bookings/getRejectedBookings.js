import api from "../api"

export const getRejectedBookings = async () => {
    try {
        const response = await api.get("/employee/getRejectedBookingsByEmail");
        return response.data.bookings;
    } catch (error) {
        throw error;
    }
}