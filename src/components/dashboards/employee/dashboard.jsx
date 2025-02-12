
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { submitAppraisal, updateAppraisal, fetchAppraisals } from "../../redux/appraisalSlice";
import { Box, Typography, Button, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogActions, DialogContent, DialogTitle, Grid } from "@mui/material";
import PropTypes from "prop-types";
import "./dashboard.css"; 

const Employee = ({ user }) => {
  const dispatch = useDispatch();
  const appraisals = useSelector((state) => state.appraisals.data);

  const [newGoal, setNewGoal] = useState({ goalTitle: "", goalDescription: "", targetDate: "" });
  const [editMode, setEditMode] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [actionType, setActionType] = useState("");

  useEffect(() => {
    dispatch(fetchAppraisals("employee"));
  }, [dispatch]);



  const handleSubmit = () => {
    setOpenModal(true);
    setActionType(editMode ? "update" : "submit");
  };

  const handleConfirm = () => {
    if (actionType === "update") {
      dispatch(updateAppraisal({ id: editMode, ...newGoal }));
    } else {
      dispatch(submitAppraisal({ 
        employeeId: user.id, 
        managerId: user.managerId, 
        ...newGoal, 
        status: "Pending", 
        managerFeedback: "", 
        rating: "" 
      }));
    }
    
    setNewGoal({ goalTitle: "", goalDescription: "", targetDate: "" });
    setEditMode(null);
    setOpenModal(false);
  };
  

  const userName = localStorage.getItem("userName");

  const handleClose = () => {
    setOpenModal(false);
  };

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
        <Typography className="dashboard-title">Employee Dashboard</Typography>
        <Typography className="user-name">Welcome, {userName}</Typography>
        <Button variant="contained" color="secondary" className="logout" onClick={handleLogout}>
          Logout
        </Button>
      </header>

      {/* Form Section */}
      <Grid container spacing={2} className="form-container">
        <Grid item xs={12}>
          <Typography variant="h5">{editMode ? "Edit Goal" : "Submit New Goal"}</Typography>
        </Grid>
        <Grid item xs={12}>
          <TextField label="Goal Title" fullWidth margin="normal" value={newGoal.goalTitle} onChange={(e) => setNewGoal({ ...newGoal, goalTitle: e.target.value })} className="text-field" />
        </Grid>
        <Grid item xs={12}>
          <TextField label="Goal Description" fullWidth margin="normal" value={newGoal.goalDescription} onChange={(e) => setNewGoal({ ...newGoal, goalDescription: e.target.value })} className="text-field" />
        </Grid>
        <Grid item xs={12}>
          <TextField label="Target Date" type="date" fullWidth margin="normal" InputLabelProps={{ shrink: true }} value={newGoal.targetDate} onChange={(e) => setNewGoal({ ...newGoal, targetDate: e.target.value })} className="text-field" />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Button variant="contained" color="primary" className="submit-button" fullWidth onClick={handleSubmit}>
            {editMode ? "Update" : "Submit"}
          </Button>
        </Grid>
      </Grid>

      {/* Appraisal History */}
      <Box className="appraisal-history-container">
        <TableContainer component={Paper} className="table-container">
          <Table>
            <TableHead className="table-header">
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Goal Title</TableCell>
                <TableCell>Goal Description</TableCell>
                <TableCell>Target Date</TableCell>
                <TableCell>Manager Review</TableCell>
                <TableCell>Actions</TableCell>
                <TableCell>Rating</TableCell>
                
              </TableRow>
            </TableHead>
            <TableBody>
              {appraisals.map((a) => (
                <TableRow key={a.id}>
                <TableCell>{a.id}</TableCell>
                <TableCell>{a.goalTitle}</TableCell>
                <TableCell>{a.goalDescription}</TableCell>
                <TableCell>{a.targetDate}</TableCell>
                <TableCell>{a.managerFeedback || "Pending"}</TableCell>
                <TableCell>{a.adminAction || "Pending"}</TableCell> {/* Show admin action here */}
                <TableCell>{a.rating|| "Pending"}</TableCell> {/* Show rating here */}
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

      {/* Confirmation Modal */}
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

      {/* Footer */}
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

