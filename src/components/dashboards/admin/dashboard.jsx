import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAppraisals, finalizeAppraisal, fetchAdminHistory } from "../../redux/appraisalSlice";
import {
  Box,
  Typography,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import "./dashboard.css";

const Admin = () => {
  const dispatch = useDispatch();
  const appraisals = useSelector((state) => state.appraisals.data);
  const finalizedAppraisals = useSelector((state) => state.appraisals.adminHistory);
  const [adminActions, setAdminActions] = useState({});
  const [ratings, setRatings] = useState({});
  const [disabled, setDisabled] = useState({});

  useEffect(() => {
    dispatch(fetchAppraisals("admin"));
    dispatch(fetchAdminHistory());
  }, [dispatch]);

  const handleFinalize = async (id, employeeName, employeeId) => {
    const rating = ratings[id] || "Pending";
    const adminAction = adminActions[id] || "Pending";

    await dispatch(finalizeAppraisal({ id, rating, adminAction, employeeName, employeeId }));

    setDisabled((prev) => ({ ...prev, [id]: true }));

    dispatch(fetchAppraisals("admin"));
    dispatch(fetchAdminHistory());

    setTimeout(() => {
      setDisabled((prev) => ({ ...prev, [id]: false }));
    }, 2000);
  };

  const userName = localStorage.getItem("userName");
  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("role");
    localStorage.removeItem("userName");
    window.location.href = "/";
  };

  return (
    <Box className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <Typography className="dashboard-title">Admin Dashboard</Typography>
        <Typography className="user-name">Welcome, {userName}</Typography>
        <Button variant="contained" color="secondary" className="logout" onClick={handleLogout}>
          Logout
        </Button>
      </header>

      {/* Pending Appraisals Section */}
      <Box className="section">
        <Typography variant="h6" gutterBottom>
          Appraisals to Finalize:
        </Typography>
        {appraisals.length > 0 ? (
          appraisals
            .filter((a) => a.status === "Reviewed") // Show only "Reviewed" appraisals
            .filter((a) => !finalizedAppraisals.some((f) => f.id === a.id)) // Exclude finalized ones
            .map((a) => (
              <div key={a.id} className="appraisal-item">
                <Typography>Employee: {a.employeeName} (ID: {a.employeeId})</Typography>
                <Typography> {a.goalTitle} - <strong>{a.status}</strong></Typography>
                <Typography>Manager Feedback: {a.managerFeedback || "No feedback provided"}</Typography>
                <TextField
                  label="Admin Action"
                  fullWidth
                  margin="normal"
                  value={adminActions[a.id] || ""}
                  onChange={(e) => setAdminActions({ ...adminActions, [a.id]: e.target.value })}
                />
                <TextField
                  label=" Rating"
                  fullWidth
                  margin="normal"
                  value={ratings[a.id] || ""}
                  onChange={(e) => setRatings({ ...ratings, [a.id]: e.target.value })}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleFinalize(a.id, a.employeeName, a.employeeId)}
                  disabled={disabled[a.id] || !ratings[a.id]}
                >
                  Finalize Appraisal
                </Button>
              </div>
            ))
        ) : (
          <Typography>No pending finalize.</Typography>
        )}
      </Box>

      {/* Finalized Appraisals Section */}
      <Box className="section">
        <Typography variant="h6" gutterBottom>
          Admin History:
        </Typography>
        {finalizedAppraisals.length > 0 ? (
          <TableContainer component={Paper} className="table-container">
            <Table>
              <TableHead className="table-header">
                <TableRow>
                  <TableCell>Employee Name</TableCell>
                  <TableCell>Employee ID</TableCell>
                  <TableCell>Goal Title</TableCell>
                  <TableCell>Goal Description</TableCell>
                  <TableCell>Admin Action</TableCell>
                  <TableCell>Rating</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {finalizedAppraisals.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell>{a.employeeName}</TableCell>
                    <TableCell>{a.employeeId}</TableCell>
                    <TableCell>{a.goalTitle}</TableCell>
                    <TableCell>{a.goalDescription}</TableCell>
                    <TableCell>{a.adminAction}</TableCell>
                    <TableCell>{a.rating}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography>No finalized appraisals to display.</Typography>
        )}
      </Box>

      {/* Footer */}
      <footer className="dashboard-footer">
        <Typography>© 2025 Appraisal System</Typography>
      </footer>
    </Box>
  );
};

export default Admin;