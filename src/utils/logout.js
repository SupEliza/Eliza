import { userLogout } from "../services/users";

async function Logout(setModalLoading){
    try {
        setModalLoading(true);
        const uuid = localStorage.getItem("user_uuid");

        if (!uuid) {
            console.error("Usuário não encontrado.");
            return;
        }

        const response = await userLogout(uuid);

        if (response.success === false) {
            console.error("Logout failed:", response.message);
            return;
        }

        localStorage.removeItem('currentSection')
        localStorage.removeItem('user_uuid');
        window.location.reload();

        setTimeout(() => {
            setModalLoading(false);
        }, 500);
    } catch (error) {
        console.error("Error logging out:", error);
    }
};

export default Logout;