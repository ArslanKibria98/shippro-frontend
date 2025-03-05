// Dashboard.js
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import CreateLabel from "../components/createlabel";
import { FaDollarSign } from "react-icons/fa";
import Sidebar from "../components/Sidebar";
import Dashboardhead from "../components/Dashboardhead";
import DownloadHistory from "../components/DownloadHistory";
import LabelsHistory from "../components/labelsHistory";
import ZipCodeFormatter from "../components/Zipformater";

const Dashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
   
    if (!user) {
        navigate("/login");
        return null;
    }
    console.log(user);

    return (
        <>
         <div><Dashboardhead /></div>       
        <div className="container">
        <div className="dashboard_Sec">
        <div className="dashboard_left sidebar_main"><Sidebar/></div>
        <div className="dashboard_right">
            <div style={{display:"flex", gap:'20px'}}>
            <div className="dash_box">
               <div className="dashbox_icon"> <FaDollarSign /></div>
               <div className="dashbox_stat">{Math.round(user.availableBalance * 10) / 10}</div>

                <div  className="dashbox_heading" > 
                Current Balance: </div>
            </div>
            <div className="dash_box" id="dash_box2">
            <div className="dashbox_icon"> <FaDollarSign /></div>
            <div className="dashbox_stat"> {Math.round(user.totalGeneratedLabels* 10) / 10}</div>
                <div  className="dashbox_heading">Total Spent:</div>
                </div>
            <div className="dash_box" >
            <div className="dashbox_icon"> <FaDollarSign /></div>
            <div className="dashbox_stat"> {user.totalDeposit}</div>
                <div className="dashbox_heading">Total Deposit:</div></div>
            {/* <div className="dash_box"><div>Total Generated Labels:</div><div> {user.totalGeneratedLabels}</div></div> */}

            </div>
            {/* <h2>Rate: {user.rate}</h2> */}
   <div className="history_container " style={{marginTop:'25px'}}>
            <h2 className="historysec_heading" >Recent Labels</h2>
            <LabelsHistory/>
            </div>

            {/* <div style={{display:'none'}}>
            <CreateLabel loginUser={user} />
            </div> */}
            {/* <BulkUpload /> */}
        </div>
        </div>
        </div>
        </>
    );
};

export default Dashboard;
