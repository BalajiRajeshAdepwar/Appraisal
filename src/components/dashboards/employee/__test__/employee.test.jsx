import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { describe, test, beforeEach, expect, vi } from "vitest";
import configureStore from "redux-mock-store";
import Employee from "../dashboard"; 
import "@testing-library/jest-dom";
import { thunk } from "redux-thunk";

vi.mock("../../redux/appraisalSlice", () => ({
  submitAppraisal: vi.fn(),
  updateAppraisal: vi.fn(),
  fetchAppraisals: vi.fn(),
}));

const mockStore = configureStore([thunk]);

const renderWithProviders = (ui, { store } = {}) => {
  return render(
    <Provider store={store || mockStore({ appraisals: { data: [], history: [] } })}>
      <BrowserRouter>{ui}</BrowserRouter>
    </Provider>
  );
};

describe("Employee Component", () => {
  let store;
  beforeEach(() => {
    store = mockStore({
      appraisals: {
        data: [], 
        history: [], 
      },
    });
    store.dispatch = vi.fn();
  });

  test("renders employee dashboard", () => {
    renderWithProviders(<Employee user={{ id: "E123", managerId: "M456" }} />, { store });
    expect(screen.getByText(/Employee Dashboard/i)).toBeInTheDocument();
  });

  test("logs out and redirects to login page", () => {
    renderWithProviders(<Employee user={{ id: "E123", managerId: "M456" }} />, { store });

    fireEvent.click(screen.getByRole("button", { name: /Logout/i }));

    expect(store.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "auth/logout",
      })
    );
  });

  test("renders form fields to submit a new goal", () => {
    renderWithProviders(<Employee user={{ id: "E123", managerId: "M456" }} />, { store });

    expect(screen.getByLabelText(/Goal Title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Goal Description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Target Date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Self Review/i)).toBeInTheDocument();
  });

  test("renders pending appraisals when available", async () => {
    store = mockStore({
      appraisals: {
        data: [
          {
            id: 1,
            goalTitle: "Goal data",
            goalDescription: "Goal 1 Description",
            targetDate: "2025-02-20",
            selfReview: "Self Review for Goal 1",
            status: "Pending",
          },
        ],
        history: [],
      },
    });

    renderWithProviders(<Employee user={{ id: "E123", managerId: "M456" }} />, { store });
    await waitFor(() => expect(screen.getByText(/Goal data/i)).toBeInTheDocument());
  });

});
