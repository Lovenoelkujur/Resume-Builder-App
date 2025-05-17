import React, {createContext, useState, useEffect} from "react";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

export const UserContext = createContext();

const UserProvider = ({children}) => {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);   // New state to track loading

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        const accessToken = localStorage.getItem("token");

        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }

        // const accessToken = localStorage.getItem("token");
        if(!accessToken){
            setLoading(false);
            return;
        }

         // Only fetch if no rehydrated user exists
    if (!storedUser) {
        const fetchUser = async () => {
            try {
                const response = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE);
                setUser(response.data);
                localStorage.setItem("user", JSON.stringify(response.data));
            } catch (error) {
                console.error("User not authenticated", error);
                clearUser();
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    } else {
        setLoading(false); // ✅ important so your UI can render
    }


    }, []);

    const updateUser = (userData) => {
        setUser(userData);
        localStorage.setItem("token", userData.token);  // Save token
        localStorage.setItem("user", JSON.stringify(userData)); // ✅ Store full user data
        setLoading(false);
    };

    const clearUser = () => {
        setUser(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user"); // ✅ Clear stored user
    };

    return (
        <UserContext.Provider value={{user, loading, updateUser, clearUser}}>
            {children}
        </UserContext.Provider>
    );
};

export default UserProvider;