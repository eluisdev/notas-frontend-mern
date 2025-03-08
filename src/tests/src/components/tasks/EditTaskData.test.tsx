import EditTaskData from "@/components/tasks/EditTaskData";
import { Task } from "@/types/index";
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import { cleanup, render, screen } from "@testing-library/react";
import { BrowserRouter, useLocation, useParams } from "react-router-dom";
import { describe, test, vi, Mock, expect, afterEach } from "vitest";

vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom")
    return {
        ...actual,
        useLocation: vi.fn(),
        useParams: vi.fn(),
        Navigate: vi.fn(({ to }: { to: string }) => `Página no encontrada ${to}`),
    }
})

vi.mock("@tanstack/react-query", async () => {
    const actual = await vi.importActual("@tanstack/react-query")
    return {
        ...actual,
        useQuery: vi.fn()
    }
})
const queryClient = new QueryClient()

const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
        <BrowserRouter>
            {children}
        </BrowserRouter>
    </QueryClientProvider>
)

describe("<EditTaskData />", () => {
    const mockTask: Task = {
        _id: "1",
        name: "Sample Task",
        description: "This is a test task",
        status: "pending",
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-02T00:00:00Z",
        completedBy: [
            {
                status: "inProgress",
                _id: "1",
                user: {
                    _id: "1",
                    name: "luis",
                    email: "example@gmail.com"
                },
            }
        ],
        notes: [
            {
                _id: "1",
                content: "content example",
                createdAt: "2024-01-01T00:00:00Z",
                createdBy: {
                    _id: "1",
                    email: "example@gmail.com",
                    name: "luis"
                }, task: "task example"
            }
        ],
        project: "project example"
    };

    afterEach(() => {
        cleanup()
        vi.clearAllMocks()
    })
    test("should render", () => {
        (useParams as Mock).mockReturnValue({ projectId: '123' });
        (useLocation as Mock).mockReturnValue({ search: "?viewTask=1" });
        (useQuery as Mock).mockReturnValue({ data: mockTask, isError: false })
        render(<EditTaskData />, { wrapper: Wrapper })
        const taskNameInput = screen.getByPlaceholderText("Nombre de la tarea")
        expect((taskNameInput as HTMLInputElement).value).toBe("Sample Task")
    })

    test("handles query error state", () => {
        (useQuery as Mock).mockReturnValue({ data: null, isError: true, error: new Error("Error fetching task") });
        render(<EditTaskData />, { wrapper: Wrapper });
        expect(screen.getByText("Página no encontrada /404")).toBeDefined()
    });
})