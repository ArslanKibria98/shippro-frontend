import LabelsHistory from "./labelsHistory"
import Sidebar from "./Sidebar"

const DisplayHistory = () => {
    return (
        <div className="container">
            <div className="dashboard_Sec">
                {/* <div className="dashboard_left"><Sidebar /></div> */}
                <div className="dashboard_right">
                    <h4 class="ms-3" style={{ marginBottom: "10px", fontSize: "26px", fontWeight: "700" }}>Recent Label</h4>
                    <LabelsHistory /></div>
            </div>
        </div>
    )
}
export default DisplayHistory