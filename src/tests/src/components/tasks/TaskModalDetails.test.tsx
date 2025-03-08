import { updateStatus } from "@/api/TaskAPI";
import TaskModalDetails from "@/components/tasks/TaskModalDetails";
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter, useLocation, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { afterEach, describe, expect, Mock, test, vi } from "vitest";

vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom")
    return {
        ...actual,
        useLocation: vi.fn(),
        useNavigate: vi.fn(),
        useParams: vi.fn()
    }
})
vi.mock("@tanstack/react-query", async () => {
    const actual = await vi.importActual("@tanstack/react-query")
    return {
        ...actual,
        useQuery: vi.fn()
    }
})

vi.mock("@/api/TaskAPI", () => {
    return {
        getTaskById: vi.fn(),
        updateStatus: vi.fn()
    }
})

vi.mock("react-toastify", () => ({
    toast: { success: vi.fn(), error: vi.fn() },
}))

const queryClient = new QueryClient()

const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
        <BrowserRouter>
            {children}
        </BrowserRouter>
    </QueryClientProvider>
)
describe("<TaskModalDetails />", () => {
    const mockTask = {
        _id: "1",
        name: "Sample Task",
        description: "This is a test task",
        status: "pending",
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-02T00:00:00Z",
        completedBy: [],
        notes: [],
    };

    afterEach(() => {
        cleanup()
        vi.clearAllMocks()
    })

    test("should be render", async () => {
        (useParams as Mock).mockReturnValue({ projectId: '123' });
        (useLocation as Mock).mockReturnValue({ search: "?viewTask=1" });
        (useQuery as Mock).mockReturnValue({ data: mockTask, isError: false, error: null })
        render(<TaskModalDetails />, { wrapper })
        expect(await screen.findByText("Sample Task")).toBeDefined()
    })

    test("handles status change correctly", async () => {
        (useParams as Mock).mockReturnValue({ projectId: '123' });
        (useLocation as Mock).mockReturnValue({ search: "?viewTask=1" });
        (useQuery as Mock).mockReturnValue({ data: mockTask, isError: false, error: null });
        (updateStatus as Mock).mockResolvedValue("Tarea Actualizada");
        render(<TaskModalDetails />, { wrapper })
        const user = userEvent.setup()
        const statusSelect = await screen.findByRole("combobox");
        await user.selectOptions(statusSelect, "onHold")
        expect(updateStatus).toHaveBeenCalledWith({
            projectId: expect.any(String),
            taskId: "1",
            status: "onHold",
        });
        expect(toast.success).toHaveBeenCalledWith("Tarea Actualizada");
    });

    test("displays error message if API call fails", async () => {
        (useParams as Mock).mockReturnValue({ projectId: '123' });
        (useLocation as Mock).mockReturnValue({ search: "?viewTask=1" });
        (useQuery as Mock).mockReturnValue({ data: {}, isError: true, error: new Error("Error fetching task") });
        render(<TaskModalDetails />, { wrapper })
        expect(toast.error).toHaveBeenCalled()
        expect(toast.error).toHaveBeenCalledWith("Error fetching task", { toastId: 'error' })
    });
})