import { createContext, useState, useEffect } from "react";
import axios from "axios";


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const updateUser = (updatedData) => {
        setUser((prevUser) => ({
            ...prevUser,
            ...updatedData,
        }));
    };

       
    // Load user from localStorage when app starts
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            setUser({ token });
        }
    }, []);
    useEffect(() => {
        // Check if a token exists in localStorage on page load
        const token = localStorage.getItem("token");
        if (token) {
          fetchUser(token);
        } else {
          setLoading(false);
        }
      }, []);
      const fetchUser = async (token) => {
        try {
          const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/user`, {
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json"
            },
          });
    
          if (response.ok) {
            const userData = await response.json();
            setUser({ ...userData, token });
          } else {
            logout();
          }
        } catch (error) {
          console.error("Error fetching user:", error);
          logout();
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
            setUser({ token, ...userData });
            console.log(userData)
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
            console.error("Signup failed", err.response.data);
            return false;
        }
    };

    // Logout function
    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, signup,loading, logout,updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
