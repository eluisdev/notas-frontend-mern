import TaskList from "@/components/tasks/TaskList";
import { TaskProject } from "@/types/index";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cleanup, render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { afterEach, describe, expect, test, vi } from "vitest";


const queryClient = new QueryClient();

const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
        <BrowserRouter>{children}</BrowserRouter>
    </QueryClientProvider>
);

vi.mock('@/api/TaskAPI', () => ({
    updateStatus: vi.fn(),
    deleteTask: vi.fn()
}));

vi.mock("react-toastify", () => ({
    toast: {
        success: vi.fn()
    }
}))
describe("<TaskList />", () => {
    const mockTasks: TaskProject[] = [
        {
            _id: "1",
            name: "task example",
            description: "description example",
            status: "pending",
        },
    ];

    afterEach(() => {
        cleanup();
        vi.clearAllMocks();
    });

    test("should render", () => {
        render(<TaskList canEdit={true} tasks={mockTasks} />, { wrapper: Wrapper });
        expect(screen.getByText("Tareas")).toBeDefined();
    });

    test("should render without tasks", () => {
        render(<TaskList canEdit={false} tasks={[]} />, { wrapper: Wrapper });
        expect(screen.getAllByText("No Hay tareas")).toHaveLength(5);
    });

    //TODO: FOR THE FUTURE
    //test("should move a task from one column to another on drag and drop", async () => {});
});



