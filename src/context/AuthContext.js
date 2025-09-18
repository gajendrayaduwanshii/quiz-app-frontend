import { useState, useEffect, createContext, useContext } from "react";
import { useRouter } from "next/navigation";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const router = useRouter();
    const [registrationCompleted, setRegistrationCompleted] = useState(false);

    useEffect(() => {
        if (typeof window !== "undefined") { 
            const storedUser = JSON.parse(localStorage.getItem("user"));
            if (storedUser) {
                setUser(storedUser);
            }
        }
    }, []);

    const login = (userData) => {
        localStorage.setItem("user", JSON.stringify(userData)); 
        setUser(userData);
        router.push("/dashboard");
    };

    const logout = () => {
        localStorage.removeItem("user");
        setUser(null);
        router.replace("/"); 
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, setRegistrationCompleted, registrationCompleted }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
