
import React, { createContext, useContext, useEffect, useState } from "react";

type User = {
    id: number;
    name: string;
    email: string;
    role: string;
};

type UserContextType = {
    user: User | null;
    setUser: (user: User) => void;
    removeUser: () => void;
    menus: string[];
    setMenus: (menus: string[]) => void;
};

const UserContext = createContext<UserContextType>({
    user: null,
    setUser: () => {},
    removeUser: () => {},
    menus: [],
    setMenus: () => {},
});

export const useUserContext = () => useContext(UserContext);

const UserContextProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const getUser = () => {
        const savedUser = localStorage.getItem("wcm_user");
        let user: User | null = null;
        if (savedUser) {
            user = JSON.parse(savedUser);

        }
        return user;
    };

    const getMenus = () => {
        const savedMenus = localStorage.getItem("wcm_menus");
        let menus: string[] = [];
        if (savedMenus) {
            menus = JSON.parse(savedMenus);

        }
        return menus;
    };

    const [user, _setUser] = useState<User | null>(getUser());
    const [menus, _setMenus] = useState<string[]>(getMenus());

    const setUser = (user: User) => {
        _setUser(user);
        localStorage.setItem("wcm_user", JSON.stringify(user));
    };

    const setMenus = (menu: string[]) => {
        _setMenus(menu);
        localStorage.setItem("wcm_menus", JSON.stringify(menu));
    };

    const removeUser = () => {
        _setUser(null);
        _setMenus([]);
        localStorage.removeItem("wcm_user");
        localStorage.removeItem("wcm_menus");
    };

    useEffect(() => {
        let user = localStorage.getItem("wcm_user");
        let menus = localStorage.getItem("wcm_menus");
        if (user) {
            _setUser(JSON.parse(user));
        }
        if(menus) _setMenus(JSON.parse(menus))
    }, []);

    return (
        <UserContext.Provider
            value={{ user, setUser, removeUser, menus, setMenus }}
        >
            {children}
        </UserContext.Provider>
    );
};

export default UserContextProvider;
