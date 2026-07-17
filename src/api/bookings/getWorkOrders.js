import api from "../api";

export const getWorkOrders = async () => {
    try {
        const response = await api.get("/employee/getWorkOrders");
        return response.data.workOrders;
    } catch (error) {
        throw error;
    }
};