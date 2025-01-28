import { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import "./login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotPasswordDialogOpen, setForgotPasswordDialogOpen] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("http://localhost:5000/users")
      .then((response) => response.json())
      .then((data) => {
        const user = data.find(
          (user) => user.email === email && user.password === password
        );

        if (user) {
          localStorage.setItem("isLoggedIn", "true");
          localStorage.setItem("role", user.role);

          if (user.role === "employee") {
            navigate("/employee-dashboard");
          } else if (user.role === "manager") {
            navigate("/manager-dashboard");
          } else if (user.role === "admin") {
            navigate("/admin-dashboard");
          }
        } else {
          alert("Invalid credentials");
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const handleForgotPassword = () => {
    if (forgotEmail) {
      alert(`Password reset instructions sent to ${forgotEmail}`);
      setForgotPasswordDialogOpen(false);
      setForgotEmail("");
    } else {
      alert("Please enter a valid email");
    }
  };

  return (
    <>
      <h2 style={{ textAlign: "center", color: "blue" }}>Begin Your Appraisal</h2>
      <Container className="login-container">
        <Typography variant="h5" component="h1" align="center" gutterBottom>
          Login
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate className="login-form">
          <TextField
            fullWidth
            label="Email"
            type="email"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            required
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className="login-button"
          >
            Login
          </Button>
          <Button
            fullWidth
            variant="text"
            color="secondary"
            onClick={() => setForgotPasswordDialogOpen(true)}
          >
            Forgot Password?
          </Button>
        </Box>
      </Container>

      <Dialog
        open={forgotPasswordDialogOpen}
        onClose={() => setForgotPasswordDialogOpen(false)}
        className="dialog"
      >
        <DialogTitle>Forgot Password</DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            Enter your registered email address to reset your password.
          </Typography>
          <TextField
            fullWidth
            label="Email"
            type="email"
            variant="outlined"
            value={forgotEmail}
            onChange={(e) => setForgotEmail(e.target.value)}
            margin="normal"
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setForgotPasswordDialogOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleForgotPassword}
            variant="contained"
            color="primary"
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default Login;
