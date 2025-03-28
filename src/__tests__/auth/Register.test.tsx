import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import RegisterPage from "@/app/auth/register/page";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

jest.mock("@/contexts/AuthContext", () => ({
  useAuth: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("RegisterPage", () => {
  const pushMock = jest.fn();
  const registerMock = jest.fn();

  beforeEach(() => {
    pushMock.mockClear();
    registerMock.mockClear();

    (useAuth as jest.Mock).mockReturnValue({
      register: registerMock,
    });
    (useRouter as jest.Mock).mockReturnValue({
      push: pushMock,
    });
  });

  it("renders the registration form", () => {
    render(<RegisterPage />);

    expect(screen.getByPlaceholderText(/enter your username/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter your password/i)).toBeInTheDocument();

    expect(screen.getByRole("button", { name: /register/i })).toBeInTheDocument();
  });

  it("calls register and redirects on successful submission", async () => {
    registerMock.mockResolvedValueOnce({});
    render(<RegisterPage />);

    const usernameInput = screen.getByPlaceholderText(/enter your username/i);
    const passwordInput = screen.getByPlaceholderText(/enter your password/i);
    const submitButton = screen.getByRole("button", { name: /register/i });

    fireEvent.change(usernameInput, { target: { value: "newuser" } });
    fireEvent.change(passwordInput, { target: { value: "securePass123" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(registerMock).toHaveBeenCalledWith("newuser", "securePass123");
      expect(pushMock).toHaveBeenCalledWith("/");
    });
  });

  it("displays an error message when registration fails", async () => {
    const errorResponse = { response: { data: { message: "Registration failed" } } };
    registerMock.mockRejectedValueOnce(errorResponse);
    render(<RegisterPage />);

    const usernameInput = screen.getByPlaceholderText(/enter your username/i);
    const passwordInput = screen.getByPlaceholderText(/enter your password/i);
    const submitButton = screen.getByRole("button", { name: /register/i });

    fireEvent.change(usernameInput, { target: { value: "newuser" } });
    fireEvent.change(passwordInput, { target: { value: "securePass123" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/registration failed/i)).toBeInTheDocument();
    });
  });
});
