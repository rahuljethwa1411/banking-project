import React, { useEffect, useState, memo, useMemo } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../misc/AuthContext";
import { bankingApi } from "../misc/BankingApi";
import { handleLogError } from "../misc/Helpers";
import CardDisplay from "../components/CardDisplay";
import BankTransactionHistory from "../components/BankTransactionHistory";
import ActionButton from "../components/ActionButton";
import { NavLink } from "react-router-dom";

const HomePage = memo(() => {
  const Auth = useAuth();
  const user = useMemo(() => Auth.getUser(), [Auth]);
  const isLoggedIn = Auth.userIsAuthenticated();
  const [userDb, setUserDb] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const userResponse = await bankingApi.getUser(user);
        if (isMounted) {
          setUserDb(userResponse.data);

          // Fetch transactions only if the user has a bank account (e.g., regular user)
          if (userResponse.data.bankAccount) {
            const bankResponse = await bankingApi.getTransactions(
              userResponse.data.bankAccount.id,
              user
            );

            const formattedTransactions = bankResponse.data.map((transaction) => ({
              id: transaction.id,
              description: transaction.description,
              amount: transaction.amount,
              bankAccountId: transaction.id,
              date: transaction.createdAt,
            }));

            setTransactions(formattedTransactions);
          } else {
            console.log("User does not have a bank account (e.g., admin).");
            setTransactions([]);
          }
        }
      } catch (error) {
        handleLogError(error);
        setError("Failed to fetch data. Please try again.");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    if (isLoggedIn) {
      fetchData();
    }

    return () => {
      isMounted = false;
    };
  }, [isLoggedIn, user]);

  const memoizedUserDb = useMemo(() => userDb, [userDb]);
  const memoizedTransactions = useMemo(() => transactions, [transactions]);

  const creditApplyButton = (
    <NavLink to="/application">
      <button className="credit-apply-btn mb-3">Apply To Credit Card</button>
    </NavLink>
  );

  const withdrawDepositButton = (
    <NavLink to="/withdraw-deposit">
      <ActionButton>
        <i className="bi bi-cash-coin" />
        <span className="ms-2">Withdraw/Deposit</span>
      </ActionButton>
    </NavLink>
  );

  const transferButton = (
    <NavLink to="/transfer">
      <ActionButton>
        <i className="bi bi-arrow-right-circle" />
        <span className="ms-2">Transfer</span>
      </ActionButton>
    </NavLink>
  );

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  return (
    memoizedUserDb && (
      <div className="home-page">
        {isLoading ? (
          <p>Loading...</p>
        ) : error ? (
          <p style={{ color: "red" }}>{error}</p>
        ) : (
          <>
            <div className="top">
              {/* Conditionally render the credit apply button for non-admin users */}
              {memoizedUserDb.role === "USER" && (
                <div className="credit-apply-div">{creditApplyButton}</div>
              )}
              <h1 className="mb-5">Welcome, {memoizedUserDb.firstName} {memoizedUserDb.lastName}</h1>
            </div>

            {/* Show bank account details only for regular users */}
            {memoizedUserDb.role === "USER" && (
              <>
                <div className="middle1">
                  <div className="card-display1">
                    <CardDisplay
                      firstName={memoizedUserDb.firstName}
                      lastName={memoizedUserDb.lastName}
                      accountNumber={memoizedUserDb.bankAccount?.accountNumber || "N/A"}
                      balance={memoizedUserDb.bankAccount?.balance || 0}
                    />
                  </div>
                  <div className="button-list1">
                    {withdrawDepositButton}
                    {transferButton}
                  </div>
                </div>
                <hr />
                <div className="bottom">
                  <div className="bottom-left">
                    <div className="bottom-left-2">
                      <BankTransactionHistory transactions={memoizedTransactions} />
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Show admin-specific content */}
            {memoizedUserDb.role === "ADMIN" && (
              <div className="admin-dashboard">
                <h2>Admin Dashboard</h2>
                <p>Welcome to the admin dashboard. You can manage users and credit card requests here.</p>
                <NavLink to="/admin-dashboard">
                  <button className="btn btn-primary">Go to Admin Dashboard</button>
                </NavLink>
              </div>
            )}
          </>
        )}
      </div>
    )
  );
});

export default HomePage;