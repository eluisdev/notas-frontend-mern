import { findUserByEmail } from "@/api/TeamAPI";
import AddMemberForm from "@/components/team/AddMemberForm";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter, useParams } from "react-router-dom";
import { describe, test, afterEach, expect, vi, Mock } from "vitest";

const queryClient = new QueryClient

vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom")
    return {
        ...actual,
        useParams: vi.fn()
    }
})

const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
        <BrowserRouter>
            {children}
        </BrowserRouter>
    </QueryClientProvider>
)

vi.mock("@/api/TeamAPI", () => {
    return {
        findUserByEmail: vi.fn(),
        addUserToProject: vi.fn()
    }
})

describe("<AddMemberForm />", () => {
    afterEach(() => {
        cleanup()
        vi.clearAllMocks()
    })

    test("should render", () => {
        (useParams as Mock).mockReturnValue({ projectId: "1" })
        render(<AddMemberForm />, { wrapper: Wrapper })
        expect(screen.getByPlaceholderText("E-mail del usuario a Agregar")).toBeDefined()
    })

    test("type a email and get user", async () => {
        (useParams as Mock).mockReturnValue({ projectId: "1" });
        (findUserByEmail as Mock).mockReturnValue({ _id: "1", email: "example@gmail.com", name: "example name" });
        render(<AddMemberForm />, { wrapper: Wrapper })
        expect(screen.getByPlaceholderText("E-mail del usuario a Agregar")).toBeDefined()
        const user = userEvent.setup()
        const inputEmail = screen.getByPlaceholderText("E-mail del usuario a Agregar")
        const buttonSubmit = screen.getByDisplayValue("Buscar Usuario")
        await user.type(inputEmail, "example@gmail.com")
        await user.click(buttonSubmit)
        expect(findUserByEmail).toHaveBeenCalledWith({ projectId: "1", formData: { email: "example@gmail.com" } })
        expect(screen.getByText("example name")).toBeDefined()
    })
})