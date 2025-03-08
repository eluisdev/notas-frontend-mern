import { createTask } from "@/api/TaskAPI";
import AddTaskModal from "@/components/tasks/AddTaskModal";
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
        createTask: vi.fn()
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

describe("<AddTaskModal />", () => {

    afterEach(() => {
        cleanup()
    })

    test("should be render", () => {
        render(<AddTaskModal />, { wrapper: Wrapper })
        expect(screen.getByText("Nueva Tarea")).toBeDefined()
        expect(screen.getByText("Nombre de la tarea")).toBeDefined()
    })

    test("create a new note", async () => {
        (createTask as Mock).mockResolvedValue("Tarea creada correctamente")
        render(<AddTaskModal />, { wrapper: Wrapper })
        const user = userEvent.setup()
        const inputTitle = screen.getByPlaceholderText("Nombre de la tarea")
        const inputDescription = screen.getByPlaceholderText("Descripción de la tarea")
        const buttonSubmit = screen.getByDisplayValue("Guardar Tarea")
        await user.type(inputTitle, "task example")
        await user.type(inputDescription, "description example")
        await user.click(buttonSubmit)
        expect(createTask).toHaveBeenCalledWith({
            formData: {
                description: "description example",
                name: "task example",
            },
            projectId: "1"
        })
        expect(toast.success).toHaveBeenCalledWith("Tarea creada correctamente")
    })
})