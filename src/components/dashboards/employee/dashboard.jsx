import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { submitAppraisal, updateAppraisal, fetchAppraisals } from "../../redux/appraisalSlice";
import { Box, Typography, Button, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import PropTypes from "prop-types";
import "./dashboard.css";
import {Grid} from '@mui/material/Grid';
import { logout } from "../../redux/authSlice";


const Employee = ({ user }) => {
  const dispatch = useDispatch();
  const appraisals = useSelector((state) => state.appraisals.data);

  const [newGoal, setNewGoal] = useState({ 
    goalTitle: "", 
    goalDescription: "", 
    targetDate: "", 
    selfReview: "" 
  });
  const [editMode, setEditMode] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [actionType, setActionType] = useState("");
  const [errors, setErrors] = useState({ 
    goalTitle: false, 
    goalDescription: false, 
    targetDate: false, 
    selfReview: false 
  });

  const dispatchLogout = useDispatch();
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem("isLoggedIn");

  useEffect(() => {
    dispatch(fetchAppraisals("employee"));
  }, [dispatch]);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/"); 
    }
  }, [isLoggedIn, navigate]);

  const handleSubmit = () => {
    const newErrors = {
      goalTitle: !newGoal.goalTitle,
      goalDescription: !newGoal.goalDescription,
      targetDate: !newGoal.targetDate,
      selfReview: !newGoal.selfReview,
    };

    setErrors(newErrors);

    if (newErrors.goalTitle || newErrors.goalDescription || newErrors.targetDate || newErrors.selfReview) {
      return;
    }

    setOpenModal(true);
    setActionType(editMode ? "update" : "submit");
  };

  const handleConfirm = () => {
    if (actionType === "update") {
      dispatch(updateAppraisal({ id: editMode, ...newGoal }));
    } else {
      const submittedDate = new Date().toISOString().split("T")[0]; // Format: YYYY-MM-DD
      dispatch(submitAppraisal({ 
        employeeId: user.id, 
        managerId: user.managerId, 
        ...newGoal, 
        status: "Pending", 
        managerFeedback: "", 
        rating: "",
        submittedDate 
      }));
    }

    setNewGoal({ goalTitle: "", goalDescription: "", targetDate: "", selfReview: "" });
    setEditMode(null);
    setOpenModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewGoal({ ...newGoal, [name]: value });

    if (value.trim()) {
      setErrors({ ...errors, [name]: false });
    }
  };

  const userName = localStorage.getItem("userName");

  const handleClose = () => {
    setOpenModal(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("role");
    localStorage.removeItem("userName");
    dispatchLogout(logout()); 
  };

  return (
    <Box className="dashboard-container">
      <header className="dashboard-header">
        <Typography className="dashboard-title">Employee Dashboard</Typography>
        <Typography className="user-name">Welcome, {userName}</Typography>
        <Button variant="contained" color="secondary" className="logout" onClick={handleLogout}>
          Logout
        </Button>
      </header>

      <Grid container spacing={2} className="form-container">
        <Grid item xs={12}>
          <Typography variant="h5">{editMode ? "Edit Goal" : "Submit New Goal"}</Typography>
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Goal Title"
            fullWidth
            margin="normal"
            name="goalTitle"
            value={newGoal.goalTitle}
            onChange={handleInputChange}
            className="text-field"
            required
            error={errors.goalTitle}
            helperText={errors.goalTitle ? "This field is required" : ""}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Goal Description"
            fullWidth
            margin="normal"
            name="goalDescription"
            value={newGoal.goalDescription}
            onChange={handleInputChange}
            className="text-field"
            required
            error={errors.goalDescription}
            helperText={errors.goalDescription ? "This field is required" : ""}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Target Date"
            type="date"
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            name="targetDate"
            value={newGoal.targetDate}
            onChange={handleInputChange}
            className="text-field"
            required
            error={errors.targetDate}
            helperText={errors.targetDate ? "This field is required" : ""}
            inputProps={{
              min: new Date().toISOString().split("T")[0], 
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Self Review"
            fullWidth
            margin="normal"
            name="selfReview"
            value={newGoal.selfReview}
            onChange={handleInputChange}
            className="text-field"
            required
            error={errors.selfReview}
            helperText={errors.selfReview ? "This field is required" : ""}
            multiline
            rows={4}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Button variant="contained" color="primary" className="submit-button" fullWidth onClick={handleSubmit}>
            {editMode ? "Update" : "Submit"}
          </Button>
        </Grid>
      </Grid>

      <Box className="appraisal-history-container">
        <TableContainer component={Paper} className="table-container">
          <Table>
            <TableHead className="table-header">
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Goal Title</TableCell>
                <TableCell>Goal Description</TableCell>
                <TableCell>Submitted Date</TableCell>
                <TableCell>Target Date</TableCell>
                <TableCell>Self Review</TableCell>
                <TableCell>Manager Review</TableCell>
                <TableCell>Admin Action</TableCell>
                <TableCell>Rating</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {appraisals.map((a) => (
                <TableRow key={a.id}>
                  <TableCell>{a.id}</TableCell>
                  <TableCell>{a.goalTitle}</TableCell>
                  <TableCell>{a.goalDescription}</TableCell>
                  <TableCell>{a.submittedDate || "N/A"}</TableCell>
                  <TableCell>{a.targetDate}</TableCell>
                  <TableCell>{a.selfReview || "Pending"}</TableCell>
                  <TableCell>{a.managerFeedback || "Pending"}</TableCell>
                  <TableCell>{a.adminAction || "Pending"}</TableCell>
                  <TableCell>{a.rating || "Pending"}</TableCell>
                  <TableCell>
                    {a.status === "Pending" && (
                      <Button variant="outlined" onClick={() => { setEditMode(a.id); setNewGoal(a); }}>Edit</Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Dialog open={openModal} onClose={handleClose}>
        <DialogTitle>Confirm {actionType === "update" ? "Update" : "Submit"} Goal</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Are you sure you want to {actionType === "update" ? "update" : "submit"} this goal?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">Cancel</Button>
          <Button onClick={handleConfirm} color="primary">Confirm</Button>
        </DialogActions>
      </Dialog>

      <footer className="dashboard-footer">
        <Typography>© 2025 Appraisal System | All Rights Reserved</Typography>
      </footer>
    </Box>
  );
};

Employee.propTypes = {
  user: PropTypes.object.isRequired,
};

export default Employee;