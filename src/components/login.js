// Login.js
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import Loader from "./Loader";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(""); // State to manage error messages
    const [loading, setLoading] = useState(false); // State to manage loading state
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(""); // Clear previous errors
        setLoading(true); // Set loading to true when login starts

        try {
            const success = await login(email, password);
            if (success) {
                navigate("/dashboard");
            } else {
                setError("Invalid email or password. Please try again.");
            }
        } catch (err) {
            setError("An error occurred. Please try again.");
        } finally {
            setLoading(false); // Set loading to false when login finishes
        }
    };

    return (
        <div className="container">
            <div className="login_body">
                <div className="login_Container">
                    <h2>User Login</h2>
                    <form onSubmit={handleLogin}>
                        <div>
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={loading} // Disable input during loading
                            />
                        </div>
                        <div>
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={loading} // Disable input during loading
                            />
                        </div>
                        <button type="submit" disabled={loading}>
                        {/* <span class="loader2"></span> */}
                            {loading ? <span class="loader2"></span> : "Login"} 
                            {/* Show loader or Login text */}
                        </button>
                    </form>
                    {error && <p style={{ color: "red" }}>{error}</p>} {/* Display error message */}
                </div>
            </div>
        </div>
    );
};

export default Login;