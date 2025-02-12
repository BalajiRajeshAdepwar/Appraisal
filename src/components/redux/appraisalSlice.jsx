import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:5000";

// ✅ Fetch Appraisals based on Role
export const fetchAppraisals = createAsyncThunk(
  "appraisals/fetchAppraisals",
  async (role, { getState }) => {
    const userId = getState().auth.user?.id;
    let url = `${API_URL}/appraisals`;

    if (role === "employee") url += `?employeeId=${userId}`;
    if (role === "manager") url += `?managerId=${userId}&status=Pending`; 
    if (role === "admin") url += `?status=Reviewed`; 

    const { data: appraisals } = await axios.get(url);
    const { data: users } = await axios.get(`${API_URL}/users`); 

    return appraisals.map((appraisal) => ({
      ...appraisal,
      employeeName: users.find((user) => user.id === appraisal.employeeId)?.name || "Unknown",
    }));
  }
);

// ✅ Submit a new appraisal
export const submitAppraisal = createAsyncThunk(
  "appraisals/submitAppraisal",
  async (newGoal) => {
    const { data } = await axios.post(`${API_URL}/appraisals`, newGoal);
    return data;
  }
);

// ✅ Update an appraisal (Employee Edit)
export const updateAppraisal = createAsyncThunk(
  "appraisals/updateAppraisal",
  async ({ id, ...updates }) => {
    await axios.patch(`${API_URL}/appraisals/${id}`, updates);
    return { id, updates };
  }
);

export const approveAppraisal = createAsyncThunk(
  "appraisals/approveAppraisal",
  async ({ id, feedback }, { getState }) => {
    const { data: appraisal } = await axios.get(`${API_URL}/appraisals/${id}`);
    const managerId = getState().auth.user.id;

    const updatedAppraisal = {
      ...appraisal,
      status: "Reviewed",
      managerFeedback: feedback,
      managerId,
    };

    await axios.patch(`${API_URL}/appraisals/${id}`, updatedAppraisal);
    await axios.post(`${API_URL}/finalizedApprovals`, updatedAppraisal);

    return updatedAppraisal;
  }
);

export const finalizeAppraisal = createAsyncThunk(
  "appraisals/finalizeAppraisal",
  async ({ id, rating, adminAction, employeeName, employeeId }) => {
    const { data: appraisal } = await axios.get(`http://localhost:5000/appraisals/${id}`);

    const updatedAppraisal = {
      ...appraisal,
      status: "Finalized",
      rating,
      adminAction,
      employeeName, 
      employeeId,
    };

    // Save to `adminHistory` (so admins can see finalized records)
    await axios.post("http://localhost:5000/adminHistory", updatedAppraisal);

    // Ensure employees can see it in history by keeping it in `appraisals`
    await axios.patch(`http://localhost:5000/appraisals/${id}`, {
      status: "Finalized",
      rating: rating,  
      adminAction: adminAction  
    });
    
    return updatedAppraisal;
  }
);



export const fetchEmployeeHistory = createAsyncThunk(
  "appraisals/fetchEmployeeHistory",
  async (_, { getState }) => {
    const userId = getState().auth.user.id;
    const { data } = await axios.get(`${API_URL}/adminHistory?employeeId=${userId}`);

    return data.map((appraisal) => ({
      ...appraisal,
      managerFeedback: appraisal.managerFeedback || "Pending",
      rating: appraisal.rating || "Pending",
      adminAction: appraisal.adminAction || "Pending",
    }));
  }
);


export const fetchAdminHistory = createAsyncThunk(
  "appraisals/fetchAdminHistory",
  async () => {
    const { data } = await axios.get("http://localhost:5000/adminHistory");
    return data;
  }
);

export const fetchManagerHistory = createAsyncThunk(
  "appraisals/fetchManagerHistory",
  async (_, { getState }) => {
    const userId = getState().auth.user.id;
    const { data: appraisals } = await axios.get(`${API_URL}/finalizedApprovals`);
    const { data: users } = await axios.get(`${API_URL}/users`);

    return appraisals
      .filter((appraisal) => appraisal.managerId === userId)
      .map((appraisal) => ({
        ...appraisal,
        employeeName: users.find((user) => user.id === appraisal.employeeId)?.name || "Unknown",
      }));
  }
);

const appraisalSlice = createSlice({
  name: "appraisals",
  initialState: {
    data: [],
    history: [],
    loading: false,
    finalizedApprovals: [],
    adminHistory: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAppraisals.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(fetchManagerHistory.fulfilled, (state, action) => {
        state.history = action.payload;
      })
      .addCase(fetchEmployeeHistory.fulfilled, (state, action) => {
        state.history = action.payload;
      })
      .addCase(fetchAdminHistory.fulfilled, (state, action) => {
        state.adminHistory = action.payload;
      })
      .addCase(submitAppraisal.fulfilled, (state, action) => {
        state.data.push(action.payload);
      })
      .addCase(updateAppraisal.fulfilled, (state, action) => {
        const { id, updates } = action.payload;
        state.data = state.data.map((goal) =>
          goal.id === id ? { ...goal, ...updates } : goal
        );
      })
      .addCase(approveAppraisal.fulfilled, (state, action) => {
        state.data = state.data.map((appraisal) =>
          appraisal.id === action.payload.id ? { ...appraisal, ...action.payload } : appraisal
        );
        state.finalizedApprovals.push(action.payload);
      })
      .addCase(finalizeAppraisal.fulfilled, (state, action) => {
        state.data = state.data.filter((a) => a.id !== action.payload.id);
        state.finalizedApprovals.push(action.payload);
      });
  },
});

export default appraisalSlice.reducer;
