import { updateProfile } from "@/api/ProfileAPI"
import ProfileForm from "@/components/profile/ProfileForm"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { cleanup, render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { toast } from "react-toastify"
import { test, describe, vi, beforeEach, afterEach, expect, Mock } from "vitest"

const queryClient = new QueryClient()

const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
        {children}
    </QueryClientProvider>
)

const userData = {
    name: "luis",
    email: "example@gmail.com",
    _id: "1"
}


vi.mock("react-toastify", () => ({
    toast: {
        success: vi.fn(),
        error: vi.fn()
    }
}))

vi.mock("@/api/ProfileAPI", () => ({
    updateProfile: vi.fn()
}))

describe("</ProfileForm />", () => {
    beforeEach(() => {
        render(<ProfileForm data={userData} />, { wrapper: Wrapper })
    })

    afterEach(() => {
        cleanup()
        vi.clearAllMocks()
    })

    test("renders the form correctly", async () => {
        const nameInput = await screen.findByPlaceholderText("Tu Nombre")
        expect(nameInput).toBeDefined()
        const inputValue = (nameInput as HTMLInputElement).value
        const emailInput = await screen.findByPlaceholderText("Tu Email")
        expect(emailInput).toBeDefined()
        const inputEmailValue = (emailInput as HTMLInputElement).value
        expect(inputValue).toBe(userData.name)
        expect(inputEmailValue).toBe(userData.email)
    })

    test("shows error with a input empty", async () => {
        const user = userEvent.setup()
        const nameInput = await screen.findByPlaceholderText("Tu Nombre")
        user.clear(nameInput)
        expect((nameInput as HTMLInputElement).value).toBe("")
        const inputSubmit = await screen.findByDisplayValue("Guardar Cambios")
        user.click(inputSubmit)
        expect(await screen.findByText("Nombre de usuario es obligatorio")).toBeDefined()
    })

    test("should edit and show the toast", async () => {
        (updateProfile as Mock).mockResolvedValue("Perfil actualizado correctamente")
        const user = userEvent.setup()
        const inputSubmit = await screen.findByDisplayValue("Guardar Cambios")
        user.click(inputSubmit)
        await waitFor(() => {
            expect(updateProfile).toHaveBeenCalledTimes(1)
            expect(updateProfile).toHaveBeenCalledWith(userData)
            expect(toast.success).toHaveBeenCalledWith("Perfil actualizado correctamente")
        })
    })
})