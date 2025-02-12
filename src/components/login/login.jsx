import { useState } from "react";
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
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../redux/authSlice";
import "./login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotPasswordDialogOpen, setForgotPasswordDialogOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const error = useSelector((state) => state.auth.error);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const result = await dispatch(loginUser({ email, password })).unwrap();
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("role", result.role);
      localStorage.setItem("userName", result.name);
      navigate(`/${result.role}`);
    } catch (err) {
      console.error("Login failed:", err);
    }
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
      <h2 className="login-title" >Begin Your Appraisal</h2>
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
    </>
  );
};

export default Login;
