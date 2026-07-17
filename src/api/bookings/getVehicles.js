import api from "../api";

export const getVehicles = async () => {
    try {
        const response = await api.get("/admin/getVehicles");
        return response.data.vehicles;
    } catch (error) {
        throw error;
    }
};