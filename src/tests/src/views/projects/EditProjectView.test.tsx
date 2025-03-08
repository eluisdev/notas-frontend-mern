import EditProjectView from "@/views/projects/EditProjectView";
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, Mock, test, vi } from "vitest";

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
describe("<EditProjectView />", () => {

    beforeEach(() => {
        cleanup()
    })

    test("should render", () => {
        (useQuery as Mock).mockReturnValue({ data: {}, isError: false })
        render(<EditProjectView />, { wrapper })
        expect(screen.getByText("Llena el siguiente formulario para editar el proyecto")).toBeDefined()
    })

    test("should show component loading with response with a loading ", () => {
        (useQuery as Mock).mockReturnValue({ data: {}, isError: false, isLoading: true })
        render(<EditProjectView />, { wrapper })
        expect(screen.getByText("Loading...")).toBeDefined()
    })
})