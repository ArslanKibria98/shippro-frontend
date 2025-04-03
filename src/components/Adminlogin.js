// Login.js
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
// import Adminauth from "../context/Adminauth";
import Adminauth from "../context/Adminauth";
import footerLogoPro from "../components/Images/ShipPRO.svg"
const Adminlogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(""); // State to manage error messages
    const { login } = useContext(Adminauth);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true)
        setError("");
        const success = await login(email, password);
        if (success) {
            navigate("/admin/dashboard");
            setLoading(false)
        } else {
            setLoading(false)
            setError("Invalid email or password. Please try again.");
        }
    };

    return (
        <div className="login-container p-5 d-flex justify-content-center align-items-center vh-100" style={{ background: "linear-gradient(to bottom, #E3EBFF, #DBE5FF00)" }}>
            <div className="card p-4 shadow-lg login-card">
                <div className="d-flex justify-content-center mt-3">
                    <img src={footerLogoPro} width={300} alt="" />
                </div>

                <h2 className="text-center mb-4 mt-4">Admin Login</h2>
                <form onSubmit={handleLogin}>
                    {/* <div className="mb-3">
                    <input
                        type="email"
                        className="form-control"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={loading}
                    />
                </div> */}
                    <div className="mb-4">
                        <label htmlFor="email" className="form-label fw-bold">
                            Email <span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                            style={{ borderRadius: "20px", height: "50px" }}
                            type="email"
                            className="form-control"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            id="email"
                            placeholder="Enter your email"
                            disabled={loading}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="email" className="form-label fw-bold">
                            Password <span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                            style={{ borderRadius: "20px", height: "50px" }}
                            type="password"
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            id="email"
                            placeholder="Enter your email"
                            required
                            disabled={loading}
                        />
                    </div>
                    {/* <div className="mb-3">
                    <input
                        type="password"
                        className="form-control"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={loading}
                    />
                </div> */}
                    <button type="submit" className="contact-btn  w-100" disabled={loading}>
                        {loading ? <span className="loader2"></span> : "Login"}
                    </button>
                </form>
                {error && <p className="text-danger mt-3 text-center">{error}</p>}
            </div>
        </div>
    );
};

export default Adminlogin;
