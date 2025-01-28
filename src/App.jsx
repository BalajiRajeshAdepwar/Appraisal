import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Login from "./components/login/login";
import EmployeeDashboard from "./components/dashboards/employee/dashboard";
import ManagerDashboard from "./components/dashboards/manager/dashboard";
import AdminDashboard from "./components/dashboards/admin/dashboard";

// eslint-disable-next-line react/prop-types
const ProtectedRoute = ({children, role} ) => {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const userRole = localStorage.getItem("role");

  if (!isLoggedIn) {
    return <Navigate to="/" />;
  }

  if (role && role !== userRole) {
    return <Navigate to="/" />;
  }

  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/employee-dashboard"
          element={
            <ProtectedRoute role="employee">
              <EmployeeDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manager-dashboard"
          element={
            <ProtectedRoute role="manager">
              <ManagerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
