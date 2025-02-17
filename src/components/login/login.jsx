import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../redux/authSlice";
import {
  TextField,
  Button,
  Typography,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import "./login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [forgotEmail, setForgotEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [forgotPasswordDialogOpen, setForgotPasswordDialogOpen] = useState(false);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const error = useSelector((state) => state.auth.error);
  const isLoggedIn = localStorage.getItem("isLoggedIn");

  // Redirect if already logged in
  useEffect(() => {
    if (isLoggedIn) {
      const role = localStorage.getItem("role");
      navigate(`/${role}`);
    }
  }, [isLoggedIn, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const result = await dispatch(loginUser({ email, password })).unwrap();
      navigate(`/${result.role}`);
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  // Handle Forgot Password: Verify Email
  const handleForgotPassword = async () => {
    const response = await fetch("http://localhost:5000/users");
    const users = await response.json();
    const user = users.find((u) => u.email === forgotEmail);

    if (user) {
      localStorage.setItem("resetEmail", forgotEmail);
      setForgotPasswordDialogOpen(false);
      setResetDialogOpen(true);
    } else {
      alert("Email not found!");
    }
  };

  // Handle Reset Password
  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const email = localStorage.getItem("resetEmail");
    const response = await fetch("http://localhost:5000/users");
    const users = await response.json();
    const user = users.find((u) => u.email === email);

    if (user) {
      await fetch(`http://localhost:5000/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: newPassword }),
      });

      alert("Password updated successfully!");
      setResetDialogOpen(false);
      localStorage.removeItem("resetEmail");
    } else {
      alert("Something went wrong. Try again!");
    }
  };

  return (
    <>
      <h2 className="login-title">Begin Your Appraisal</h2>
      <Box className="login-container">
        <Typography variant="h5" align="center" gutterBottom>
          Login
        </Typography>
        {error && <Typography color="error" align="center">{error}</Typography>}
        <Box component="form" onSubmit={handleLogin} className="login-form">
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
          <Button type="submit" fullWidth variant="contained" color="primary" className="login-button">
            Login
          </Button>
          <Button fullWidth variant="text" color="secondary" onClick={() => setForgotPasswordDialogOpen(true)}>
            Forgot Password?
          </Button>
        </Box>
      </Box>

      {/* Forgot Password Dialog */}
      <Dialog open={forgotPasswordDialogOpen} onClose={() => setForgotPasswordDialogOpen(false)} className="dialog">
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
          <Button onClick={handleForgotPassword} variant="contained" color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reset Password Dialog */}
      <Dialog open={resetDialogOpen} onClose={() => setResetDialogOpen(false)} className="dialog">
        <DialogTitle>Reset Password</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="New Password"
            type="password"
            variant="outlined"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Confirm Password"
            type="password"
            variant="outlined"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            margin="normal"
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setResetDialogOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleResetPassword} variant="contained" color="primary">
            Reset Password
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Login;
