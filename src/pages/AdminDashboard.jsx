import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { bankingApi } from "../misc/BankingApi";
import { useAuth } from "../misc/AuthContext";

const AdminDashboard = () => {
  const Auth = useAuth();
  const user = Auth.getUser();
  const isLoggedIn = Auth.userIsAuthenticated();
  const [pendingCreditCards, setPendingCreditCards] = useState([]);

  // Fetch pending credit cards (only if the user is an admin)
  useEffect(() => {
    if (isLoggedIn && user.role === "ADMIN") {
      const fetchPendingCreditCards = async () => {
        try {
          const response = await bankingApi.getPendingCreditCards(user);
          setPendingCreditCards(response.data);
        } catch (error) {
          console.error("Error fetching pending credit cards:", error);
        }
      };

      fetchPendingCreditCards();
    }
  }, [isLoggedIn, user]);

  // Redirect if the user is not an admin
  if (!isLoggedIn || user.role !== "ADMIN") {
    return <Navigate to="/home" />;
  }

  // Handle approve/reject action
  const handleUpdateStatus = async (id, status) => {
    try {
      await bankingApi.updateCreditCardStatus(id, status, user);
      // Remove the updated card from the list
      setPendingCreditCards((prevCards) =>
        prevCards.filter((card) => card.id !== id)
      );
      alert(`Credit card ${status.toLowerCase()} successfully!`);
    } catch (error) {
      console.error("Error updating credit card status:", error);
    }
  };

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <h2>Pending Credit Card Requests</h2>
      {pendingCreditCards.length === 0 ? (
        <p>No pending credit card requests.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID </th>
              <th>Card Number </th>
              <th>Type </th>
              <th>Credit Limit </th>
              <th>Available Credit </th>
              <th>Issue Date </th>
              <th>Actions </th>
            </tr>
          </thead>
          <tbody>
            {pendingCreditCards.map((card) => (
              <tr key={card.id}>
                <td>{card.id}</td>
                <td>{card.cardNumber}</td>
                <td>{card.type}</td>
                <td>{card.creditLimit}</td>
                <td>{card.availableCredit}</td>
                <td>{card.issueDate}</td>
                <td>
                  <button
                    onClick={() => handleUpdateStatus(card.id, "APPROVED")}
                    style={{ backgroundColor: "green", color: "white" }}
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(card.id, "REJECTED")}
                    style={{ backgroundColor: "red", color: "white" }}
                  >
                     Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminDashboard;