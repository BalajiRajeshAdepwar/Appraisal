
import store from "../store";
import { login } from "../authSlice";
import { addAppraisal, updateAppraisalAction } from "../appraisalSlice";
import { expect, test, describe, beforeEach } from "vitest";

describe("Redux store actions", () => {
  let dispatch;

  beforeEach(() => {
    dispatch = store.dispatch;
  });

  test("should update auth state", () => {
    const userData = { id: 1, name: "balaji" };
    dispatch(login(userData));

    const authState = store.getState().auth;
    expect(authState.user).toEqual(userData);
    expect(authState.isAuthenticated).toBe(true);
  });

  test("should update appraisals state", () => {
    const newAppraisal = { id: 1, title: "Goal 1", status: "Pending" };
    dispatch(addAppraisal(newAppraisal));

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
