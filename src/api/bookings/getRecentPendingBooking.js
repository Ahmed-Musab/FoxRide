import api from "../api"

export const getRecentPendingBooking = async () => {
    try {
        const response = await api.get("/employee/getRecentPendingBooking");
        return response.data.booking;
    } catch (error) {
        throw error;
    }
}