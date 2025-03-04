// Login.js
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import Loader from "./Loader";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(""); // State to manage error messages
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(""); // Clear previous errors
        const success = await login(email, password);
        if (success) {
            navigate("/dashboard");
        } else {
            setError("Invalid email or password. Please try again.");
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
                />
                </div>
                <div>
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                </div>
                <button type="submit">Login</button>
            </form>
            {error && <p style={{ color: "red" }}>{error}</p>} {/* Display error message */}
        </div>
        </div>
        </div>
    );
};

export default Login;
