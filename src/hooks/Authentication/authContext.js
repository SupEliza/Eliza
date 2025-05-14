import { createContext, useState, useEffect } from "react";
import { refreshToken, userAuth } from "../../services/users";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    async function refreshAccessToken() {
        try {
            const uuid = localStorage.getItem("user_uuid");
            
            if (!uuid) {
                setUser(null);
                return;
            }

            const response = await refreshToken(uuid);

            if (response.success === false) {
                setUser(null);
                return;
            }

            await new Promise(resolve => setTimeout(resolve, 100));

            await checkAuth();
        } catch (error) {
            setUser(null);
        }
    }

    async function checkAuth() {
        try {
            const response = await userAuth();

            if(response.success === false) {
                await refreshAccessToken();
                return;
            }

            if(!response || response.success !== true || !response.user || !response.user.username || response.user.user_permissions[0] !== "Admin") {
                setUser(null);
                return;
            }

            setUser(prevUser => ({
                ...prevUser, 
                ...response.user
            }));

        } catch (error) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        checkAuth();
    }, []);

    useEffect(() => {
        const intervalId = setInterval(() => {
            refreshAccessToken();
        }, 15 * 60 * 1000);

        return () => clearInterval(intervalId);
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser, loading }}>
            {children}
        </AuthContext.Provider>
    );
}