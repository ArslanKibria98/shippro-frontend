// Login.js
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import Loader from "./Loader";
import footerLogoPro from "../components/Images/ShipPRO.svg"
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
                console.log(success, "1234")
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
        <div className="login-container p-5 d-flex justify-content-center align-items-center vh-100" style={{ background: "linear-gradient(to bottom, #E3EBFF, #DBE5FF00)" }}>
            <div className="card p-4 shadow-lg login-card">
                <div className="d-flex justify-content-center mt-3">
                    <img src={footerLogoPro} width={300} alt="" />
                </div>

                <h2 className="text-center mb-4 mt-4">User Login</h2>
                <form onSubmit={handleLogin} autoComplete="on">
                    <div className="mb-4">
                        <label htmlFor="email" className="form-label fw-bold">
                            Email <span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                            style={{ borderRadius: "20px", height: "50px" }}
                            type="email"
                            id="email"
                            className="form-control"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            name="username"  // 🔹 Chrome prefers "username" over "email" for detection
                            placeholder="Enter your email"
                            disabled={loading}
                            required
                            autoComplete="username"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="form-label fw-bold">
                            Password <span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                            style={{ borderRadius: "20px", height: "50px" }}
                            type="password"
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            id="password"
                            name="password"  // Keep "password"
                            placeholder="Enter your password"
                            required
                            disabled={loading}
                            autoComplete="current-password"
                        />
                    </div>
                    <button type="submit" className="contact-btn w-100" disabled={loading}>
                        {loading ? <span className="loader2"></span> : "Login"}
                    </button>
                </form>


                {error && <p className="text-danger mt-3 text-center">{error}</p>}
            </div>
        </div>
    );
};

export default Login;