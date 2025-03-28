jest.mock("@/contexts/AuthContext", () => ({
  useAuth: jest.fn(() => ({
    login: jest.fn(),
    register: jest.fn(),
  })),
}));

jest.mock("@/hooks/useTask", () => ({
  useTasks: jest.fn(),
}));
jest.mock("@/hooks/useUsers", () => ({
  useUsers: jest.fn(),
}));
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));
jest.mock("react-toastify", () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
  ToastContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CreateTaskPage from "@/app/tasks/create/page";
import { useTasks } from "@/hooks/useTask";
import { useUsers } from "@/hooks/useUsers";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Roles } from "@/model";

describe("CreateTaskPage", () => {
  const pushMock = jest.fn();
  const createTaskMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useTasks as jest.Mock).mockReturnValue({
      createTask: createTaskMock,
    });
    (useUsers as jest.Mock).mockReturnValue({
      users: [
        { id: "user1", username: "User One" },
        { id: "user2", username: "User Two" },
      ],
      isLoading: false,
      error: null,
    });
    (useRouter as jest.Mock).mockReturnValue({
      push: pushMock,
    });
  });

  it("renders the create task form", () => {
    render(<CreateTaskPage />);

    expect(screen.getByPlaceholderText(/enter task title/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter task description/i)).toBeInTheDocument();

    expect(screen.getByRole("button", { name: /create task/i })).toBeInTheDocument();

    expect(screen.getByText(/select a user/i)).toBeInTheDocument();
  });

  it("shows an error toast if title is empty", () => {
    render(<CreateTaskPage />);
    const submitButton = screen.getByRole("button", { name: /create task/i });
    fireEvent.click(submitButton);
    expect(toast.error).toHaveBeenCalledWith("Please enter a task title.");
  });

  it("calls createTask and redirects on successful submission", async () => {
    createTaskMock.mockResolvedValueOnce({});

    jest.useFakeTimers();

    render(<CreateTaskPage />);

    const titleInput = screen.getByPlaceholderText(/enter task title/i);
    const descriptionInput = screen.getByPlaceholderText(/enter task description/i);
    const submitButton = screen.getByRole("button", { name: /create task/i });

    fireEvent.change(titleInput, { target: { value: "New Task" } });
    fireEvent.change(descriptionInput, { target: { value: "Task description" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(createTaskMock).toHaveBeenCalledWith({
        title: "New Task",
        description: "Task description",
        assigneeId: undefined,
      });
      expect(toast.success).toHaveBeenCalledWith("Task created successfully!");
    });

    jest.advanceTimersByTime(1500);
    expect(pushMock).toHaveBeenCalledWith("/dashboard");

    jest.useRealTimers();
  });
});
