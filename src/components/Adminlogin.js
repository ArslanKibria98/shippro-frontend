// Login.js
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
// import Adminauth from "../context/Adminauth";
import Adminauth from "../context/Adminauth";
const Adminlogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(""); // State to manage error messages
    const { login } = useContext(Adminauth);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(""); 
        const success = await login(email, password);
        if (success) {
            navigate("/admin/dashboard");
        } else {
            setError("Invalid email or password. Please try again.");
        }
    };

    return (
<div>
    <div>
            <h2>Admin Login</h2>
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
    );
};

export default Adminlogin;
