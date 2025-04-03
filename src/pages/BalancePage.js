import { useEffect, useState, useContext } from "react";
import axios from "axios";
import Adminauth from "../context/Adminauth";
import UploadShipments from "../components/UploadShipments";
import Signup from "../components/signup";
import Loader from "../components/Loader";
import Skeleton from "react-loading-skeleton";
import ReactModal from 'react-modal';
import { Toaster, toast } from "react-hot-toast";
import { Pagination } from "react-bootstrap";
import { FcDeleteRow } from "react-icons/fc";
import { FiDelete, FiNavigation } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { MdDeleteForever } from "react-icons/md";
import DatePicker from "react-date-picker";
import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";

const BalancePage = () => {
   const { user, loading: authLoading, logout } = useContext(Adminauth); // Get admin token and loading state
   const [users, setUsers] = useState([]);
   const [originalUsers, setOriginalUsers] = useState([]); // Store original data for comparison
   const [loading, setLoading] = useState(false); // Loader state
   const [successMessage, setSuccessMessage] = useState(false);
   const [show, setShow] = useState(false);
   const [totalUsers, setTotalUsers] = useState();
   const navigate = useNavigate();
   const [startDate, setStartDate] = useState(new Date());
   const [endDate, setEndDate] = useState(new Date());
   const [balancePerDay, setBalancePerDay] = useState([]);
   const [page, setPage] = useState(() => {
      return Number(localStorage.getItem("currentPage")) || 1;
   });
   const formatDate = (date) => {
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
   };
   useEffect(() => {
      const fetchBalancePerDay = async () => {
         if (!startDate || !endDate) return;
         setLoading(true);
         try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/users/total-balance-per-day`, {
               params: {
                  startDate: formatDate(startDate),
                  endDate: formatDate(endDate),
               },
               headers: { Authorization: `Bearer ${user.token}` }
            });
            console.log(response?.data, "123")
            setBalancePerDay(response?.data?.balancePerDay);
         } catch (err) {
            // setError(err.message || "Error fetching balance data");
         } finally {
            setLoading(false);
         }
      };

      fetchBalancePerDay();
   }, [startDate, endDate]);
   return (
      <div className="container mt-4">
         <div>
            <h3 className="text-start mb-2 col-6">Select Range</h3>
            <DatePicker value={startDate} onChange={setStartDate} />
            <DatePicker value={endDate} onChange={setEndDate} />
         </div>
         <div className="table-responsive mt-3">
            <table className="table table-bordered table-striped">
               <thead className="table-dark">
                  <tr>
                     <th>Sr #</th>
                     <th>Date</th>
                     <th>Balance</th>

                  </tr>
               </thead>
               <tbody>
                  {
                     loading
                        ? Array.from({ length: 10 }).map((_, index) => (
                           <tr key={index}>
                              <td><Skeleton width={20} /></td>
                              <td><Skeleton width={100} /></td>
                              <td><Skeleton width={150} /></td>


                           </tr>
                        ))
                        : balancePerDay.map((user, index) => (
                           <tr key={user._id}>
                              <td>{index + 1}</td>
                              <td>{user._id}</td>
                              <td>{user.totalBalance}</td>
                           </tr>
                        ))}
               </tbody>
            </table>

            {balancePerDay?.length < 1 && !loading && <div className="text-center" style={{ color: "red" }}>
               No Data Found
            </div>
            }
         </div>
         {/* Additional Components */}


      </div>
   );
};

export default BalancePage;