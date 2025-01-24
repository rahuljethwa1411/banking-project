import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { bankingApi } from "../misc/BankingApi";
import { handleLogError } from "../misc/Helpers";
import toast from "react-hot-toast";

function Withdraw({ bankAccountId, user }) {
  const [amount, setAmount] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleWithdraw = async (e) => {
    e.preventDefault();
    try {
      const response = await bankingApi.withdraw(bankAccountId, amount, user);
      console.log(response.data);
      setErrorMessage("");
      const notify = () => toast.success(`Successfully withdrawn money`);
      notify();
      // setSuccessMessage("Successfully withdrawn money");
      setAmount(0);
    } catch (error) {
      handleLogError(error);
      setSuccessMessage("");
      const notify = () => toast.error("Please enter the amount");
      notify();
      // setErrorMessage(error.response.data.message);
      setAmount(0);
    }
  };

  const handleAmountButtonClick = (buttonAmount) => {
    setAmount(buttonAmount);
  };

  return (
    <form className="row justify-content-center" onSubmit={handleWithdraw}>
      <div className="col-12 col-md-6">
        <h2 className="text-center fw-bold">Withdraw</h2>
        <div className="form-group">
          <label className="amount mt-2" htmlFor="withdrawAmount">
            Amount:
          </label>
          <input
            type="number"
            id="withdrawAmount"
            className="form-control mt-2"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
          />
        </div>

        <div className="btn-group mt-3">
          <button
            className="btn btn-outline-primary rounded me-2"
            type="button"
            onClick={() => handleAmountButtonClick(100)}
          >
            100
          </button>
          <button
            className="btn btn-outline-primary rounded me-2"
            type="button"
            onClick={() => handleAmountButtonClick(200)}
          >
            200
          </button>
          <button
            className="btn btn-outline-primary rounded  me-2"
            type="button"
            onClick={() => handleAmountButtonClick(500)}
          >
            500
          </button>
        </div>

        <div className="text-center">
          <button className="btn btn-primary mt-4 btn-lg" type="submit">
            Withdraw
          </button>
        </div>
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        {successMessage && (
          <div className="success-message">{successMessage}</div>
        )}
      </div>
    </form>
  );
}
export default Withdraw;
