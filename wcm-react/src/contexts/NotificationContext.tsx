import React, { createContext, useContext, useEffect, useState } from "react";

type Notification = {
    id? : number;
    message: string;
    type: "success" | "failure";
};

type NotificationContextType = {
    notifications: Notification[];
    addNotification: (notification: Notification) => void;
};

const NotificationContext = createContext<NotificationContextType>({
    notifications: [],
    addNotification: () => {},
});

export const useNotification = () => useContext(NotificationContext);

export const NotificationContextProvider: React.FC<{
    children: React.ReactNode;
}> = ({ children }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const addNotification = (notification: Notification) => {
        notification.id = notifications.length + 1;
        setNotifications((prev) => [...prev, notification ]);
    };

    useEffect(() => {
        if (notifications.length > 0) {
            const timeoutId = setTimeout(() => {
                setNotifications((prevNotifications) => prevNotifications.slice(1));
            }, 3000);

            return () => clearTimeout(timeoutId); // Cleanup timeout when component unmounts or notifications change
        }
    },[notifications])

    return (
        <NotificationContext.Provider
            value={{ notifications, addNotification }}
        >
            {children}
        </NotificationContext.Provider>
    );
};
