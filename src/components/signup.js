import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { Toaster, toast } from "react-hot-toast";
const Signup = ({ onSignupSuccess }) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { signup } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();

        try {
            await toast.promise(
                new Promise(async (resolve, reject) => {
                    const success = await signup(name, email, password);
                    if (success) {
                        resolve(success);
                    } else {
                        reject(new Error("Signup failed"));
                    }
                }),
                {
                    loading: "Adding Please wait ...",
                    success: "User added successfully 🎉",
                    error: "Adding failed. Please try again.",
                }
            );

            if (onSignupSuccess) onSignupSuccess();
        } catch (error) {
            console.error("Signup error:", error);
        }
    };

    return (
        <div>
            {/* <h2>Admin Signup</h2> */}
            <form onSubmit={handleSignup}>
                <div className="d-flex col-12 flex-wrap">
                    <div className="d-flex col-6 pe-3">
                        <div className="text-start" style={{ width: "-webkit-fill-available" }}>
                            <label htmlFor="Enter Name" className="form-label fw-bold ">
                                Name <span style={{ color: "red" }}>*</span>
                            </label>
                            <input className="col-12" type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
                        </div>
                    </div>
                    <div className="d-flex col-6 pe-3">
                        <div className="text-start" style={{ width: "-webkit-fill-available" }}>
                            <label htmlFor="Enter Email" className="form-label fw-bold ">
                                Email <span style={{ color: "red" }}>*</span>
                            </label>
                            <input className="w-100" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </div>
                    </div>
                    <div className="d-flex col-6 pe-3 mt-3">
                        <div className="text-start" style={{ width: "-webkit-fill-available" }}>
                            <label htmlFor="Name" className="form-label fw-bold ">
                                Password <span style={{ color: "red" }}>*</span>
                            </label>
                            <input className="w-100" type="password" placeholder="Enter Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        </div>
                    </div>
                </div>



                <button type="submit" className="contact-btn mt-4">Add</button>
            </form>
        </div>
    );
};

export default Signup;
