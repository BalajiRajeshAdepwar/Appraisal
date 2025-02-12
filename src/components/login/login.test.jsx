import { render, screen} from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { describe, test, beforeEach, expect, vi } from "vitest";
import configureStore from "redux-mock-store";
import Login from "./login";
import "@testing-library/jest-dom";
1
vi.mock("../redux/authSlice", () => ({
  loginUser: vi.fn(),
}));

const mockStore = configureStore([]);

const renderWithProviders = (ui, { store } = {}) => {
  return render(
    <Provider store={store || mockStore({ auth: {} })}>
      <BrowserRouter>{ui}</BrowserRouter>
    </Provider>
  );
};

describe("Login Component", () => {
  let store;
  beforeEach(() => {
    store = mockStore({ auth: { error: null } });
    store.dispatch = vi.fn(); 
  });

  test("renders login form fields", () => {
    renderWithProviders(<Login />, { store });
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });
});
