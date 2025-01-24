// import React, { useEffect, useState, memo, useMemo } from "react";
// import "../styles/pages/HomePage.css";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "bootstrap-icons/font/bootstrap-icons.css";
// import ActionButton from "../components/ActionButton";
// import CardDisplay from "../components/CardDisplay";
// import BankTransactionHistory from "../components/BankTransactionHistory";
// import { NavLink, Navigate } from "react-router-dom";
// import { useAuth } from "../misc/AuthContext";
// import { bankingApi } from "../misc/BankingApi";
// import { handleLogError } from "../misc/Helpers";

// const HomePage = memo(() => {
//   const Auth = useAuth();
//   const user = Auth.getUser();
//   const isLoggedIn = Auth.userIsAuthenticated();
//   const [userDb, setUserDb] = useState(null);
//   const [transactions, setTransactions] = useState([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const userResponse = await bankingApi.getUser(user);
//         console.log(userResponse.data);
//         setUserDb(userResponse.data);

//         if (userResponse.data && userResponse.data.bankAccount) {
//           const bankResponse = await bankingApi.getTransactions(
//             userResponse.data.bankAccount.id,
//             user
//           );
//           console.log(bankResponse.data);

//           // Transform the bank data into the format you want for transactions
//           const formattedTransactions = bankResponse.data.map((transaction) => ({
//             id: transaction.id,
//             description: transaction.description,
//             amount: transaction.amount,
//             bankAccountId: transaction.id,
//             date: transaction.createdAt,
//           }));

//           setTransactions(formattedTransactions);
//         } else {
//           console.error("User data or bank account information is not available.");
//         }
//       } catch (error) {
//         handleLogError(error);
//       }
//     };

//     if (isLoggedIn) {
//       fetchData();
//     }
//   }, [isLoggedIn, user]);

//   // Memoize data to prevent unnecessary re-renders
//   const memoizedUserDb = useMemo(() => userDb, [userDb]);
//   const memoizedTransactions = useMemo(() => transactions, [transactions]);

//   // Memoize JSX elements
//   const creditApplyButton = (
//     <NavLink to="/application">
//       <button className="credit-apply-btn mb-3">Apply To Credit Card</button>
//     </NavLink>
//   );

//   const withdrawDepositButton = (
//     <NavLink to="/withdraw-deposit">
//       <ActionButton>
//         <i className="bi bi-cash-coin" />
//         <span className="ms-2">Withdraw/Deposit</span>
//       </ActionButton>
//     </NavLink>
//   );

//   const transferButton = (
//     <NavLink to="/transfer">
//       <ActionButton>
//         <i className="bi bi-arrow-right-circle" />
//         <span className="ms-2">Transfer</span>
//       </ActionButton>
//     </NavLink>
//   );

//   if (!isLoggedIn) {
//     return <Navigate to="/login" />;
//   }

//   return (
//     memoizedUserDb && (
//       <div className="home-page">
//         <div className="top">
//           <div className="credit-apply-div">{creditApplyButton}</div>
//           <h1 className="mb-5">Bank Account</h1>
//         </div>

//         <div className="middle1">
//           <div className="card-display1">
//             <CardDisplay
//               firstName={memoizedUserDb.firstName}
//               lastName={memoizedUserDb.lastName}
//               accountNumber={memoizedUserDb.bankAccount.accountNumber}
//               balance={memoizedUserDb.bankAccount.balance}
//             />
//           </div>
//           <div className="button-list1">
//             {withdrawDepositButton}
//             {transferButton}
//           </div>
//         </div>
//         <hr />
//         <div className="bottom">
//           <div className="bottom-left">
//             <div className="bottom-left-2">
//               <BankTransactionHistory transactions={memoizedTransactions} />
//             </div>
//           </div>
//         </div>
//       </div>
//     )
//   );
// });

// export default HomePage;


import React, { useEffect, useState, memo, useMemo } from "react";
import "../styles/pages/HomePage.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import ActionButton from "../components/ActionButton";
import CardDisplay from "../components/CardDisplay";
import BankTransactionHistory from "../components/BankTransactionHistory";
import { NavLink, Navigate } from "react-router-dom";
import { useAuth } from "../misc/AuthContext";
import { bankingApi } from "../misc/BankingApi";
import { handleLogError } from "../misc/Helpers";

const HomePage = memo(() => {
  const Auth = useAuth();
  const user = useMemo(() => Auth.getUser(), [Auth]); // Memoize user
  const isLoggedIn = Auth.userIsAuthenticated();
  const [userDb, setUserDb] = useState(null);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    let isMounted = true; // Track if the component is mounted

    const fetchData = async () => {
      try {
        const userResponse = await bankingApi.getUser(user);
        if (isMounted) {
          console.log(userResponse.data);
          setUserDb(userResponse.data);

          if (userResponse.data && userResponse.data.bankAccount) {
            const bankResponse = await bankingApi.getTransactions(
              userResponse.data.bankAccount.id,
              user
            );
            console.log(bankResponse.data);

            const formattedTransactions = bankResponse.data.map((transaction) => ({
              id: transaction.id,
              description: transaction.description,
              amount: transaction.amount,
              bankAccountId: transaction.id,
              date: transaction.createdAt,
            }));

            setTransactions(formattedTransactions);
          } else {
            console.error("User data or bank account information is not available.");
          }
        }
      } catch (error) {
        handleLogError(error);
      }
    };

    if (isLoggedIn) {
      fetchData();
    }

    return () => {
      isMounted = false; // Cleanup function
    };
  }, [isLoggedIn]); // Only depend on `isLoggedIn`

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
        <div className="top">
          <div className="credit-apply-div">{creditApplyButton}</div>
          <h1 className="mb-5">Bank Account</h1>
        </div>

        <div className="middle1">
          <div className="card-display1">
            <CardDisplay
              firstName={memoizedUserDb.firstName}
              lastName={memoizedUserDb.lastName}
              accountNumber={memoizedUserDb.bankAccount.accountNumber}
              balance={memoizedUserDb.bankAccount.balance}
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
      </div>
    )
  );
});

export default HomePage;