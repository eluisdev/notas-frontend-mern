import { updateProject } from "@/api/ProjectAPI";
import EditProjectForm from "@/components/projects/EditProjectForm";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import { toast } from "react-toastify";
import { afterEach, describe, expect, Mock, test, vi } from "vitest";

vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom")
    return {
        ...actual,
        useNavigate: vi.fn()
    }
})

vi.mock("@/api/ProjectAPI", () => {
    return {
        updateProject: vi.fn()
    }
})

vi.mock("react-toastify", () => {
    return {
        toast: {
            success: vi.fn(),
            error: vi.fn()
        }
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

describe("<EditProjectForm />", () => {

    afterEach(() => {
        cleanup()
    })

    test("should be render", () => {
        const mockProject = {
            projectName: "project example",
            clientName: "enrique",
            description: "description example"
        }
        const mockProjectId = "1"
        render(<EditProjectForm data={mockProject} projectId={mockProjectId} />, { wrapper: Wrapper })
    })

    test("should be edit project", async () => {
        (updateProject as Mock).mockResolvedValue("Proyecto Actualizado")
        const mockProject = {
            projectName: "project example",
            clientName: "enrique",
            description: "description example"
        }
        const mockProjectId = ""
        const user = userEvent.setup()
        render(<EditProjectForm data={mockProject} projectId={mockProjectId} />, { wrapper: Wrapper })
        const projectNameInput = screen.getByPlaceholderText("Nombre del Proyecto");
        const projectInputSubmit = screen.getByDisplayValue("Guardar Cambios");
        await user.clear(projectNameInput)
        await user.type(projectNameInput, "This is a example")
        expect((projectNameInput as HTMLInputElement).value).toBe("This is a example")
        await user.click(projectInputSubmit)
        expect(toast.success).toHaveBeenCalledWith("Proyecto Actualizado")
    })

})