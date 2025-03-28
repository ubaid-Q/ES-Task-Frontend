import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import LoginPage from "@/app/auth/login/page";

jest.mock("@/contexts/AuthContext", () => ({
  useAuth: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("LoginPage", () => {
  const pushMock = jest.fn();
  const loginMock = jest.fn();

  beforeEach(() => {
    pushMock.mockClear();
    loginMock.mockClear();

    (useAuth as jest.Mock).mockReturnValue({
      login: loginMock,
    });
    (useRouter as jest.Mock).mockReturnValue({
      push: pushMock,
    });
  });

  it("renders the login form", () => {
    render(<LoginPage />);

    expect(screen.getByPlaceholderText(/enter your username/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter your password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  it("calls login and redirects on successful submission", async () => {
    loginMock.mockResolvedValueOnce({});
    render(<LoginPage />);

    const usernameInput = screen.getByPlaceholderText(/enter your username/i);
    const passwordInput = screen.getByPlaceholderText(/enter your password/i);
    const submitButton = screen.getByRole("button", { name: /login/i });

    fireEvent.change(usernameInput, { target: { value: "jhonny" } });
    fireEvent.change(passwordInput, { target: { value: "abcd@123" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(loginMock).toHaveBeenCalledWith("jhonny", "abcd@123");
      expect(pushMock).toHaveBeenCalledWith("/dashboard");
    });
  });

  it("displays an error message when login fails", async () => {
    const errorResponse = { response: { data: { message: "Invalid credentials" } } };
    loginMock.mockRejectedValueOnce(errorResponse);
    render(<LoginPage />);

    const usernameInput = screen.getByPlaceholderText(/enter your username/i);
    const passwordInput = screen.getByPlaceholderText(/enter your password/i);
    const submitButton = screen.getByRole("button", { name: /login/i });

    fireEvent.change(usernameInput, { target: { value: "wronguser" } });
    fireEvent.change(passwordInput, { target: { value: "wrongpass" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });
  });
});
