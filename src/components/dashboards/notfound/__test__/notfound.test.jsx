import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter, useNavigate } from "react-router-dom";
import NotFound from "../Notfound"; 
import { describe, expect, test, vi } from "vitest";
import "@testing-library/jest-dom";

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: vi.fn(),
    BrowserRouter: actual.BrowserRouter, 
  };
});

describe("NotFound Component", () => {
  test("renders 404 page with correct text and button", () => {
    render(
      <BrowserRouter>
        <NotFound />
      </BrowserRouter>
    );

    const titleElement = screen.getByText("404");
    expect(titleElement).toBeInTheDocument();

    const subtitleElement = screen.getByText("...Page Not Found");
    expect(subtitleElement).toBeInTheDocument();

    const textElement = screen.getByText(
      "The page you are looking for does not exist or has been moved."
    );
    expect(textElement).toBeInTheDocument();

    const buttonElement = screen.getByText("Go Home");
    expect(buttonElement).toBeInTheDocument();
  });

  test("navigates to home page when 'Go Home' button is clicked", () => {
    const mockNavigate = vi.fn();
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);

    render(
      <BrowserRouter>
        <NotFound />
      </BrowserRouter>
    );

    const buttonElement = screen.getByText("Go Home");
    fireEvent.click(buttonElement);

    expect(mockNavigate).toHaveBeenCalledWith("/");
  });
});
