import { updateTask } from "@/api/TaskAPI";
import EditTaskModal from "@/components/tasks/EditTaskModal";
import { Task } from "@/types/index";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "react-toastify";
import { afterEach, describe, expect, Mock, test, vi } from "vitest";

vi.mock("react-router-dom", () => {
    return {
        useNavigate: vi.fn(),
        useLocation: vi.fn(() => ({
            search: "?newTask=1"
        })),
        useParams: vi.fn(() => {
            return {
                projectId: "1"
            }
        })
    }
})

vi.mock("@/api/TaskAPI", () => {
    return {
        updateTask: vi.fn()
    }
})

vi.mock("react-toastify", () => {
    return {
        toast: {
            success: vi.fn()
        }
    }
})
const queryClient = new QueryClient()

const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
        {children}
    </QueryClientProvider>
)

describe("<EditTaskModal />", () => {

    const mockTask: Task = {
        _id: "1",
        name: "Sample Task",
        description: "This is a test task",
        status: "pending",
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-02T00:00:00Z",
        completedBy: [],
        notes: [],
        project: "project example"
    };

    afterEach(() => {
        cleanup()
    })

    test("should be render", () => {

        render(<EditTaskModal data={mockTask} taskId="1" />, { wrapper: Wrapper })
        const taskNameInput = screen.getByPlaceholderText("Nombre de la tarea")
        expect((taskNameInput as HTMLInputElement).value).toBe("Sample Task")
    })

    test("edit a note", async () => {
        (updateTask as Mock).mockResolvedValue("Tarea Actualizada Correctamente")
        render(<EditTaskModal data={mockTask} taskId="1" />, { wrapper: Wrapper })
        const user = userEvent.setup()
        const inputTitle = screen.getByPlaceholderText("Nombre de la tarea")
        const inputDescription = screen.getByPlaceholderText("Descripción de la tarea")
        const buttonSubmit = screen.getByDisplayValue("Guardar Tarea")
        await user.clear(inputTitle)
        await user.type(inputTitle, "task example")
        await user.clear(inputDescription)
        await user.type(inputDescription, "description example")
        await user.click(buttonSubmit)
        expect(updateTask).toHaveBeenCalledWith({
            formData: {
                description: "description example",
                name: "task example",
            },
            projectId: "1",
            taskId: "1"
        })
        expect(toast.success).toHaveBeenCalledWith("Tarea Actualizada Correctamente")
    })
})