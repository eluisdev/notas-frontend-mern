import AddMemberForm from "@/components/team/AddMemberForm";
import AddMemberModal from "@/components/team/AddMemberModal";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter, useLocation, useParams } from "react-router-dom";
import { describe, test, afterEach, expect, vi, Mock } from "vitest";

const queryClient = new QueryClient

vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom")
    return {
        ...actual,
        useParams: vi.fn(),
        useLocation: vi.fn()
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

describe("<AddMemberModal />", () => {
    afterEach(() => {
        cleanup()
        vi.clearAllMocks()
    })

    test("should render", () => {
        (useLocation as Mock).mockReturnValue({ search: "?addMember=1" });
        (useParams as Mock).mockReturnValue({ projectId: "1" })
        render(<AddMemberModal />, { wrapper: Wrapper })
        expect(screen.getByPlaceholderText("E-mail del usuario a Agregar")).toBeDefined()
    })


    test("type a email in input", async () => {
        (useLocation as Mock).mockReturnValue({ search: "?addMember=1" });
        (useParams as Mock).mockReturnValue({ projectId: "1" });
        render(<AddMemberForm />, { wrapper: Wrapper })
        expect(screen.getByPlaceholderText("E-mail del usuario a Agregar")).toBeDefined()
        const user = userEvent.setup()
        const inputEmail = screen.getByPlaceholderText("E-mail del usuario a Agregar")
        await user.type(inputEmail, "example@gmail.com")
        expect((inputEmail as HTMLInputElement).value).toBe("example@gmail.com")
    })
})