import api from "../api";

export const getBookings = async () => {
    try {
        const response = await api.get("/employee/getBookingByEmail");
        return response.data.bookings;
    } catch (error) {
        throw error;
    }
};