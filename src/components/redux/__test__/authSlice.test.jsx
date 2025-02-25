import { loginUser, logout } from "../authSlice"; 
import authReducer from "../authSlice";
import { configureStore } from "@reduxjs/toolkit";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { afterEach, beforeEach, describe, expect, test } from "vitest";

describe("authSlice", () => {
  let mockAxios;

  beforeEach(() => {
    mockAxios = new MockAdapter(axios);
    localStorage.clear();
  });

  afterEach(() => {
    mockAxios.reset();
  });

  test("should return the initial state", () => {
    const initialState = { user: null, error: null };
    expect(authReducer(undefined, {})).toEqual(initialState);
  });

  test("should handle login success", async () => {
    const user = { id: 1, name: "balaji", email: "balaji.a@example.com", password: "password123", role: "employee" };
    mockAxios.onGet("http://localhost:5000/users").reply(200, [user]);

    const store = configureStore({ reducer: authReducer });
    await store.dispatch(loginUser({ email: "balaji.a@example.com", password: "password123" }));

    expect(store.getState().user).toEqual(user);
    expect(localStorage.getItem("user")).toEqual(JSON.stringify(user));
    expect(localStorage.getItem("isLoggedIn")).toBe("true");
    expect(localStorage.getItem("role")).toBe(user.role);
    expect(localStorage.getItem("userName")).toBe(user.name);
  });

  test("should handle login failure (invalid credentials)", async () => {
    mockAxios.onGet("http://localhost:5000/users").reply(200, []);

    const store = configureStore({ reducer: authReducer });
    await store.dispatch(loginUser({ email: "invalid@example.com", password: "wrongpassword" }));

    expect(store.getState().user).toBe(null);
    expect(store.getState().error).toBe("Invalid credentials");
    expect(localStorage.getItem("user")).toBeNull();
  });

  test("should handle logout", () => {
    const initialState = {
      user: { id: 1, name: "balaji", email: "balaji.a@example.com", role: "employee" },
      error: null,
    };

    const store = configureStore({ reducer: authReducer, preloadedState: initialState });
    store.dispatch(logout());

    expect(store.getState().user).toBe(null);
    expect(localStorage.getItem("user")).toBeNull();
    expect(localStorage.getItem("isLoggedIn")).toBeNull();
    expect(localStorage.getItem("role")).toBeNull();
    expect(localStorage.getItem("userName")).toBeNull();
  });
});
