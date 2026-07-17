import api from "../api";

export const addComplaint = async (bookingData) => {
    try {
        const response = await api.post("/employee/addComplaint", bookingData);
        return response.data;
    } catch (error) {
        throw error;
    }
};