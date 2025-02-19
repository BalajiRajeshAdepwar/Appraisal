
import store from "../store"; // Import the store
import { login } from "../authSlice";
import { addAppraisal, updateAppraisalAction } from "../appraisalSlice";
import { expect, test, describe, beforeEach } from "vitest";

// Wrap the tests in a describe block for better structure
describe("Redux store actions", () => {
  let dispatch;

  beforeEach(() => {
    dispatch = store.dispatch;
  });

  test("should update auth state", () => {
    const userData = { id: 1, name: "balaji" };
    dispatch(login(userData));

    // Check if auth state is updated correctly
    const authState = store.getState().auth;
    expect(authState.user).toEqual(userData);
    expect(authState.isAuthenticated).toBe(true);
  });

  test("should update appraisals state", () => {
    const newAppraisal = { id: 1, title: "Goal 1", status: "Pending" };
    dispatch(addAppraisal(newAppraisal));

    // Check if appraisal state is updated correctly
    const appraisalState = store.getState().appraisals.data;
    expect(appraisalState).toContainEqual(newAppraisal);
  });

  test("should update appraisal on dispatching updateAppraisal", () => {
    const newAppraisal = { id: 1, title: "Goal 1", status: "Pending" };
    dispatch(addAppraisal(newAppraisal));

    const updatedAppraisal = { id: 1, title: "Updated Goal", status: "Pending" };
    dispatch(updateAppraisalAction({ id: 1, updates: updatedAppraisal }));

    const appraisalState = store.getState().appraisals.data;
    expect(appraisalState).toContainEqual(expect.objectContaining({ id: 1, title: "Updated Goal" }));
  });
});
