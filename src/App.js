import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { AuthProvider as AdminauthProvider } from "./context/Adminauth"; // ✅ For admins
import { useContext } from "react";

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

// Private Route Component for Protected Pages
const PrivateRoute = ({ element }) => {
    const { user, loading } = useContext(AuthContext);

    if (loading) return <p>Loading...</p>;
    return user ? element : <Navigate to="/login" />;
};

function App() {
    return (
        <AuthProvider>
            <AdminauthProvider> {/* ✅ Admin authentication context */}

                <Router>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/signup" element={<Signup />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/admin/login" element={<Adminlogin />} />
                        <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
                        <Route path="/create-label" element={<CreateLabel />} />
                        <Route path="/create/bulk" element={<BulkUpload />} />
                        <Route path="/admin/dashboard" element={<AdminDashboard />} />
                        <Route path="/download-history" element={<DisplayHistory />} />
                    </Routes>
                </Router>

            </AdminauthProvider> {/* ✅ Admin authentication context */}
        </AuthProvider>
    );
}

export default App;
