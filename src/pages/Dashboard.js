// Dashboard.js
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import CreateLabel from "../components/createlabel";
import Sidebar from "../components/Sidebar";

const Dashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
   
    if (!user) {
        navigate("/login");
        return null;
    }

    return (
        <div className="container">
        <div className="dashboard_Sec">
        <div className="dashboard_left sidebar_main"><Sidebar/></div>
        <div className="dashboard_right">
            <h2>Welcome to the User Dashboard</h2>
            <p>id:{user._id}</p>
            <p>Name: {user.name}</p>
            <p>Email: {user.email}</p>
            <p>Available Balance: {user.availableBalance}</p>
            <p>Total Generated Labels: {user.totalGeneratedLabels}</p>
            <h2>Sub User</h2>
            <button onClick={logout}>Logout</button>
            {/* Pass the user object as a prop to CreateLabel */}
            <div style={{display:'none'}}>
            <CreateLabel loginUser={user} />
            </div>
            {/* <BulkUpload /> */}
        </div>
        </div>
        </div>
    );
};

export default Dashboard;
