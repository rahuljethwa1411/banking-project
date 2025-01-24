import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import CreditCardFeature from "./pages/CreditCardFeature";
import LoginPage from "./pages/LoginPage";
import RegistrationPage from "./pages/RegistrationPage";
import WithdrawDeposit from "./pages/WithdrawDeposit";
import TransferPage from "./pages/TransferPage";
import ApplicationPage from './pages/ApplicationPage';
import BaseLayout from "./components/BaseLayout";
import AdminDashboard from "./pages/AdminDashboard"; // Import the AdminDashboard component
import { AuthProvider } from "./misc/AuthContext";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <Router>
          <Routes>
            <Route index element={<LoginPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/registration" element={<RegistrationPage />} />
            <Route path="/" element={<BaseLayout />}>
              <Route path="/home" element={<HomePage />} />
              <Route path="/credit-cards" element={<CreditCardFeature />} />
              <Route path="/withdraw-deposit" element={<WithdrawDeposit />} />
              <Route path="/transfer" element={<TransferPage />} />
              <Route path="/application" element={<ApplicationPage />} />
              {/* Add the AdminDashboard route */}
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
      <Toaster />
    </div>
  );
}

export default App;