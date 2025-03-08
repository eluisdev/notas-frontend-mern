import { createAccount } from "@/api/AuthAPI";
import RegisterView from "@/views/auth/RegisterView";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { toast } from "react-toastify";
import { beforeEach, describe, expect, Mock, test, vi } from "vitest";

vi.mock("@/api/AuthAPI", () => ({
    createAccount: vi.fn()
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
        error: vi.fn(),
        success: vi.fn()
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

describe("<RegisterView />", () => {

    beforeEach(() => {
        cleanup()
        vi.clearAllMocks()
    })

    test("should render", () => {
        render(<RegisterView />, { wrapper })
        expect(screen.getByText("Crear Cuenta")).toBeDefined()
    })

    test("should be show errors with inputs empty", async () => {
        render(<RegisterView />, { wrapper })
        const user = userEvent.setup()
        const buttonSubmit = screen.getByDisplayValue("Registrarme")
        await user.click(buttonSubmit)
        expect(screen.queryByText("El email es obligatorio")).toBeDefined()
    })

    test("should be able to register", async () => {
        (createAccount as Mock).mockReturnValue("Cuenta creada correctamente");
        render(<RegisterView />, { wrapper })
        const user = userEvent.setup()
        const inputName = screen.getByPlaceholderText("Nombre de Registro")
        const inputEmail = screen.getByPlaceholderText("Email de Registro")
        const inputPassword = screen.getByPlaceholderText("Password de Registro")
        const inputPasswordConfirmation = screen.getByPlaceholderText("Repite Password de Registro")
        const buttonSubmit = screen.getByDisplayValue("Registrarme")
        await user.type(inputName, "example")
        await user.type(inputEmail, "example@gmail.com")
        await user.type(inputPassword, "password")
        await user.type(inputPasswordConfirmation, "password")
        await user.click(buttonSubmit)
        expect(toast.success).toHaveBeenCalledWith("Cuenta creada correctamente")
        expect(mockNavigate).toHaveBeenCalledWith("/")
    })

    test("sKhould be show a error in toast", async () => {
        (createAccount as Mock).mockRejectedValue(new Error("Error en el registro"));
        render(<RegisterView />, { wrapper })
        const user = userEvent.setup()
        const inputName = screen.getByPlaceholderText("Nombre de Registro")
        const inputEmail = screen.getByPlaceholderText("Email de Registro")
        const inputPassword = screen.getByPlaceholderText("Password de Registro")
        const inputPasswordConfirmation = screen.getByPlaceholderText("Repite Password de Registro")
        const buttonSubmit = screen.getByDisplayValue("Registrarme")
        await user.type(inputName, "example")
        await user.type(inputEmail, "example@gmail.com")
        await user.type(inputPassword, "password")
        await user.type(inputPasswordConfirmation, "password")
        await user.click(buttonSubmit)
        expect(toast.error).toHaveBeenCalledWith("Error en el registro")
    })
})