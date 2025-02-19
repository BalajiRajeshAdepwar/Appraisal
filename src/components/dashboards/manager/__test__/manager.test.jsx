import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { describe, test, beforeEach, expect, vi } from "vitest";
import configureStore from "redux-mock-store";
import Manager from "../dashboard"; // Import your manager component
import "@testing-library/jest-dom";
import { thunk } from "redux-thunk";

vi.mock("../redux/managerSlice", () => ({
  fetchAppraisals: vi.fn(),
  approveAppraisal: vi.fn(),
}));

const mockStore = configureStore([thunk]);

const renderWithProviders = (ui, { store } = {}) => {
  return render(
    <Provider store={store || mockStore({ appraisals: { data: [], history: [] } })}>
      <BrowserRouter>{ui}</BrowserRouter>
    </Provider>
  );
};

describe("Manager Component", () => {
  let store;
  beforeEach(() => {
    store = mockStore({
      appraisals: {
        data: [], // Initial empty state for data
        history: [], // Initial empty state for history
      },
    });
    store.dispatch = vi.fn();
  });

  test("renders manager dashboard", () => {
    renderWithProviders(<Manager />, { store });
    expect(screen.getByText(/Manager Dashboard/i)).toBeInTheDocument();
  });

  test("logs out and redirects to login page", () => {
    renderWithProviders(<Manager />, { store });

    fireEvent.click(screen.getByRole("button", { name: /Logout/i }));

    expect(store.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "auth/logout",
      })
    );
  });

  test("renders pending appraisals when available", async () => {
    store = mockStore({
      appraisals: {
        data: [
          {
            id: 1,
            goalTitle: "Goal Data",
            goalDescription: "Goal 1 Description",
            targetDate: "2025-02-20",
            employeeName: "Employee 1",
            employeeId: "E123",
          },
        ],
        history: [],
      },
    });
  
    renderWithProviders(<Manager />, { store });
  
    // Wait for the component to render and ensure the goal title is shown
    await waitFor(() => expect(screen.getByText(/Goal Data/i)).toBeInTheDocument());
  });
  

  test("shows message when no pending appraisals are available", () => {
    renderWithProviders(<Manager />, { store });
    expect(screen.getByText(/No pending appraisals./i)).toBeInTheDocument();
  });

  test("renders finalized appraisals when available", () => {
    store = mockStore({
      appraisals: {
        data: [],
        history: [
          {
            id: 1,
            employeeName: "Employee 1",
            employeeId: "E123",
            goalTitle: "Goal 1",
            goalDescription: "Goal 1 Description",
            targetDate: "2025-02-20",
            managerFeedback: "Feedback for Goal 1",
            status: "Finalized",
          },
        ],
      },
    });

    renderWithProviders(<Manager />, { store });
    expect(screen.getByText(/Feedback for Goal 1/i)).toBeInTheDocument();
  });

  test("shows message when no finalized appraisals are available", () => {
    renderWithProviders(<Manager />, { store });
    expect(screen.getByText(/No finalized appraisals to display./i)).toBeInTheDocument();
  });
});
