import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const loginUser = createAsyncThunk("auth/loginUser", async (credentials, { rejectWithValue }) => {
  try {
    const { data: users } = await axios.get("http://localhost:5000/users");
    const user = users.find((u) => u.email === credentials.email && u.password === credentials.password);

    if (!user) throw new Error("Invalid credentials");

    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("isLoggedIn", "true"); // Add isLoggedIn flag
    localStorage.setItem("role", user.role); // Add role
    localStorage.setItem("userName", user.name); // Add userName

    return user;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState: { user: JSON.parse(localStorage.getItem("user")) || null, error: null },
  reducers: {
    logout: (state) => {
      state.user = null;
      localStorage.removeItem("user");
      localStorage.removeItem("isLoggedIn"); // Remove isLoggedIn flag
      localStorage.removeItem("role"); // Remove role
      localStorage.removeItem("userName"); // Remove userName
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;