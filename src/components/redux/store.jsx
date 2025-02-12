import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import appraisalReducer from "./appraisalSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    appraisals: appraisalReducer,
  },
});

export default store;
