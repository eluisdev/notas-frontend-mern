import { changePassword } from "@/api/ProfileAPI";
import ChangePasswordView from "@/views/profile/ChangePasswordView";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "react-toastify";
import { beforeEach, describe, expect, Mock, test, vi } from "vitest";

vi.mock("@/api/ProfileAPI", () => ({
    changePassword: vi.fn()
}))

vi.mock("react-toastify", () => ({
    toast: {
        success: vi.fn(),
        error: vi.fn()
    }
}))

const queryClient = new QueryClient()

const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
        {children}
    </QueryClientProvider>
)
describe("<ChangePasswordView />", () => {

    beforeEach(() => {
        cleanup()
    })
    test("should render", () => {
        render(<ChangePasswordView />, { wrapper })
        expect(screen.getByText("Cambiar Password", { selector: "h1" })).toBeDefined()
        expect(screen.getByText("Utiliza este formulario para cambiar tu password")).toBeDefined()
    })

    test("should show errors with inputs empty", async () => {
        render(<ChangePasswordView />, { wrapper })
        const user = userEvent.setup()
        const buttonSubmit = screen.getByDisplayValue("Cambiar Password")
        await user.click(buttonSubmit)
        expect(screen.getByText("El password actual es obligatorio")).toBeDefined()
        expect(screen.getByText("El Nuevo Password es obligatorio")).toBeDefined()
        expect(screen.getByText("Este campo es obligatorio")).toBeDefined()
    })

    test("should change te old password with the new", async () => {
        (changePassword as Mock).mockResolvedValue("El Password se modificó correctamente")
        render(<ChangePasswordView />, { wrapper })
        const user = userEvent.setup()
        const inputCurrentPassword = screen.getByPlaceholderText("Password Actual")
        const inputNewPassword = screen.getByPlaceholderText("Nuevo Password")
        const inputPasswordConfirmation = screen.getByPlaceholderText("Repetir Password")
        const buttonSubmit = screen.getByDisplayValue("Cambiar Password")
        await user.type(inputCurrentPassword, "old-password")
        await user.type(inputNewPassword, "new-password")
        await user.type(inputPasswordConfirmation, "new-password")
        await user.click(buttonSubmit)
        expect(toast.success).toHaveBeenCalledWith("El Password se modificó correctamente")
    })

    test("should show error in toaster", async () => {
        (changePassword as Mock).mockRejectedValue(new Error("Error"))
        render(<ChangePasswordView />, { wrapper })
        const user = userEvent.setup()
        const inputCurrentPassword = screen.getByPlaceholderText("Password Actual")
        const inputNewPassword = screen.getByPlaceholderText("Nuevo Password")
        const inputPasswordConfirmation = screen.getByPlaceholderText("Repetir Password")
        const buttonSubmit = screen.getByDisplayValue("Cambiar Password")
        await user.type(inputCurrentPassword, "old-password")
        await user.type(inputNewPassword, "new-password")
        await user.type(inputPasswordConfirmation, "new-password")
        await user.click(buttonSubmit)
        expect(toast.error).toHaveBeenCalledWith("Error")
    })
})