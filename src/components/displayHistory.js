import LabelsHistory from "./labelsHistory"
import Sidebar from "./Sidebar"

const DisplayHistory = () =>{
return(
    <div className="container">
    <div className="dashboard_Sec">
    <div className="dashboard_left"><Sidebar /></div>
    <div className="dashboard_right">
    <h4 class="create_sec_heading" style={{marginBottom: "24px"}}>Recent Generated Label</h4>
        <LabelsHistory /></div>
    </div>
    </div>
)
}
export default DisplayHistory