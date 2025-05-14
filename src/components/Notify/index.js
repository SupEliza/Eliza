import { useEffect } from "react";
import styled from "styled-components";
import NotificationItem from "./NotifyItem/index";

const NotifyContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    position: fixed;
    top: 10vh;
    right: 10px;
    max-width: 20rem;
    overflow: hidden;
    z-index: 100;
`;

function Notify({ notifications, setNotifications }) {
    useEffect(() => {
        if (notifications.length > 3) {
            setNotifications(notifications.slice(notifications.length - 5));
        }
    }, [notifications, setNotifications]);

    const handleRemove = (id) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    };

    return (
        <NotifyContainer>
            {notifications.map((notification) => (
                <NotificationItem 
                    key={notification.id} 
                    id={notification.id} 
                    text={notification.text} 
                    onRemove={handleRemove} 
                />
            ))}
        </NotifyContainer>
    );
}

export default Notify;