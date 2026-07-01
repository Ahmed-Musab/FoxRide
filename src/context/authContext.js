import { createContext, useState } from "react";

export const AuthContext = createContext();

export default function AuthContextProvider({ children }) {
    const [role, setRole] = useState(null);
    const [isMinimized, setIsMinimized] = useState(true);

    const login = (role) => {
        setRole(role);
    };

    const logout = () => {
        setRole(null)
    };

    const values = {
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