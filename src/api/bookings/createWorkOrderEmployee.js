import api from "../api";

export const createWorkOrderEmployee = async (bookingData) => {
    try {
        const response = await api.post("/employee/createWorkOrder", bookingData);
        return response.data;
    } catch (error) {
        throw error;
    }
};