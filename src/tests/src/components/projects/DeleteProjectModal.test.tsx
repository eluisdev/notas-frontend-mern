import { checkPassword } from "@/api/AuthAPI";
import { deleteProject } from "@/api/ProjectAPI";
import DeleteProjectModal from "@/components/projects/DeleteProjectModal";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { afterEach, describe, expect, Mock, test, vi } from "vitest";

vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom")
    return {
        ...actual,
        useNavigate: vi.fn(),
        useLocation: vi.fn(),
    }
})

vi.mock("react-toastify", () => ({
    toast: {
        success: vi.fn(),
        error: vi.fn()
    }
}))

vi.mock("@/api/AuthAPI", () => ({
    checkPassword: vi.fn()
}))

vi.mock("@/api/ProjectAPI", () => ({
    deleteProject: vi.fn()
}))

const queryClient = new QueryClient()

const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
        <BrowserRouter>
            {children}
        </BrowserRouter>
    </QueryClientProvider>
)

describe("<DeleteProjectModal />", () => {

    afterEach(() => {
        cleanup()
        vi.clearAllMocks()
    })

    test("should be render", () => {
        (useLocation as Mock).mockReturnValue({ search: "?deleteProject=1" })
        render(<DeleteProjectModal />, { wrapper: Wrapper })
        expect(screen.getByText("Confirma la eliminación del proyecto")).not.toBeNull()
    })

    test("should be delete a project", async () => {
        const mockNavigate = vi.fn();
        (useLocation as Mock).mockReturnValue({ search: "?deleteProject=1", pathname: "/" });
        (deleteProject as Mock).mockResolvedValue("Proyecto Eliminado");
        (checkPassword as Mock).mockResolvedValue("Password Correcto");
        (useNavigate as Mock).mockReturnValue(mockNavigate)
        const user = userEvent.setup()
        render(<DeleteProjectModal />, { wrapper: Wrapper })
        const button = screen.getByText("Eliminar Proyecto", { selector: "input" })
        const input = screen.getByLabelText("Password")
        await user.type(input, "Rildito123.")
        await user.click(button)
        await waitFor(() => {
            expect(deleteProject).toHaveBeenCalledTimes(1)
            expect(toast.success).toHaveBeenCalledWith("Proyecto Eliminado")
            expect(mockNavigate).toHaveBeenCalledWith("/", { "replace": true })
        })
    })
})