import { removeUserFromProject } from "@/api/TeamAPI";
import ProjectTeamView from "@/views/projects/ProjectTeamView";
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, Mock, test, vi } from "vitest";


vi.mock("@/api/TeamAPI", () => ({
    getProjectTeam: vi.fn(),
    removeUserFromProject: vi.fn()
}))

vi.mock("@tanstack/react-query", async () => {
    const actual = await vi.importActual("@tanstack/react-query")
    return {
        ...actual,
        useQuery: vi.fn()
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

describe("<ProjectTeamView />", () => {

    beforeEach(() => {
        cleanup()
        vi.clearAllMocks()
    })

    test("should render", () => {
        (useQuery as Mock).mockReturnValue({ data: [{ _id: "1", name: "user", email: "example@example.com" }], isLoading: false, isError: false })
        render(<ProjectTeamView />, { wrapper })
        expect(screen.getByText("Agregar Colaborador")).toBeDefined()
    })

    test("should render loading component", () => {
        (useQuery as Mock).mockReturnValue({ data: [], isLoading: true, isError: false })
        render(<ProjectTeamView />, { wrapper })
        expect(screen.getByText("Loading...")).toBeDefined()
    })

    test("should remove member to the team", async () => {
        (useQuery as Mock).mockReturnValue({ data: [{ _id: "1", name: "user", email: "example@example.com" }], isLoading: false, isError: false })
        render(<ProjectTeamView />, { wrapper })
        const user = userEvent.setup()
        const options = screen.getByText("opciones")
        await user.click(options)
        const buttonDeleteMember = screen.getByText("Eliminar del Proyecto")
        await user.click(buttonDeleteMember)
        expect(removeUserFromProject as Mock).toHaveBeenCalled()
    })
})