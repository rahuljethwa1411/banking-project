import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from '../misc/AuthContext';
import { bankingApi } from '../misc/BankingApi';
import { handleLogError } from '../misc/Helpers';

function Registration() {
  const Auth = useAuth();
  const isLoggedIn = Auth.userIsAuthenticated();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [username, setUsername] = useState("");
  const [initialBalance, setinitialBalance] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();

  const createUser = async () => {
    try {
      const user = {
        firstName,
        lastName,
        phoneNumber,
        username,
        initialBalance,
        password,
        role: 'USER', 
      };
      
      console.log("Sending registration request:", user); // Log the request payload
      const response = await bankingApi.register(user);
      console.log("Registration response:", response); // Log the response

      // Check for successful response (status code 201)
      if (response.status === 201) {
        console.log("Registration successful: ", response.data);
        return true; // Registration successful
      } else {
        console.log("Registration failed with status: ", response.status);
        return false; // Registration failed
      }
    } catch (error) {
      console.error("Registration error:", error); // Log the error
      handleLogError(error);
      return false; // Error occurred
    }
  };

  const formValidation = () => {
    // Check all inputs
    if (
      !firstName ||
      !lastName ||
      !phoneNumber ||
      !username ||
      !initialBalance ||
      !password ||
      !confirmPassword
    ) {
      alert("Please ensure all fields are filled in.");
      return false;
    }

    // Check passwords match
    if (password !== confirmPassword) {
      alert(
        "Please ensure the values entered for 'Password' and 'Confirm Password' match. Please try again."
      );
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted"); // Log form submission

    if (!formValidation()) {
      console.log("Form validation failed"); // Log validation failure
      return;
    }

    console.log("Creating user..."); // Log user creation
    const userCreated = await createUser();
    if (userCreated) {
      alert("Account created successfully!");
      navigate("/login");
    } else {
      alert("Error creating user. Please check your details or try a different username.");
    }
  };

  if (isLoggedIn) {
    console.log("User is already logged in, redirecting to /home"); // Log redirection
    return <Navigate to='/home' />;
  }

  return (
    <section className="vh-100 gradient-custom">
      <div className="container py-5 h-100">
        <div className="row justify-content-center align-items-center h-100">
          <div className="col-12 col-lg-9 col-xl-7">
            <div
              className="card shadow-2-strong"
              style={{ borderRadius: "15px" }}
            >
              <div className="card-body p-4 p-md-5">
                <h2 className="mb-4 pb-2 pb-md-0 mb-md-5">
                  Banking System Registration
                </h2>

                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-6 mb-4">
                      <div className="form-floating">
                        <input
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          type="text"
                          id="firstName"
                          className="form-control form-control-lg"
                          placeholder="First Name"
                        />
                        <label className="form-label" htmlFor="firstName">
                          First Name
                        </label>
                      </div>
                    </div>

                    <div className="col-md-6 mb-4">
                      <div className="form-floating">
                        <input
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          type="text"
                          id="lastName"
                          className="form-control form-control-lg"
                          placeholder="Last Name"
                        />
                        <label className="form-label" htmlFor="lastName">
                          Last Name
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-4">
                      <div className="form-floating">
                        <input
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          type="tel"
                          id="phoneNumber"
                          className="form-control form-control-lg"
                          placeholder="Phone no."
                        />
                        <label className="form-label" htmlFor="phoneNumber">
                          Phone no.
                        </label>
                      </div>
                    </div>

                    <div className="col-md-6 mb-4">
                      <div className="form-floating">
                        <input
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          type="text"
                          id="username"
                          className="form-control form-control-lg"
                          placeholder="Username"
                        />
                        <label className="form-label" htmlFor="username">
                          Username
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-4">
                      <div className="form-floating">
                        <input
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          type="password"
                          id="password"
                          className="form-control form-control-lg"
                          placeholder="Password"
                        />
                        <label className="form-label" htmlFor="password">
                          Password
                        </label>
                      </div>
                    </div>
                    <div className="col-md-6 mb-4">
                      <div className="form-floating">
                        <input
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          type="password"
                          id="confirmPassword"
                          className="form-control form-control-lg"
                          placeholder="Confirm Password"
                        />
                        <label className="form-label" htmlFor="confirmPassword">
                          Confirm Password
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-4">
                      <div className="form-floating">
                        <input
                          value={initialBalance}
                          onChange={(e) => setinitialBalance(e.target.value)}
                          type="number"
                          step="1000"
                          id="initialBalance"
                          className="form-control form-control-lg"
                          placeholder="Initial Balance"
                        />
                        <label className="form-label" htmlFor="initialBalance">
                          Initial Balance
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-2">
                    <button className="btn btn-secondary btn-lg" type="submit">
                      Register
                    </button>
                  </div>
                </form>
                <div className="mt-4 pt-2">
                  <button
                    className="btn btn-outline-secondary link-btn"
                    onClick={() => navigate("/login")}
                  >
                    Already have an account? Login here.
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Registration;