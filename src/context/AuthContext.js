import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Update user data
    const updateUser = (updatedData) => {
        const updatedUser = { ...user, ...updatedData };
        setUser(updatedUser);
        localStorage.setItem("userData", JSON.stringify(updatedUser));
        if (updatedData.token) {
            axios.defaults.headers.common["Authorization"] = `Bearer ${updatedData.token}`;
        }
    };

    // Load user from localStorage when app starts
    useEffect(() => {
        const storedUser = localStorage.getItem("userData");
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
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
                axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            }
        } catch (error) {
            console.error("Error fetching user:", error);
            if (error.response?.status === 401) {
                // Token is invalid or expired
                logout();
                toast.error("Your session has expired. Please log in again.");
                window.location.href = "/login";
            }
        } finally {
            setLoading(false);
        }
    };

    // Login function
    const login = async (email, password) => {
        setLoading(true); // Reset loading state
        try {
            const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/login`, { email, password });
            const { token, userData } = res.data;
            console.log(userData, "userData")
            if (userData?.isBlocked) {
                toast.error("You are Blocked Please contact with admin")
                return false
            }
            const completeUser = { token, ...userData };
            localStorage.setItem("userData", JSON.stringify(completeUser));
            setUser(completeUser);
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            return true; // Indicate successful login
        } catch (err) {
            console.error("Login failed:", err.response?.data || err.message);
            return false; // Indicate failed login
        } finally {
            setLoading(false); // Ensure loading is reset
        }
    };

    // Signup function
    const signup = async (name, email, password) => {
        setLoading(true); // Reset loading state
        try {
            const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/signup`, { name, email, password });
            if (res.data.token) {
                const completeUser = { token: res.data.token, ...res.data.userData };
                localStorage.setItem("userData", JSON.stringify(completeUser));
                setUser(completeUser);
                axios.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;
            }
            return true;
        } catch (err) {
            console.error("Signup failed", err.response?.data || err.message);
            return false;
        } finally {
            setLoading(false); // Ensure loading is reset
        }
    };
    const signupdealer = async (name, email, password, user) => {
        setLoading(true); // Reset loading state
        try {
            const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/dealer/${user?.id}/add-subuser`, { name, email, password });
            if (res.data.token) {
                const completeUser = { token: res.data.token, ...res.data.userData };
                localStorage.setItem("userData", JSON.stringify(completeUser));
                setUser(completeUser);
                axios.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;
            }
            return true;
        } catch (err) {
            console.error("Signup failed", err.response?.data || err.message);
            return false;
        } finally {
            setLoading(false); // Ensure loading is reset
        }
    };
    // Logout function
    const logout = () => {
        localStorage.removeItem("userData");
        setUser(null);
        delete axios.defaults.headers.common["Authorization"];
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, loading, logout, updateUser, signupdealer }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;