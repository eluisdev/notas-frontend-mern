import { useAuth } from "@/hooks/useAuth";
import DashboardView from "@/views/DashboardView";
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, useLocation } from "react-router-dom";
import { describe, expect, Mock, test, vi } from "vitest";

vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom")
    return {
        ...actual,
        useNavigate: vi.fn(),
        useLocation: vi.fn(),
    }
})

vi.mock("@tanstack/react-query", async () => {
    const actual = await vi.importActual("@tanstack/react-query")
    return {
        ...actual,
        useQuery: vi.fn()
    }
})

vi.mock("@/hooks/useAuth", () => ({
    useAuth: vi.fn()
}))

const queryClient = new QueryClient()

const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
        <MemoryRouter>
            {children}
        </MemoryRouter>
    </QueryClientProvider>
)
describe("<DashboardView />", () => {
    test("should render", () => {
        (useAuth as Mock).mockReturnValue({
            data: {
                _id: "1",
                name: "userExample",
                email: "example@example.com"
            },
            isLoading: false
        });
        (useQuery as Mock).mockReturnValue({
            data: [{
                _id: "1",
                projectName: "project example",
                clientName: "client example",
                description: "description example",
                manager: "manager example"
            }],
            isLoading: false
        });
        (useLocation as Mock).mockReturnValue({ search: "?deleteProject=1" });
        render(<DashboardView />, { wrapper })
        expect(screen.getByText("project example")).toBeDefined()
    })
})