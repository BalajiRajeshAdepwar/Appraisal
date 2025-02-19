import { fireEvent, render, screen, waitFor} from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { describe, test, beforeEach, expect, vi } from "vitest";
import configureStore from "redux-mock-store";
import Login from "../login";
import "@testing-library/jest-dom";

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
    expect(screen.getByRole("button", { name: /Forgot Password?/i })).toBeInTheDocument();

  });

  test("displays login error message when login fails", async () => {
    store = mockStore({ auth: { error: "Invalid credentials" } });
    renderWithProviders(<Login />, { store });

    expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
  });

  test("dispatches login action on form submission", async () => {
    renderWithProviders(<Login />, { store });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "balaji.a@gmail.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));
    await waitFor(() => {
      expect(store.dispatch).toHaveBeenCalled();
    });
  });

  test("redirects to the role-specific page if already logged in", () => {
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("role", "admin");
    renderWithProviders(<Login />, { store });
    expect(window.location.pathname).toBe("/admin");
  });

  test("displays alert if forgot password email is not found", async () => {
    window.alert = vi.fn();
    window.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve([]), 
      })
    );
  
    renderWithProviders(<Login />, { store });
      fireEvent.click(screen.getByText(/Forgot Password?/i));
      await waitFor(() => {
      expect(screen.getByText(/Enter your registered email address/i)).toBeInTheDocument();
    });
    const emailInput = screen.getByRole("textbox", { name: /email/i });
    fireEvent.change(emailInput, { target: { value: "notfound@example.com" } });
      fireEvent.click(screen.getByRole("button", { name: /Submit/i }));
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Email not found!");
    });
  });

  test("displays alert if forgot password email is not found", async () => {
    window.alert = vi.fn();
      window.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve([]), 
      })
    );
  
    renderWithProviders(<Login />, { store });
  
    fireEvent.click(screen.getByText(/Forgot Password?/i));
  
    await waitFor(() => {
      expect(screen.getByText(/Enter your registered email address/i)).toBeInTheDocument();
    });
    const emailInput = screen.getByRole("textbox", { name: /email/i });
    fireEvent.change(emailInput, { target: { value: "notfound@example.com" } });
    fireEvent.click(screen.getByRole("button", { name: /Submit/i }));
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Email not found!");
    });
  });

  test("opens reset password dialog if email is found", async () => {
    window.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve([{ email: "user@example.com", id: 1 }]),
      })
    );
    renderWithProviders(<Login />, { store });
    fireEvent.click(screen.getByText(/Forgot Password?/i));
    await waitFor(() => {
      expect(screen.getByText(/Enter your registered email address/i)).toBeInTheDocument();
    });
    const emailInput = screen.getByRole("textbox", { name: /email/i });
    fireEvent.change(emailInput, { target: { value: "user@example.com" } });
    fireEvent.click(screen.getByRole("button", { name: /Submit/i }));
    const dialog = await screen.findByRole("dialog", { name: /Reset Password/i });
    console.log(screen.queryAllByRole('dialog'));
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveTextContent(/New Password/i);
  });

  test("shows alert if new password and confirm password do not match", async () => {
    renderWithProviders(<Login />, { store });
    
    fireEvent.click(screen.getByText(/Forgot Password?/i));
    
    await waitFor(() => {
      expect(screen.getByText(/Enter your registered email address/i)).toBeInTheDocument();
    });
    
    const emailInput = screen.getByRole("textbox", { name: /email/i });
    fireEvent.change(emailInput, { target: { value: "user@example.com" } });
    fireEvent.click(screen.getByRole("button", { name: /Submit/i }));
    
    await waitFor(() => {
      expect(screen.getByLabelText(/New Password/i)).toBeInTheDocument();
    });
    
    fireEvent.change(screen.getByLabelText(/New Password/i), { target: { value: "newpassword123" } });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: "differentpassword" } });
    fireEvent.click(screen.getByRole("button", { name: /Reset Password/i }));
        await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Passwords do not match!");
    });
  });
  
});
