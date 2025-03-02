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
    console.log(user);

    return (
        <div className="container">
        <div className="dashboard_Sec">
        <div className="dashboard_left sidebar_main"><Sidebar/></div>
        <div className="dashboard_right">
            <h2>Welcome to the User Dashboard</h2>
            <div style={{display:"flex", gap:'20px'}}>
            <div className="dash_box"><div> Current Balance: </div><div>{user.availableBalance}</div></div>
            <div className="dash_box"><div>Total Spent:</div><div> {user.totalGeneratedLabels}</div></div>
            <div className="dash_box"><div>Total Deposit:</div><div> {user.totalGeneratedLabels}</div></div>
            {/* <div className="dash_box"><div>Total Generated Labels:</div><div> {user.totalGeneratedLabels}</div></div> */}

            </div>
            <h2>Rate: {user.rate}</h2>
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
