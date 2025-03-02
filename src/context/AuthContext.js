import { createContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Update user data
    const updateUser = (updatedData) => {
        setUser((prevUser) => ({
            ...prevUser,
            ...updatedData,
        }));
        localStorage.setItem("userData", JSON.stringify({ ...user, ...updatedData }));
    };

    // Load user from localStorage when app starts
    useEffect(() => {
        const storedUser = localStorage.getItem("userData");
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            // Set the token in axios headers
            axios.defaults.headers.common["Authorization"] = `Bearer ${parsedUser.token}`;
        }
        setLoading(false);
    }, []);

    // Fetch user data from the server using the token
    const fetchUser = async (token) => {
        try {
            const baseUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";
            const response = await axios.get(`${baseUrl}/api/auth/user`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data) {
                const completeUser = { ...response.data, token };
                setUser(completeUser);
                localStorage.setItem("userData", JSON.stringify(completeUser));
                // Set the token in axios headers
                axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            }
        } catch (error) {
            console.error("Error fetching user:", error);
            logout(); // Logout if the token is invalid
        } finally {
            setLoading(false);
        }
    };

    // Login function
    const login = async (email, password) => {
        try {
            const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/login`, { email, password });
            const { token, userData } = res.data;
            localStorage.setItem("token", token);
            const completeUser = { token, ...userData };
            localStorage.setItem("userData", JSON.stringify(completeUser));
            setUser(completeUser);
            // Set the token in axios headers
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            return true; // Indicate successful login
        } catch (err) {
            console.error("Login failed:", err.response?.data || err.message);
            return false; // Indicate failed login
        }
    };

    // Signup function
    const signup = async (name, email, password) => {
        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/signup`, { name, email, password });
            return true;
        } catch (err) {
            console.error("Signup failed", err.response?.data || err.message);
            return false;
        }
    };

    // Logout function
    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userData");
        setUser(null);
        // Remove the token from axios headers
        delete axios.defaults.headers.common["Authorization"];
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, loading, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;