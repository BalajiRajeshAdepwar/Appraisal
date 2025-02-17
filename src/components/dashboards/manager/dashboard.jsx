import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAppraisals,
  approveAppraisal,
  fetchManagerHistory,
} from "../../redux/appraisalSlice";
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
import { logout } from "../../redux/authSlice";
import { useNavigate } from "react-router-dom";


const Manager = () => {
  const dispatch = useDispatch();
  const appraisals = useSelector((state) => state.appraisals.data);
  const finalizedAppraisals = useSelector((state) => state.appraisals.history);
  const [feedback, setFeedback] = useState({});
  const [disabled, setDisabled] = useState({});

  useEffect(() => {
    dispatch(fetchAppraisals("manager"));
    dispatch(fetchManagerHistory());
  }, [dispatch]);

  const dispatchLogout = useDispatch();
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem("isLoggedIn");

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/"); // Redirect to login if not authenticated
    }
  }, [isLoggedIn, navigate]);
  const handleApprove = async (id, employeeName, employeeId) => {
    const managerFeedback = feedback[id] || "";

    await dispatch(
      approveAppraisal({
        id,
        feedback: managerFeedback,
        employeeName,
        employeeId,
      })
    );

    setDisabled((prev) => ({ ...prev, [id]: true }));

    dispatch(fetchAppraisals("manager"));
    dispatch(fetchManagerHistory());

    setTimeout(() => {
      setDisabled((prev) => ({ ...prev, [id]: false }));
    }, 2000);
  };

  const userName = localStorage.getItem("userName");
  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("role");
    localStorage.removeItem("userName");
    dispatchLogout(logout()); 
    window.location.href = "/";
  };

  return (
    <Box className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <Typography className="dashboard-title">Manager Dashboard</Typography>
        <Typography className="user-name">Welcome, {userName}</Typography>
        <Button
          variant="contained"
          color="secondary"
          className="logout"
          onClick={handleLogout}
        >
          Logout
        </Button>
      </header>

      <Box className="section">
        <Typography variant="h6" gutterBottom>
          Pending Appraisals:
        </Typography>
        {appraisals.length > 0 ? (
          appraisals.map((a) => (
            <div key={a.id} className="appraisal-item">
              <Typography>🔹 Goal Title: {a.goalTitle}</Typography>
              <Typography>Goal Description: {a.goalDescription}</Typography>
              <Typography>Target Date: {a.targetDate}</Typography>
              <Typography>
                Employee: {a.employeeName} (ID: {a.employeeId})
              </Typography>
              <TextField
                label="Feedback"
                fullWidth
                margin="normal"
                value={feedback[a.id] || ""}
                onChange={(e) =>
                  setFeedback({ ...feedback, [a.id]: e.target.value })
                }
              />
              <Button
                variant="contained"
                color="primary"
                onClick={() =>
                  handleApprove(a.id, a.employeeName, a.employeeId)
                }
                disabled={disabled[a.id] || !feedback[a.id]}
              >
                Approve
              </Button>
            </div>
          ))
        ) : (
          <Typography>No pending appraisals.</Typography>
        )}
      </Box>

      <Box >
        <Typography variant="h6" gutterBottom>
          Finalized Appraisals:
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
                  <TableCell>Target Date</TableCell>
                  <TableCell>Feedback</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {finalizedAppraisals.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell>{a.employeeName}</TableCell>
                    <TableCell>{a.employeeId}</TableCell>
                    <TableCell>{a.goalTitle}</TableCell>
                    <TableCell>{a.goalDescription}</TableCell>
                    <TableCell>{a.targetDate}</TableCell>
                    <TableCell>{a.managerFeedback}</TableCell>
                    <TableCell>{a.status}</TableCell>
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

export default Manager;
