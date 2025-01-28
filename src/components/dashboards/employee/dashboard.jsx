
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
} from "@mui/material";
import "./dashboard.css";

const EmployeeDashboard = () => {
  const [appraisals, setAppraisals] = useState([
    {
      goalTitle: "Complete Peject target",
      description: "Performed and developed.",
      managerFeedback: "Good performance",
      rating: 4.0,
    },
  ]);

  const [goal, setGoal] = useState({ title: "", description: "", date: "" });
  const [selfAssessment, setSelfAssessment] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setGoal((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitAll = () => {
    if (!goal.title || !goal.description || !goal.date || !selfAssessment) {
      alert("All fields are required!");
      return;
    }

    const newAppraisal = {
      goalTitle: goal.title,
      description: goal.description,
      managerFeedback: "Pending Review",
      rating: "N/A",
    };

    setAppraisals((prevAppraisals) => [...prevAppraisals, newAppraisal]);

    alert("Data submitted successfully to the reporting manager!");

    // Reset the form
    setGoal({ title: "", description: "", date: "" });
    setSelfAssessment("");
  };

  return (
    <Box className="dashboard-container">
      <Typography className="dashboard-title">Employee Dashboard</Typography>

      {/* Form Section */}
      <Box className="form-container" sx={{ "& > :not(style)": { m: 1 } }}>
        <Typography className="section-title">Set Goals</Typography>
        <TextField
          label="Goal Title"
          name="title"
          fullWidth
          className="text-field"
          value={goal.title}
          onChange={handleInputChange}
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
          onChange={handleInputChange}
          required
        />
        <TextField
          label="Target Date"
          type="date"
          name="date"
          fullWidth
          className="text-field"
          value={goal.date}
          onChange={handleInputChange}
          InputLabelProps={{
            shrink: true,
          }}
          required
        />
      </Box>

      <Box className="form-container" sx={{ "& > :not(style)": { m: 1 } }}>
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
      </Box>

      <Button
        variant="contained"
        color="primary"
        className="submit-button"
        onClick={handleSubmitAll}
      >
        Submit
      </Button>

      {/* Appraisal History Section */}
      <Box>
        <Typography className="section-title" sx={ { m: 3 }}>Appraisal History</Typography>
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






