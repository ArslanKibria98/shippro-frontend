import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { AuthProvider as AdminauthProvider } from "./context/Adminauth"; // ✅ For admins
import { useContext } from "react";
import { Toaster, toast } from "react-hot-toast";
import AuthContext from "./context/AuthContext";
import Dashboard from "./pages/Dashboard";
import Login from "./components/login";
import Signup from "./components/signup";
import Home from "./pages/Home";
import Adminlogin from "./components/Adminlogin";
import AdminDashboard from "./pages/AdminDashboard";
import CreateLabel from "./components/createlabel";
import BulkUpload from "./components/Bulkupload";
import LabelsHistory from "./components/labelsHistory";
import DisplayHistory from "./components/displayHistory";
import SenderForm from "./components/Senderlocal";
import HaversineTest from "./components/Harversinetest";
import Layout from "../src/components/Layout"
import 'bootstrap/dist/css/bootstrap.min.css';
import BalanceHistory from "./pages/BalanceHistory";
import BalancePage from "./pages/BalancePage";
import LabelsHistoryForAdmin from "./components/LabelsHistoryForAdmin";
import DealerDashboard from "./pages/DealerDashboard";
import BalanceHistoryDealer from "./pages/BalanceHistoryDealer";
import LabelsHistoryForHeader from "../src/components/LabelHistoryForDealer"
import BalancePageDealer from "./pages/BalancePageDealer";
// Private Route Component for Protected Pages
const PrivateRoute = ({ element }) => {
    const { user, loading } = useContext(AuthContext);

    if (loading);
    return user ? element : <Navigate to="/login" />;
};

function App() {
    return (
        // <AuthProvider>
        //     <AdminauthProvider>
        //         <Toaster position="top-center" reverseOrder={false} />
        //         <Router>
        //             <Routes>
        //                 {/* Public Routes (Without Layout) */}
        //                 <Route path="/" element={<Home />} />
        //                 <Route path="/signup" element={<Signup />} />
        //                 <Route path="/login" element={<Login />} />
        //                 <Route path="/admin/login" element={<Adminlogin />} />
        //                 <Route path="/admin/dashboard" element={<AdminDashboard />} />
        //                 <Route path="/admin/balancePage" element={<BalancePage />} />
        //                 <Route path="/admin/labelsHistory/:id" element={<LabelsHistoryForAdmin />} />
        //                 <Route path="/admin/:id/history" element={<BalanceHistory />} />
        //                 {/* Routes Wrapped with Layout */}
        //                 <Route
        //                     element={<Layout />}
        //                 >
        //                     <Route path="/dashboard" element={<Dashboard />} />
        //                     <Route path="/create-label" element={<CreateLabel />} />
        //                     <Route path="/create/bulk" element={<BulkUpload />} />
        //                     <Route path="/dealer/labelsHistory/:id/:dealerId" element={<LabelsHistoryForHeader />} />
        //                     <Route path="/dealer/:id/:dealerId" element={<BalanceHistoryDealer />} />
        //                     <Route path="/dealer/balancePage" element={<BalancePageDealer />} />
        //                     <Route path="/download-history" element={<DisplayHistory />} />
        //                     <Route path="/dealer-users" element={<DealerDashboard />} />
        //                     <Route path="/sender" element={<SenderForm />} />
        //                     <Route path="/test" element={<HaversineTest />} />
        //                 </Route>
        //             </Routes>
        //         </Router>

        //     </AdminauthProvider> {/* ✅ Admin authentication context */}
        // </AuthProvider>
        <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
            Website under maintenance
        </div>
    );
}

export default App;
