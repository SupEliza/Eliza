import { createContext, useState, useEffect, useRef } from "react";
import { refreshToken, userAuth } from "../../services/users";
import { useNotify } from "../Notify/notifyContext";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const { addNotification } = useNotify();
    const refreshingRef = useRef(false);

    // 🔹 Sempre pega o token salvo
    function getToken() {
        return localStorage.getItem("token");
    }

    async function refreshAccessToken() {
        if (refreshingRef.current) return;

        refreshingRef.current = true;

        try {
            const uuid = localStorage.getItem("user_uuid");
            const token = getToken();

            if (!uuid || !token) {
                setUser(null);
                return;
            }

            const response = await refreshToken({ uuid, token });

            if (!response?.success || !response.token) {
                setUser(null);
                return;
            }

            // Se renovou, salva o novo token
            localStorage.setItem("token", response.token);

            // 🔹 Opcional: notificação só se quiser mostrar sucesso
            addNotification(response.message);

            await checkAuth();
        } catch (error) {
            setUser(null);
        } finally {
            refreshingRef.current = false;
        }
    }

    async function checkAuth() {
        try {
            const token = getToken();
            if (!token) {
                setUser(null);
                setLoading(false);
                return;
            }

            const response = await userAuth(token);

            if (response?.success && response.user) {
                setUser({ ...response.user });

                // 🔹 Opcional: só notificar em caso de login válido
                addNotification(response.message);
            } else {
                // Token inválido, desloga
                setUser(null);
            }
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
        // 🔹 Atualiza o token a cada 10 minutos
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