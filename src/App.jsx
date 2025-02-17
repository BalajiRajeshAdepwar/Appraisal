import { useEffect, useState, lazy, Suspense } from "react";
import { Routes, Route, Navigate, BrowserRouter, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import Login from "./components/login/login";
import NotFound from "./components/dashboards/notfound/Notfound";

// Lazy load the dashboards
const Employee = lazy(() => import("./components/dashboards/employee/dashboard"));
const Manager = lazy(() => import("./components/dashboards/manager/dashboard"));
const Admin = lazy(() => import("./components/dashboards/admin/dashboard"));

const App = () => {
  const reduxUser = useSelector((state) => state.auth.user);
  const [user, setUser] = useState(reduxUser || JSON.parse(localStorage.getItem("user")));
  const location = useLocation();

  useEffect(() => {
    if (reduxUser) {
      setUser(reduxUser);
    } else {
      // Clear local storage if no user is found
      localStorage.removeItem("user");
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("role");
      localStorage.removeItem("userName");
      setUser(null);
    }
  }, [reduxUser]);

  // Redirect to login if user is not authenticated
  if (!user && location.pathname !== "/") {
    return <Navigate to="/" />;
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/employee"
          element={user?.role === "employee" ? <Employee user={user} /> : <Navigate to="/" />}
        />
        <Route
          path="/manager"
          element={user?.role === "manager" ? <Manager user={user} /> : <Navigate to="/" />}
        />
        <Route
          path="/admin"
          element={user?.role === "admin" ? <Admin user={user} /> : <Navigate to="/" />}
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

const AppWrapper = () => (
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

export default AppWrapper;