import { createContext, useState } from "react";
import { loginUser } from "../api/auth/loginUser";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AuthContext = createContext();

export default function AuthContextProvider({ children }) {
    const [role, setRole] = useState(null);
    const [user, setUser] = useState(null);
    const [isMinimized, setIsMinimized] = useState(true);

    const login = async (email, password, role) => {
        try {
            const data = await loginUser(email, password, role);

            await AsyncStorage.setItem("token", data.token);
            await AsyncStorage.setItem("user", JSON.stringify(data.user));
            setUser(data.user);
            setRole(data.user.role)
        } catch (error) {
            throw error;
        }
    };

    const logout = async () => {
        try {
            await AsyncStorage.removeItem("token");
            await AsyncStorage.removeItem("user");
            setUser(null);
            setRole(null)
        } catch (error) {
            throw error;
        }
    };

    const values = {
        user,
        role,
        login,
        logout,
        isMinimized,
        setIsMinimized
    };

    return <AuthContext.Provider value={values} >
        {children}
    </AuthContext.Provider>
}