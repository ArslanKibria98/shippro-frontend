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
            {/* <div><Dashboardhead /></div>        */}
            <div className="container">
                <div className="dashboard_Sec">
                    {/* <div className="dashboard_left sidebar_main"><Sidebar /></div> */}
                    <div className="dashboard_right">
                        <div style={{ display: "flex", flexWrap: "wrap", gap: '6px' }}>
                            <div className="dash_box" style={{ background: "#0155A5" }}>
                                <div className="dashbox_heading" >
                                    Total Labels </div>
                                <div className="d-flex align-items-center">
                                    <div className="dashbox_heading col-2"> Single </div>
                                    <div className="dashbox_heading ps-2">{user.labelHistory}</div>
                                </div>
                                <div className="d-flex">
                                    <div className="dashbox_heading col-2"> Bulk</div>
                                    <div className="dashbox_heading ps-2">{user.bulkLabelHistory}</div>
                                </div>


                            </div>
                            <div className="dash_box" style={{ background: "#0155A5" }}>
                                <div className="dashbox_heading" >
                                    Current Balance </div>
                                <div className="d-flex">
                                    <div className="dashbox_icon"> <FaDollarSign /></div>
                                    <div className="dashbox_stat">{Math.round(user.availableBalance.toFixed(6) * 10) / 10}</div>
                                </div>



                            </div>
                            <div className="dash_box" id="dash_box2" style={{ background: "#0155A5" }}>
                                <div className="dashbox_heading">Total Spent</div>
                                <div className="d-flex">
                                    <div className="dashbox_icon"> <FaDollarSign /></div>
                                    <div className="dashbox_stat"> {(user?.bulkLabelHistory * user?.rate).toFixed(2)}</div>
                                </div>


                            </div>
                            <div className="dash_box" style={{ background: "#0155A5" }}>
                                <div className="dashbox_heading">Total Deposit</div>
                                <div className="d-flex">
                                    <div className="dashbox_icon"> <FaDollarSign /></div>
                                    <div className="dashbox_stat"> {user.totalDeposit.toFixed(1)}</div>
                                </div>

                            </div>
                            {/* <div className="dash_box"><div>Total Generated Labels:</div><div> {user.totalGeneratedLabels}</div></div> */}

                        </div>
                        {/* <h2>Rate: {user.rate}</h2> */}
                        <div className="mt-4" style={{ fontSize: "20px", fontWeight: "600" }}>
                            Recent Labels
                        </div>
                        <LabelsHistory />
                        {/* <div className="history_container " style={{ marginTop: '25px' }}>
                            <h2 className="historysec_heading" ></h2>
                        
                        </div> */}

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
