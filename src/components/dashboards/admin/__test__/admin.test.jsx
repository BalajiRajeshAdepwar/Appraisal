import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { describe, test, beforeEach, expect, vi } from "vitest";
import configureStore from "redux-mock-store";
import Admin from "../dashboard"; 
import "@testing-library/jest-dom";
import { thunk } from "redux-thunk";

vi.mock("../redux/appraisalSlice", () => ({
  fetchAppraisals: vi.fn(),
  fetchAdminHistory: vi.fn(),
  finalizeAppraisal: vi.fn(),
}));

const mockStore = configureStore([thunk]);

const renderWithProviders = (ui, { store } = {}) => {
  return render(
    <Provider store={store || mockStore({ appraisals: { data: [], adminHistory: [] } })}>
      <BrowserRouter>{ui}</BrowserRouter>
    </Provider>
  );
};

describe("Admin Component", () => {
  let store;
  beforeEach(() => {
    store = mockStore({
      appraisals: {
        data: [], 
        adminHistory: [],
      },
    });
    store.dispatch = vi.fn();
  });

  test("renders admin dashboard", () => {
    renderWithProviders(<Admin />, { store });
    expect(screen.getByText(/Admin Dashboard/i)).toBeInTheDocument();
  });

  test("logs out and redirects to login page", () => {
    renderWithProviders(<Admin />, { store });

    fireEvent.click(screen.getByRole("button", { name: /Logout/i }));

    expect(store.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "auth/logout",
      })
    );
  });

  test("renders pending appraisals to finalize", async () => {
    store = mockStore({
      appraisals: {
        data: [
          {
            id: 1,
            goalTitle: "Goal Data",
            goalDescription: "Goal data Description",
            targetDate: "2025-02-20",
            employeeName: "Employee 1",
            employeeId: "E123",
            status: "Reviewed",
            managerFeedback: "Feedback for Goal 1",
          },
        ],
        adminHistory: [],
      },
    });

    renderWithProviders(<Admin />, { store });

    await waitFor(() => expect(screen.getByText(/Goal Data/i)).toBeInTheDocument());
  });

  test("shows message when no pending appraisals to finalize", () => {
    renderWithProviders(<Admin />, { store });
    expect(screen.getByText(/No pending finalize./i)).toBeInTheDocument();
  });
  test("renders finalized appraisals when available", () => {
    store = mockStore({
      appraisals: {
        data: [],
        adminHistory: [
          {
            id: 1,
            employeeName: "Employee 1",
            employeeId: "E123",
            goalTitle: "Goal data",
            goalDescription: "Goal data Description",
            adminAction: "Action 1",
            rating: "Excellent",
          },
        ],
      },
    });
  
    renderWithProviders(<Admin />, { store });
  
    const goalDataCell = screen.getByText(/Goal data Description/i);
    const actionCell = screen.getByText(/Action 1/i);
    const ratingCell = screen.getByText(/Excellent/i);
    
    expect(goalDataCell).toBeInTheDocument();
    expect(actionCell).toBeInTheDocument();
    expect(ratingCell).toBeInTheDocument();
  });
  
  test("shows message when no finalized appraisals are available", () => {
    renderWithProviders(<Admin />, { store });
    expect(screen.getByText(/No finalized appraisals to display./i)).toBeInTheDocument();
  });

});
