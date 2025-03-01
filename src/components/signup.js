import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const Signup = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { signup } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        const success = await signup(name, email, password);
        if (success) {
            navigate("/login");
        }
    };

    return (
        <div>
            <h2>Admin Signup</h2>
            <form onSubmit={handleSignup}>
                <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type="submit">Signup</button>
            </form>
        </div>
    );
};

export default Signup;
