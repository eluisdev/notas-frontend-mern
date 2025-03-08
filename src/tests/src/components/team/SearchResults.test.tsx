import { addUserToProject } from "@/api/TeamAPI";
import SearchResult from "@/components/team/SearchResult";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { describe, test, vi, Mock, expect } from "vitest";

vi.mock("react-router-dom", () => {
    return {
        useNavigate: vi.fn(),
        useParams: vi.fn()
    }
})

vi.mock("@/api/TeamAPI", () => {
    return {
        addUserToProject: vi.fn()
    }
})

vi.mock("react-toastify", () => {
    return {
        toast: {
            success: vi.fn()
        }
    }
})

const queryClient = new QueryClient()

const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
        {children}
    </QueryClientProvider>
)
describe("<SearchResults />", () => {
    const mockUser = { _id: "1", email: "example@gmail.com", name: "example name" }
    test("should render and add to team", async () => {
        (useParams as Mock).mockReturnValue({ projectId: "1" });
        (addUserToProject as Mock).mockReturnValue("Usuario agregado correctamente")
        render(<SearchResult reset={() => { }} user={mockUser} />, { wrapper })
        const user = userEvent.setup()
        expect(screen.getByText("example name")).toBeDefined()
        const submitButton = screen.getByText("Agregar al Proyecto")
        await user.click(submitButton)
        expect(toast.success).toHaveBeenCalledWith("Usuario agregado correctamente")
    })
})