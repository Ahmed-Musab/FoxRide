import api from "../api"

export const getRecentApprovedBooking = async () => {
    try {
        const response = await api.get("/employee/getRecentApprovedBooking");
        return response.data.booking;
    } catch (error) {
        throw error;
    }
}