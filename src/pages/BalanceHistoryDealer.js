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
import { FiDelete } from "react-icons/fi";
import { MdDeleteForever } from "react-icons/md";
import { useParams } from "react-router-dom";
const BalanceHistoryDealer = () => {
   const { user, loading: authLoading, logout } = useContext(Adminauth); // Get admin token and loading state
   const [users, setUsers] = useState([]);
   const [labels, setLabels] = useState();
   const [originalUsers, setOriginalUsers] = useState([]); // Store original data for comparison
   const [loading, setLoading] = useState(false); // Loader state
   const [successMessage, setSuccessMessage] = useState(false);
   const [show, setShow] = useState(false);
   const [totalUsers, setTotalUsers] = useState();

   const id = useParams()
   const [page, setPage] = useState(() => {
      return Number(localStorage.getItem("currentPage")) || 1;
   });
   useEffect(() => {
      localStorage.setItem("currentPage", page);
   }, [page]);
   const [totalPages, setTotalPages] = useState()
   useEffect(() => {
      // Fetch users only if the admin is authenticated (user.token exists)

      fetchUsers();

   }, [user, page]); // Re-run effect when `user` changes
   console.log(id, "hello")
   const fetchUsers = async () => {
      setLoading(true);

      try {
         const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/dealer/${id?.dealerId}/sub-user/${id?.id}/balance-history`, {
            // headers: { Authorization: `Bearer ${user.token}` },
         });
         console.log(res?.data?.balanceHistory, "12345")
         // Ensure each user has USPS, UPS, and FedEx in their allowedCarriers
         setTotalPages(res?.data?.pagination?.totalPages)
         setTotalUsers(res?.data?.pagination?.totalUsers)
         // const updatedUsers = res?.data?.users?.map((u) => ({
         //    ...u,
         //    allowedCarriers: [
         //       { carrier: "USPS", status: false, ...u?.allowedCarriers.find((c) => c?.carrier === "USPS") },
         //       { carrier: "USPS(Pre Shipment)", status: false, ...u.allowedCarriers.find((c) => c?.carrier === "USPS(Pre Shipment)") },
         //       { carrier: "UPS", status: false, ...u.allowedCarriers.find((c) => c.carrier === "UPS") },
         //       { carrier: "FedEx", status: false, ...u.allowedCarriers.find((c) => c.carrier === "FedEx") },
         //    ],
         // }));

         setUsers(res?.data?.balanceHistory);
         // setLabels(res?.data?.labelHistory)
         // setOriginalUsers(updatedUsers);
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

         // Update status if changed

         const res = await axios.put(
            `${process.env.REACT_APP_API_URL}/api/admin/users/${id.id}/balance-history/${userId}`,
            { status: newStatus },
            { headers: { Authorization: `Bearer ${user.token}` } }
         );
         console.log(res, "res")
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
   return (
      <div className="container mt-4">
         <ReactModal
            isOpen={successMessage}
            onRequestClose={() => setSuccessMessage(false)}
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
                  <h2 className="text-start mb-4 col-6">Add User</h2>
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
               <Signup onSignupSuccess={fetchUsers} />
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
            <h2 className="text-start mb-4 col-6"> Balance History</h2>
            <div className="text-end col-6 gap-2">
               {/* <h2 className="text-end mb-4 col-12"> Total Labels: {labels}</h2> */}

               {/* <button style={{ fontSize: "14px" }} className="contact-btn me-2" onClick={() => { setShow(true) }}>
                  Add  Shipments
               </button>
               <button style={{ fontSize: "14px" }} className="contact-btn" onClick={() => { setSuccessMessage(true) }}>
                  Add User
               </button> */}

            </div>
         </div>

         <div className="table-responsive">
            <table className="table table-bordered table-striped">
               <thead className="table-dark">
                  <tr>
                     <th>Sr #</th>
                     <th>Previous Balance</th>
                     <th>New Balance</th>
                     <th>Status</th>
                     <th>Total Deposit</th>
                     <th>Updated</th>
                     <th>Action</th>
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
                              <td><Skeleton width={100} /></td>
                              <td><Skeleton width={100} /></td>

                           </tr>
                        ))
                        : users.map((user, index) => (
                           <tr key={user._id}>
                              <td>{index + 1}</td>
                              <td>{user.previousBalance}</td>
                              <td>{user.newBalance}</td>
                              <td> <select
                                 className="form-select"
                                 value={user.status}
                                 onChange={(e) =>
                                    setUsers((prevUsers) =>
                                       prevUsers.map((u) =>
                                          u._id === user._id
                                             ? { ...u, status: e.target.value }
                                             : u
                                       )
                                    )
                                 }
                              >
                                 <option value="paid">Paid</option>
                                 <option value="unpaid">Unpaid</option>
                              </select></td>
                              <td>{user.totalDeposit}</td>
                              <td> {new Date(user.updatedAt).toLocaleString()}</td>
                              <td style={{ height: "60px" }} className="d-flex align-items-center">

                                 <button
                                    className="btn btn-primary btn-sm"
                                    onClick={() =>
                                       handleUpdateUser(
                                          user._id,
                                          user.status,
                                          user.availableBalance,
                                          user.isDealer,
                                          user.allowedCarriers,
                                          user.rate
                                       )
                                    }
                                 >
                                    Update
                                 </button>


                              </td>
                           </tr>
                        ))}
               </tbody>
            </table>
            <div className="col-12 d-flex">
               <div className="col-4">
                  <span style={{ color: "#1C2F41", fontSize: "20px", fontWeight: "600" }}></span> <span style={{ color: "#0155A5", fontSize: "20px", fontWeight: "600" }}>{totalUsers}</span>
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

export default BalanceHistoryDealer;