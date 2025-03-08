import { authenticateUser } from "@/api/AuthAPI";
import LoginView from "@/views/auth/LoginView";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { toast } from "react-toastify";
import { beforeEach, describe, expect, Mock, test, vi } from "vitest";

vi.mock("@/api/AuthAPI", () => ({
    authenticateUser: vi.fn()
}))

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom")
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    }
})

vi.mock("react-toastify", () => ({
    toast: {
        error: vi.fn()
    }
}))

const queryClient = new QueryClient()

const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
        <MemoryRouter>
            {children}
        </MemoryRouter>
    </QueryClientProvider>
)

describe("<LoginView />", () => {

    beforeEach(() => {
        cleanup()
        vi.clearAllMocks()
    })

    test("should render", () => {
        render(<LoginView />, { wrapper })
        expect(screen.getByText("Comienza a planear tus proyectos")).toBeDefined()
    })

    test("should be show errors with inputs empty", async () => {
        render(<LoginView />, { wrapper })
        const user = userEvent.setup()
        const buttonSubmit = screen.getByDisplayValue("Iniciar Sesión")
        await user.click(buttonSubmit)
        expect(screen.queryByText("El email es obligatorio")).toBeDefined()
    })

    test("should be able to log in", async () => {
        (authenticateUser as Mock).mockReturnValue("tokenexample125125161");
        render(<LoginView />, { wrapper })
        const user = userEvent.setup()
        const inputEmail = screen.getByPlaceholderText("Email de Registro")
        const inputPassword = screen.getByPlaceholderText("Password de Registro")
        const buttonSubmit = screen.getByDisplayValue("Iniciar Sesión")
        await user.type(inputEmail, "example@gmail.com")
        await user.type(inputPassword, "password")
        await user.click(buttonSubmit)
        expect(mockNavigate).toHaveBeenCalledWith("/")
    })

    test("should be show a error in toast", async () => {
        (authenticateUser as Mock).mockRejectedValue(new Error("Error en la autenticacion"));
        render(<LoginView />, { wrapper })
        const user = userEvent.setup()
        const inputEmail = screen.getByPlaceholderText("Email de Registro")
        const inputPassword = screen.getByPlaceholderText("Password de Registro")
        const buttonSubmit = screen.getByDisplayValue("Iniciar Sesión")
        await user.type(inputEmail, "example@gmail.com")
        await user.type(inputPassword, "password")
        await user.click(buttonSubmit)
        expect(toast.error).toHaveBeenCalledWith("Error en la autenticacion")
    })
})