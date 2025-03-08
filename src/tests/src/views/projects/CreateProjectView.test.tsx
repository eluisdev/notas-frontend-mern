import { createProject } from "@/api/ProjectAPI";
import CreateProjectView from "@/views/projects/CreateProjectView";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { toast } from "react-toastify";
import { beforeEach, describe, expect, Mock, test, vi } from "vitest";

vi.mock('@/api/ProjectAPI', () => ({
    createProject: vi.fn(),
}))

vi.mock('react-toastify', () => ({
    toast: {
        success: vi.fn(),
        error: vi.fn(),
    },
}))


vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom')
    return {
        ...actual,
    }
})

const queryClient = new QueryClient()

const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
        <MemoryRouter>
            {children}
        </MemoryRouter>
    </QueryClientProvider>
)

describe("<CreateProjectView />", () => {

    beforeEach(() => {
        cleanup()
    })

    test("should render", () => {
        render(<CreateProjectView />, { wrapper })
        expect(screen.getByText("Llena el siguiente formulario para crear un proyecto")).toBeDefined()
    })

    test("should show errors with inputs empty", async () => {
        render(<CreateProjectView />, { wrapper })
        const user = userEvent.setup()
        const submitButton = screen.getByDisplayValue("Crear Proyecto")
        await user.click(submitButton)
        expect(screen.getByText("El Nombre del Cliente es obligatorio")).toBeDefined()
        expect(screen.getByText("Una descripción del proyecto es obligatoria")).toBeDefined()
    })

    test("should create a project", async () => {
        (createProject as Mock).mockReturnValue("Proyecto Creando Correctamente")
        render(<CreateProjectView />, { wrapper })
        const user = userEvent.setup()
        const submitButton = screen.getByDisplayValue("Crear Proyecto")
        const inputName = screen.getByPlaceholderText("Nombre del Proyecto")
        const inputNameClient = screen.getByPlaceholderText("Nombre del Cliente")
        const inputDescription = screen.getByPlaceholderText("Descripción del Proyecto")
        await user.type(inputName, "projectExample")
        await user.type(inputNameClient, "clientExample")
        await user.type(inputDescription, "descriptionExample")
        await user.click(submitButton)
        expect(toast.success).toHaveBeenCalledWith("Proyecto Creando Correctamente")
    })
})