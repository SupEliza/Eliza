import { createContext, useState, useEffect } from "react";
import { refreshToken, userAuth } from "../../services/users";
import { useNotify } from "../Notify/notifyContext";

export const AuthContext = createContext();

let isRefreshing = false;

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // 🔹 Sempre pega o token salvo
    function getToken() {
        return localStorage.getItem("token");
    }

    async function refreshAccessToken() {
        if (isRefreshing) return;

        isRefreshing = true;

        try {
            const uuid = localStorage.getItem("user_uuid");
            const token = getToken();

            if (!uuid || !token) {
                setUser(null);
                return;
            }

            const response = await refreshToken({ uuid, token });

            if (!response || response.success === false) {
                setUser(null);
                return;
            }

            addNotification(response);

            if (response.token) {
                localStorage.setItem("token", response.token);
            }

            await checkAuth();
        } catch (error) {
            setUser(null);
        } finally {
            isRefreshing = false;
        }
    }

    async function checkAuth() {
        const { addNotification } = useNotify();

        try {
            const token = getToken();
            if (!token) {
                setUser(null);
                setLoading(false);
                return;
            }

            const response = await userAuth(token);

            if (!response || response.success !== true || !response.user) {
                await refreshAccessToken();
                return;
            }

            addNotification(response);

            setUser({
                ...response.user
            });
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
        }, 10 * 60 * 1000);

        return () => clearInterval(intervalId);
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser, loading }}>
            {children}
        </AuthContext.Provider>
    );
}