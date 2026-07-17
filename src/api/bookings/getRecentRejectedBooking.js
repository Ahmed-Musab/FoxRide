import api from "../api"

export const getRecentRejectedBooking = async () => {
    try {
        const response = await api.get("/employee/getRecentRejectedBooking");
        return response.data.booking;
    } catch (error) {
        throw error;
    }
}