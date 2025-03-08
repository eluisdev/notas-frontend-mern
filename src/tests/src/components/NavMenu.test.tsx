import { describe, expect, Mock, test, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import NavMenu from "@/components/NavMenu";
import { QueryClient, QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { BrowserRouter, useNavigate } from "react-router-dom";
import userEvent from "@testing-library/user-event";

vi.mock("@tanstack/react-query", async () => {
    const actual = await vi.importActual("@tanstack/react-query")
    return {
        ...actual,
        useQueryClient: vi.fn()
    }
})

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom')
    return {
        ...actual,
        useNavigate: vi.fn(),
    }
})

const queryClient = new QueryClient()

const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
        <BrowserRouter>
            {children}
        </BrowserRouter>
    </QueryClientProvider>
)


describe("<NavMenu />", () => {
    render(<NavMenu name="luis" />, { wrapper })

    test("should render", () => {
        expect(screen.getByRole("button")).toBeDefined()
    })

    test("should navigate to profile page when clicking on 'Mi Perfil'", async () => {
        const user = userEvent.setup()
        const menu = screen.getByRole("button")
        await user.click(menu)
        const linkProfile = screen.getByText("Mi Perfil")
        await user.click(linkProfile)
        expect(screen.getByText("Mi Perfil")).toBeDefined()
    })

    test("hould call logout function when 'Cerrar Sesión' is clicked", async () => {
        cleanup()
        const mockRemoveQueries = vi.fn();
        const mockNavigate = vi.fn();
        (useQueryClient as Mock).mockReturnValue({ removeQueries: mockRemoveQueries });
        (useNavigate as Mock).mockReturnValue(mockNavigate)
        render(<NavMenu name="luis" />, { wrapper })
        const user = userEvent.setup()
        const menu = screen.getByRole("button")
        await user.click(menu)
        const buttonCloseSesion = screen.getByText("Cerrar Sesión")
        await user.click(buttonCloseSesion)
        expect(localStorage.getItem('AUTH_TOKEN')).toBeNull()
        expect(mockRemoveQueries).toHaveBeenCalledWith({ queryKey: ['user'] })
        expect(mockNavigate).toHaveBeenCalledWith("/auth/login")
    })
})