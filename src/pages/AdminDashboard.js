import { useEffect, useState, useContext } from "react";
import axios from "axios";
import Adminauth from "../context/Adminauth";
import UploadShipments from "../components/UploadShipments";

const AdminDashboard = () => {
    const { user } = useContext(Adminauth); // Get admin token
    const [users, setUsers] = useState([]);
    const [originalUsers, setOriginalUsers] = useState([]); // Store original data for comparison

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/users`, {
                headers: { Authorization: `Bearer ${user?.token}` },
            });

            // Ensure each user has USPS, UPS, and FedEx in their allowedCarriers
            const updatedUsers = res.data.map((u) => ({
                ...u,
                allowedCarriers: [
                    { carrier: "USPS", status: false, ...u.allowedCarriers.find(c => c.carrier === "USPS") },
                    { carrier: "USPS(Pre Shipment)", status: false, ...u.allowedCarriers.find(c => c.carrier === "USPS(Pre Shipment)") },
                    { carrier: "UPS", status: false, ...u.allowedCarriers.find(c => c.carrier === "UPS") },
                    { carrier: "FedEx", status: false, ...u.allowedCarriers.find(c => c.carrier === "FedEx") },
                ],
            }));

            setUsers(updatedUsers);
            setOriginalUsers(updatedUsers);
        } catch (error) {
            console.error("Error fetching users:", error.response?.data || error.message);
            alert("Failed to fetch users.");
        }
    };

    const handleUpdateUser = async (userId, newStatus, newBalance, newIsDealer, newCarriers) => {
        try {
            const originalUser = originalUsers.find((u) => u._id === userId);

            // Update status if changed
            if (newStatus !== originalUser.status) {
                await axios.put(
                    `${process.env.REACT_APP_API_URL}/api/admin/users/${userId}/status`,
                    { status: newStatus },
                    { headers: { Authorization: `Bearer ${user?.token}` } }
                );
            }

            // Update balance if changed
            if (parseFloat(newBalance) !== originalUser.availableBalance) {
                await axios.put(
                    `${process.env.REACT_APP_API_URL}/api/admin/users/${userId}/balance`,
                    { availableBalance: parseFloat(newBalance) },
                    { headers: { Authorization: `Bearer ${user?.token}` } }
                );
            }

            // Update isDealer status if changed
            if (newIsDealer !== originalUser.isDealer) {
                await axios.put(
                    `${process.env.REACT_APP_API_URL}/api/admin/${userId}/is-dealer`,
                    { isDealer: newIsDealer },
                    { headers: { Authorization: `Bearer ${user?.token}` } }
                );
            }

            // Update carriers if changed
            const changedCarriers = newCarriers.filter((carrier, index) =>
                carrier.status !== originalUser.allowedCarriers[index].status
            );

            if (changedCarriers.length > 0) {
                await axios.put(
                    `${process.env.REACT_APP_API_URL}/api/admin/${userId}/carriers`,
                    { allowedCarriers: newCarriers },
                    { headers: { Authorization: `Bearer ${user?.token}` } }
                );
            }

            alert("User updated successfully!");
            fetchUsers(); // Refresh user list after update
        } catch (error) {
            console.error("Update failed:", error.response?.data || error.message);
            alert("Failed to update user.");
        }
    };

    return (
        <div>
            <h2>Admin Dashboard</h2>
            <table border="1">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Status</th>
                        <th>Available Balance</th>
                        <th>Is Dealer</th>
                        <th>Carriers (Enable/Disable)</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user._id}>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>
                                <select
                                    value={user.status}
                                    onChange={(e) =>
                                        setUsers((prevUsers) =>
                                            prevUsers.map((u) =>
                                                u._id === user._id ? { ...u, status: e.target.value } : u
                                            )
                                        )
                                    }
                                >
                                    <option value="ok">Active</option>
                                    <option value="block">Blocked</option>
                                </select>
                            </td>
                            <td>
                                <input
                                    type="number"
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
                            <td>
                                <select
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
                            </td>
                            <td>
                                {user.allowedCarriers.map((carrier, index) => (
                                    <div key={carrier.carrier}>
                                        <label>
                                            <input
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
                                            {carrier.carrier}
                                        </label>
                                    </div>
                                ))}
                            </td>
                            <td>
                                <button
                                    onClick={() =>
                                        handleUpdateUser(
                                            user._id,
                                            user.status,
                                            user.availableBalance,
                                            user.isDealer,
                                            user.allowedCarriers
                                        )
                                    }
                                >
                                    Update User
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <UploadShipments />
        </div>
    );
};

export default AdminDashboard;
