import api from "../api";

export const createBooking = async (bookingData) => {
    try {
        const response = await api.post("/employee/createBooking", { ...bookingData, status: 'Pending'});
        return response.data;
    } catch (error) {
        throw error;
    }
};