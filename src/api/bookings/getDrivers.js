import api from "../api";

export const getDrivers = async () => {
    try {
        const response = await api.get("/driver/getDrivers");
        return response.data.drivers;
    } catch (error) {
        throw error;
    }
};