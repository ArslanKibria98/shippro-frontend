import { useEffect, useState, useContext } from "react";
import axios from "axios";
import Adminauth from "../context/Adminauth";
import UploadShipments from "../components/UploadShipments";
import SignUpDealer from "../components/SignUpDealer";
import Loader from "../components/Loader";
import Skeleton from "react-loading-skeleton";
import ReactModal from 'react-modal';
import { Toaster, toast } from "react-hot-toast";
import AuthContext from "../context/AuthContext";
import { Pagination } from "react-bootstrap";
import { FcDeleteRow } from "react-icons/fc";
import { FiDelete, FiNavigation } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { MdDeleteForever, MdDetails, MdSystemUpdateAlt, MdUpdate, MdEdit, MdInfo } from "react-icons/md";
import DatePicker from "react-date-picker";
import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";

const DealerDashboard = () => {
   const { loading: authLoading, logout } = useContext(Adminauth); // Get admin token and loading state
   const { user, updateUser } = useContext(AuthContext);
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
   const loginUser = user
   const [page, setPage] = useState(() => {
      return Number(localStorage.getItem("currentPageDealer")) || 1;
   });
   useEffect(() => {
      localStorage.setItem("currentPageDealer", page);
   }, [page]);
   const [totalPages, setTotalPages] = useState()
   useEffect(() => {
      // Fetch users only if the admin is authenticated (user.token exists)
      if (user?.token) {
         fetchUsers();
      }
   }, [user, page]); // Re-run effect when `user` changes

   const fetchUsers = async () => {
      setLoading(true);

      try {
         const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/dealer/${user?.id}/sub-users?page=${page}&limit=5`, {
            headers: { Authorization: `Bearer ${user.token}` },
         });
         console.log(res?.data?.users, "12345")
         // Ensure each user has USPS, UPS, and FedEx in their allowedCarriers
         setTotalPages(res?.data?.pagination?.totalPages)
         setTotalUsers(res?.data?.pagination?.totalUsers)
         const updatedUsers = res?.data?.users?.map((u) => ({
            ...u,
            allowedCarriers: [
               { carrier: "USPS", status: false, ...u?.allowedCarriers.find((c) => c?.carrier === "USPS") },
               { carrier: "USPS(Pre Shipment)", status: false, ...u.allowedCarriers.find((c) => c?.carrier === "USPS(Pre Shipment)") },
               { carrier: "UPS", status: false, ...u.allowedCarriers.find((c) => c.carrier === "UPS") },
               { carrier: "FedEx", status: false, ...u.allowedCarriers.find((c) => c.carrier === "FedEx") },
            ],
         }));

         setUsers(updatedUsers);
         setOriginalUsers(updatedUsers);
      } catch (error) {
         console.error("Error fetching users:", error.response?.data || error.message);
         if (error.response?.status === 401) {
            // Unauthorized (token expired or invalid)
            toast.error("Session expired. Please log in again.");
            logout(); // Log the admin out
         } else {
            toast.error("Failed to fetch users.");
         }
      } finally {
         setLoading(false);
      }
   };

   const handleUpdateUser = async (userId, newStatus, newBalance, newIsDealer, newCarriers, newRate) => {
      try {
         console.log(typeof (newStatus), "11")
         const originalUser = originalUsers.find((u) => u._id === userId);
         console.log(originalUser, "newStatus")
         // Update status if changed
         if (newStatus !== originalUser.status) {
            await axios.put(
               `${process.env.REACT_APP_API_URL}/api/admin/dealer/${user?.id}/sub-users/${userId}/status`,
               { status: newStatus == "true" ? true : false },
               { headers: { Authorization: `Bearer ${user.token}` } }
            );
         }

         // Update balance if changed
         if (parseFloat(newBalance) > originalUser.availableBalance) {
            const updatedAvailableBalance = parseFloat(newBalance);
            const updatedTotalDeposit = originalUser.totalDeposit + (updatedAvailableBalance - originalUser.availableBalance);

            await axios.put(
               `${process.env.REACT_APP_API_URL}/api/admin/dealer/${user?.id}/sub-users/${userId}/balance`,
               {
                  availableBalance: updatedAvailableBalance,
                  totalDeposit: updatedTotalDeposit
               },
               { headers: { Authorization: `Bearer ${user.token}` } }
            );
         }
         if (parseFloat(newBalance) < originalUser.availableBalance) {
            const updatedAvailableBalance = parseFloat(newBalance);
            const updatedTotalDeposit = originalUser.totalDeposit - (originalUser.availableBalance - updatedAvailableBalance);

            await axios.put(
               `${process.env.REACT_APP_API_URL}/api/admin/dealer/${user?.id}/sub-users/${userId}/balance`,
               {
                  availableBalance: updatedAvailableBalance,
                  totalDeposit: updatedTotalDeposit
               },
               { headers: { Authorization: `Bearer ${user.token}` } }
            );
         }

         // Update isDealer status if changed
         if (newIsDealer !== originalUser.isDealer) {
            await axios.put(
               `${process.env.REACT_APP_API_URL}/api/admin/${userId}/is-dealer`,
               { isDealer: newIsDealer },
               { headers: { Authorization: `Bearer ${user.token}` } }
            );
         }

         // Update carriers if changed
         const changedCarriers = newCarriers.filter((carrier, index) =>
            carrier.status !== originalUser.allowedCarriers[index].status
         );

         if (changedCarriers.length > 0) {
            await axios.put(
               `${process.env.REACT_APP_API_URL}/api/admin/dealer/${user?.id}/sub-users/${userId}/carriers`,
               { allowedCarriers: newCarriers },
               { headers: { Authorization: `Bearer ${user.token}` } }
            );
         }

         // Update rate if changed
         if (parseFloat(newRate) !== originalUser.rate) {
            await axios.put(
               `${process.env.REACT_APP_API_URL}/api/admin/dealer/${user?.id}/sub-users/${userId}/rate`,
               { rate: parseFloat(newRate) },
               { headers: { Authorization: `Bearer ${user.token}` } }
            );
         }

         toast.success("User updated successfully!");
         fetchUsers(); // Refresh user list after update
      } catch (error) {
         console.error("Update failed:", error.response?.data || error.message);
         toast.success("Failed to update user.");
      }
   };

   // Show loader if auth is still loading or users are being fetched
   // if (authLoading || loading) {
   //     return <Loader />;
   // }
   const handleDelete = async (userId) => {
      const confirmDelete = window.confirm("Are you sure you want to delete this user?");
      if (!confirmDelete) return;

      try {
         const res = await axios.delete(`${process.env.REACT_APP_API_URL}/api/admin/dealer/${user?.id}/sub-users/${userId}`, { headers: { Authorization: `Bearer ${user.token}` } });
         fetchUsers(); // Refresh user list after update
         console.log(res, "res")
         toast.success("User deleted successfully!");
      } catch (error) {
         console.error("Error deleting user:", error);
         toast.error("Failed to delete user.");
      }
   };
   const formatDateToLocal = (date, daysToAdd = 0) => {
      const offset = date.getTimezoneOffset() * 60000; // Offset in milliseconds
      const adjustedDate = new Date(date - offset);
      adjustedDate.setDate(adjustedDate.getDate() - daysToAdd); // Add days
      return adjustedDate.toISOString().split("T")[0];
   };
   // useEffect(() => {
   //    const fetchBalancePerDay = async () => {
   //       if (!startDate || !endDate) return;
   //       setLoading(true);
   //       try {
   //          const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/dealer/${user?.id}/sub-users/total-balance-per-day`, {
   //             params: {
   //                startDate: startDate.toISOString().split("T")[0],
   //                endDate: endDate.toISOString().split("T")[0],
   //             },
   //             headers: { Authorization: `Bearer ${user.token}` }
   //          });
   //          console.log(response?.data, "123")
   //          setBalancePerDay(response?.data?.balancePerDay[0]);
   //       } catch (err) {
   //          // setError(err.message || "Error fetching balance data");
   //       } finally {
   //          setLoading(false);
   //       }
   //    };

   //    fetchBalancePerDay();
   // }, [startDate, endDate]);
   console.log(users, "users")
   return (
      <div className="container mt-4">
         <ReactModal
            isOpen={successMessage}
            onRequestClose={() => setSuccessMessage(false)}
            contentLabel="Add Userr"
            shouldCloseOnOverlayClick={false}  // Prevents closing when clicking outside
            style={{
               content: {
                  top: '50%',
                  left: '50%',
                  right: 'auto',
                  bottom: 'auto',
                  marginRight: '-50%',
                  padding: "30px",
                  transform: 'translate(-50%, -50%)',
                  textAlign: 'center',
               },
            }}
         >
            {/* Close button inside modal */}
            <div>
               <div className="text-start">
                  <h2 className="text-start mb-4 col-6">Add Userr</h2>
               </div>

               <button
                  className="modal_close_btn"
                  onClick={() => setSuccessMessage(false)}
                  style={{
                     position: 'absolute',
                     top: '10px',
                     right: '15px',
                     background: 'transparent',
                     border: 'none',
                     fontSize: '20px',
                     cursor: 'pointer'
                  }}
               >
                  ❌
               </button>
            </div>


            {/* Display label */}
            <div className="mt-4">
               <SignUpDealer onSignupSuccess={fetchUsers} />
            </div>

         </ReactModal>
         <ReactModal
            isOpen={show}
            onRequestClose={() => setShow(false)}
            contentLabel="Add User"
            shouldCloseOnOverlayClick={false}  // Prevents closing when clicking outside
            style={{
               content: {
                  top: '50%',
                  left: '50%',
                  right: 'auto',
                  bottom: 'auto',
                  marginRight: '-50%',
                  padding: "30px",
                  transform: 'translate(-50%, -50%)',
                  textAlign: 'center',
               },
            }}
         >
            {/* Close button inside modal */}
            <div>
               <div className="text-start">
                  <h2 className="text-start mb-4 col-6" style={{ textWrap: "nowrap" }}>Upload  Shipments</h2>
               </div>

               <button
                  className="modal_close_btn"
                  onClick={() => setShow(false)}
                  style={{
                     position: 'absolute',
                     top: '10px',
                     right: '15px',
                     background: 'transparent',
                     border: 'none',
                     fontSize: '20px',
                     cursor: 'pointer'
                  }}
               >
                  ❌
               </button>
            </div>


            {/* Display label */}
            <div className="mt-4">
               <UploadShipments />
            </div>

         </ReactModal>
         <div className="d-flex">
            <h2 className="text-start mb-4 col-6">Dealer Dashboard</h2>
            <div className="text-end col-6 gap-2">
               <button style={{ fontSize: "14px" }} className="contact-btn me-2" onClick={() => { navigate("/dealer/balancePage") }}>
                  Balance
               </button>
               <button style={{ fontSize: "14px" }} className="contact-btn me-2" onClick={() => { setShow(true) }}>
                  Add  Shipments
               </button>
               <button style={{ fontSize: "14px" }} className="contact-btn" onClick={() => { setSuccessMessage(true) }}>
                  Add Userr
               </button>

            </div>
         </div>

         <div className="table-responsive">
            <table className="table table-bordered table-striped">
               <thead className="table-dark">
                  <tr>
                     <th>Sr #</th>
                     <th>Name</th>
                     <th>Email</th>
                     <th>Status</th>
                     <th>Available Balance</th>
                     {/* <th>Is Dealer</th> */}
                     <th>Rate</th>
                     <th>Carriers (Enable/Disable)</th>
                     <th>Actions</th>
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
                              <td><Skeleton width={80} /></td>
                              <td><Skeleton width={100} /></td>
                              {/* <td><Skeleton width={80} /></td> */}
                              <td><Skeleton width={80} /></td>
                              <td><Skeleton width={120} /></td>
                              <td><Skeleton width={80} height={30} />
                              </td>
                           </tr>
                        ))
                        : users.map((user, index) => (
                           <tr key={user._id}>
                              <td>{index + 1}</td>
                              <td>{user.name}</td>
                              <td>{user.email}</td>
                              <td>
                                 <select
                                    className="form-select"
                                    value={user.isBlocked}
                                    defaultValue={false}
                                    onChange={(e) =>
                                       setUsers((prevUsers) =>
                                          prevUsers.map((u) =>
                                             u._id === user._id ? { ...u, isBlocked: e.target.value } : u
                                          )
                                       )
                                    }
                                 >
                                    <option value={false}>Active</option>
                                    <option value={true}>Blocked</option>
                                 </select>
                              </td>
                              <td>
                                 <input
                                    type="number"
                                    className="form-control"
                                    value={user.availableBalance}
                                    onChange={(e) =>
                                       setUsers((prevUsers) =>
                                          prevUsers.map((u) =>
                                             u._id === user._id
                                                ? { ...u, availableBalance: e.target.value }
                                                : u
                                          )
                                       )
                                    }
                                 />
                              </td>
                              {/* <td>
                                 <select
                                    className="form-select"
                                    value={user.isDealer}
                                    onChange={(e) =>
                                       setUsers((prevUsers) =>
                                          prevUsers.map((u) =>
                                             u._id === user._id
                                                ? { ...u, isDealer: e.target.value === "true" }
                                                : u
                                          )
                                       )
                                    }
                                 >
                                    <option value="true">Yes</option>
                                    <option value="false">No</option>
                                 </select>
                              </td> */}
                              <td>
                                 <input
                                    type="number"
                                    className="form-control"
                                    value={user.rate}
                                    onChange={(e) =>
                                       setUsers((prevUsers) =>
                                          prevUsers.map((u) =>
                                             u._id === user._id
                                                ? { ...u, rate: e.target.value }
                                                : u
                                          )
                                       )
                                    }
                                 />
                              </td>
                              <td>
                                 {user.allowedCarriers.map((carrier, index) => (
                                    <div key={carrier.carrier} className="form-check">
                                       <input
                                          className="form-check-input"
                                          type="checkbox"
                                          checked={carrier.status}
                                          onChange={() =>
                                             setUsers((prevUsers) =>
                                                prevUsers.map((u) =>
                                                   u._id === user._id
                                                      ? {
                                                         ...u,
                                                         allowedCarriers: u.allowedCarriers.map((c, i) =>
                                                            i === index ? { ...c, status: !c.status } : c
                                                         ),
                                                      }
                                                      : u
                                                )
                                             )
                                          }
                                       />
                                       <label className="form-check-label ms-1">
                                          {carrier.carrier}
                                       </label>
                                    </div>
                                 ))}
                              </td>
                              <td style={{ width: "150px", height: "120px" }} className="d-flex align-items-center">
                                 <div onClick={() =>
                                    handleDelete(
                                       user._id,

                                    )
                                 } className="me-2 cursor-pointer" >
                                    <MdDeleteForever size={24} />
                                 </div>
                                 <div
                                    className=" btn-sm"
                                    onClick={() =>
                                       handleUpdateUser(
                                          user._id,
                                          user.isBlocked,
                                          user.availableBalance,
                                          user.isDealer,
                                          user.allowedCarriers,
                                          user.rate
                                       )
                                    }
                                 >
                                    <MdEdit size={24} />
                                 </div>
                                 <div className="ms-2" onClick={() => { navigate(`/dealer/labelsHistory/${user._id}/${loginUser?.id}`) }}>
                                    <MdInfo size={24} />
                                 </div>

                                 <div className="ms-2" onClick={() => { navigate(`/dealer/${user._id}/${loginUser?.id}`) }}>
                                    <FiNavigation size={24} />
                                 </div>

                              </td>
                           </tr>
                        ))}
               </tbody>
            </table>
            <div className="col-12 d-flex">
               <div className="col-4">
                  <span style={{ color: "#1C2F41", fontSize: "20px", fontWeight: "600" }}>Total Users:</span> <span style={{ color: "#0155A5", fontSize: "20px", fontWeight: "600" }}>{totalUsers}</span>
               </div>
               <div className="col-8 d-flex justify-content-end">
                  <Pagination>
                     <Pagination.Prev
                        onClick={() => setPage(page - 1)}
                        disabled={page === 1}
                     />

                     {[...Array(totalPages)].map((_, index) => (
                        <Pagination.Item
                           key={index + 1}
                           active={index + 1 === page}
                           onClick={() => setPage(index + 1)}
                        >
                           {index + 1}
                        </Pagination.Item>
                     ))}

                     <Pagination.Next
                        onClick={() => setPage(page + 1)}
                        disabled={page === totalPages}
                     />
                  </Pagination>
               </div>

            </div>

            {users?.length < 1 && !loading && <div className="text-center" style={{ color: "red" }}>
               No Data Found
            </div>
            }
         </div>
         {/* Additional Components */}


      </div>
   );
};

export default DealerDashboard;