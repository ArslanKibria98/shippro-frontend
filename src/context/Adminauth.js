import { createContext, useState, useEffect } from "react";
import axios from "axios";

const Adminauth = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Update user data
    const updateUser = (updatedData) => {
        setUser((prevUser) => ({
            ...prevUser,
            ...updatedData,
        }));
        localStorage.setItem("adminData", JSON.stringify({ ...user, ...updatedData }));
    };

    // Load user from localStorage when app starts
    useEffect(() => {
        const storedUser = localStorage.getItem("adminData");
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            // Set the token in axios headers
            axios.defaults.headers.common["Authorization"] = `Bearer ${parsedUser.token}`;
        }
        setLoading(false);
    }, []);

    // Fetch admin data from the server using the token
    const fetchAdmin = async (token) => {
        try {
            const baseUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";
            const response = await axios.get(`${baseUrl}/api/admin/user`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data) {
                const completeAdmin = { ...response.data, token };
                setUser(completeAdmin);
                localStorage.setItem("adminData", JSON.stringify(completeAdmin));
                // Set the token in axios headers
                axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            }
        } catch (error) {
            console.error("Error fetching admin:", error);
            logout(); // Logout if the token is invalid
        } finally {
            setLoading(false);
        }
    };

    // Login function
    const login = async (email, password) => {
        try {
            const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/admin/login`, { email, password });
            const { token, userData } = res.data;
            localStorage.setItem("token", token);
            const completeAdmin = { token, ...userData };
            console.log(userData, "userData")
            localStorage.setItem("adminData", JSON.stringify(completeAdmin));
            setUser(completeAdmin);
            console.log(completeAdmin, "completeAdmin")
            // Set the token in axios headers
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            return true; // Indicate successful login
        } catch (err) {
            console.error("Login failed:", err.response?.data || err.message);
            return false; // Indicate failed login
        }
    };

    // Logout function
    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("adminData");
        setUser(null);
        // Remove the token from axios headers
        delete axios.defaults.headers.common["Authorization"];
    };

    return (
        <Adminauth.Provider value={{ user, login, loading, logout, updateUser }}>
            {children}
        </Adminauth.Provider>
    );
};

export default Adminauth;