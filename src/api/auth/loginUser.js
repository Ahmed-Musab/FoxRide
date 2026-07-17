import api from "../api";

export const loginUser = async (email, password, role) => {
    try {
        const response = await api.post("/auth/loginUser", { email, password, role });
        return response.data;
    } catch (error) {
        throw error;
    }
};