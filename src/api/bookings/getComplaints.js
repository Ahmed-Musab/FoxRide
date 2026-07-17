import api from "../api";

export const getComplaints = async () => {
    try {
        const response = await api.get("/employee/getComplaintsByEmail");
        return response.data.complaints;
    } catch (error) {
        throw error;
    }
};