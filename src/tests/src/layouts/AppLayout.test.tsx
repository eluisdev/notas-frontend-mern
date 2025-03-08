import { useAuth } from "@/hooks/useAuth";
import AppLayout from "@/layouts/AppLayout";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, Mock, test, vi } from "vitest";


vi.mock("@/hooks/useAuth", () => {
    return {
        useAuth: vi.fn()
    }
})

const queryClient = new QueryClient()

const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
        {children}
    </QueryClientProvider>
)

describe("<AppLayout />", () => {

    beforeEach(() => {
        cleanup()
        vi.clearAllMocks()
    })

    test("should render a spinner when isLoading is true", () => {
        const dataMocked = { data: null, isLoading: true, isError: null };
        (useAuth as Mock).mockReturnValue(dataMocked)
        render(
            <MemoryRouter>
                <AppLayout />
            </MemoryRouter>
        )
        expect(screen.getByText("Loading...")).toBeDefined()
    })

    test("should redirect to /auth/login when there is an error", async () => {
        const dataMocked = { data: null, isLoading: false, isError: new Error("There is a error") };
        (useAuth as Mock).mockReturnValue(dataMocked)
        render(
            <MemoryRouter initialEntries={['/']}>
                <Routes>
                    <Route path="/" element={<AppLayout />} />
                    <Route path="/auth/login" element={<div>Login Page</div>} />
                </Routes>
            </MemoryRouter>
        )
        await waitFor(() => {
            expect(screen.getByText('Login Page')).toBeDefined()
        })
    })

    test("should render the layout correctly when there is data", async () => {
        const dataMocked = { data: { _id: "1", name: "example", email: "example@example.com" }, isLoading: false, isError: null };
        (useAuth as Mock).mockReturnValue(dataMocked)
        render(
            <MemoryRouter>
                <AppLayout />
            </MemoryRouter>
            ,
            { wrapper })
        const user = userEvent.setup()
        const buttonLinks = screen.getByRole("button")
        await user.click(buttonLinks)
        expect(screen.getByText("Hola: example")).toBeDefined()
    })
})