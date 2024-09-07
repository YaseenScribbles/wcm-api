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
};

const UserContext = createContext<UserContextType>({
    user: null,
    setUser: () => {},
    removeUser: () => {},
});

export const useUserContext = () => useContext(UserContext);

const UserContextProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {

    const getUser = () => {
        const savedUser = localStorage.getItem('wcm_user');
        let user: User| null = null;
        if (savedUser) {
            user = JSON.parse(savedUser);
        }
        return user;
    }

    const [user, _setUser] = useState<User | null>(getUser());

    const setUser = ( user : User ) => {
        _setUser(user);
        localStorage.setItem("wcm_user",JSON.stringify(user));
    };

    const removeUser = () => {
        _setUser(null)
        localStorage.removeItem("wcm_user")
    };

    useEffect(() => {
        let user = localStorage.getItem("wcm_user");
        if (user) {
            _setUser(JSON.parse(user))
        }
    },[])

    return (
        <UserContext.Provider value={{ user, setUser, removeUser }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserContextProvider;
