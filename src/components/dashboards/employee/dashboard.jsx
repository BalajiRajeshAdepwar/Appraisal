import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
} from "@mui/material";
import "./dashboard.css";

const EmployeeDashboard = () => {
  const [appraisals] = useState([
    {
      goalTitle: "Complete Q1 sales target",
      description: "Achieve $50,000 in sales.",
      managerFeedback: "Excellent performance",
      rating: 4.5,
    },
  ]);

  const [goal, setGoal] = useState({ title: "", description: "", date: "" });
  const [selfAssessment, setSelfAssessment] = useState("");
  const [progress, setProgress] = useState(false);

  const handleGoalChange = (e) => {
    const { name, value } = e.target;
    setGoal((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitGoal = () => {
    if (!goal.title || !goal.description || !goal.date) {
      alert("All fields in Set Goals are required!");
      return;
    }
    alert("Goal submitted successfully!");
    setGoal({ title: "", description: "", date: "" });
  };

  const handleSubmitAssessment = () => {
    if (!selfAssessment) {
      alert("Performance Summary is required!");
      return;
    }
    setProgress(true); // Show progress indicator
    setTimeout(() => {
      alert("Self-Assessment submitted successfully!");
      setProgress(false); // Hide progress indicator
      setSelfAssessment("");
    }, 2000);
  };

  return (
    <Box className="dashboard-container">
      <Typography className="dashboard-title">Employee Dashboard</Typography>

      {/* Set Goals Section */}
      <Box className="form-container">
        <Typography className="section-title">Set Goals</Typography>
        <TextField
          label="Goal Title"
          name="title"
          fullWidth
          className="text-field"
          value={goal.title}
          onChange={handleGoalChange}
          required
        />
        <TextField
          label="Description"
          name="description"
          multiline
          rows={4}
          fullWidth
          className="text-field"
          value={goal.description}
          onChange={handleGoalChange}
          required
        />
        <TextField
          label="Target Date"
          type="date"
          name="date"
          fullWidth
          className="text-field"
          value={goal.date}
          onChange={handleGoalChange}
          InputLabelProps={{
            shrink: true,
          }}
          required
        />
        <Button
          variant="contained"
          color="primary"
          className="submit-button"
          onClick={handleSubmitGoal}
        >
          Submit Goal
        </Button>
      </Box>

      {/* Self-Assessment Section */}
      <Box className="form-container">
        <Typography className="section-title">Self-Assessment</Typography>
        <TextField
          label="Performance Summary"
          multiline
          rows={4}
          fullWidth
          className="text-field"
          value={selfAssessment}
          onChange={(e) => setSelfAssessment(e.target.value)}
          required
        />
        <Button
          variant="contained"
          color="secondary"
          className="submit-button"
          onClick={handleSubmitAssessment}
        >
          Submit Assessment
        </Button>
        {progress && (
          <Box className="alert-message">
            <CircularProgress size={20} /> Submitting...
          </Box>
        )}
      </Box>

      {/* Appraisal History Section */}
      <Box>
        <Typography className="section-title">Appraisal History</Typography>
        <TableContainer component={Paper} className="table-container">
          <Table>
            <TableHead>
              <TableRow className="table-header">
                <TableCell>Goal Title</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Manager Feedback</TableCell>
                <TableCell>Rating</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {appraisals.map((appraisal, index) => (
                <TableRow key={index} className="table-row">
                  <TableCell>{appraisal.goalTitle}</TableCell>
                  <TableCell>{appraisal.description}</TableCell>
                  <TableCell>{appraisal.managerFeedback}</TableCell>
                  <TableCell>{appraisal.rating}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default EmployeeDashboard;
