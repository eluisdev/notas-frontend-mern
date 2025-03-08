import TaskCard from "@/components/tasks/TaskCard";
import { TaskProject } from "@/types/index";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { afterEach, describe, expect, Mock, test, vi } from "vitest";

const mockNavigate = vi.fn()

vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom")
    return {
        ...actual,
        useNavigate: vi.fn(),
        useLocation: vi.fn(() => ({
            pathname: "/"
        })),
        useParams: vi.fn(() => {
            return {
                params: {
                    projectId: 1
                }
            }
        })
    }
})

vi.mock("@/api/TaskAPI", () => ({
    deleteTask: vi.fn(() => ("Tarea Eliminada Correctamente"))
}))

vi.mock("react-toastify", () => ({
    toast: {
        success: vi.fn()
    }
}))

const queryClient = new QueryClient()

const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
        <BrowserRouter>
            {children}
        </BrowserRouter>
    </QueryClientProvider>
)
describe("<TaskCard />", () => {
    const mockTask: TaskProject = {
        _id: "1",
        description: "description example",
        name: "name example",
        status: "pending"
    }

    afterEach(() => {
        cleanup()
    })
    test("should render", () => {
        render(<TaskCard canEdit={true} task={mockTask} />, { wrapper: Wrapper })
        expect(screen.getByText("name example")).toBeDefined()
        expect(screen.getByText("description example")).toBeDefined()
    })

    test("should be only viewTask link", async () => {
        (useNavigate as Mock).mockReturnValue(mockNavigate);
        const user = userEvent.setup()
        render(<TaskCard canEdit={false} task={mockTask} />, { wrapper: Wrapper })
        const buttonOptions = screen.getByText("opciones")
        await user.click(buttonOptions)
        expect(screen.queryByText("Editar Tarea")).toBeNull()
    })

    test("should be can able use the links", async () => {
        (useNavigate as Mock).mockReturnValue(mockNavigate);
        const user = userEvent.setup()
        render(<TaskCard canEdit={true} task={mockTask} />, { wrapper: Wrapper })
        const buttonOptions = screen.getByText("opciones")
        await user.click(buttonOptions)
        const linkViewTask = screen.getByText("Ver Tarea")
        await user.click(linkViewTask)
        expect(mockNavigate).toHaveBeenCalledWith(`/?viewTask=${mockTask._id}`)
        await user.click(buttonOptions)
        const linkEditTask = screen.getByText("Editar Tarea")
        await user.click(linkEditTask)
        expect(mockNavigate).toHaveBeenCalledWith(`/?editTask=${mockTask._id}`)
    })

    test("shoul be delete a task", async () => {
        const user = userEvent.setup()
        render(<TaskCard canEdit={true} task={mockTask} />, { wrapper: Wrapper })
        const buttonOptions = screen.getByText("opciones")
        await user.click(buttonOptions)
        const buttonDeleteTask = screen.getByText("Eliminar Tarea")
        await user.click(buttonDeleteTask)
        expect(toast.success).toHaveBeenCalledWith("Tarea Eliminada Correctamente")
    })
})