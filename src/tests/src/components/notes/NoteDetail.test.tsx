import NoteDetail from "@/components/notes/NoteDetail";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, test, vi, Mock, afterEach, expect } from "vitest"
import { cleanup, render, screen, waitFor } from "@testing-library/react"
import React from "react";
import { BrowserRouter } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import userEvent from "@testing-library/user-event";
import { deleteNote } from "@/api/NoteAPI";
import { toast } from "react-toastify";

const queryClient = new QueryClient()
const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
        <BrowserRouter>
            {children}
        </BrowserRouter>
    </QueryClientProvider>
)

vi.mock("@/hooks/useAuth", () => ({
    useAuth: vi.fn()
}))

vi.mock("@/api/NoteAPI", () => ({
    deleteNote: vi.fn()
}))

vi.mock("react-toastify", () => ({
    toast : {
        success: vi.fn()
    }
})) 

describe("<NoteDetail />", () => {
    
    afterEach(() => {
        cleanup()
        vi.clearAllMocks()
    })

    test("should render", async () => {
        const mockNote = {
            _id: "1",
            content: "test todo",
            createdBy: {
                _id: "1",
                name: "enrique",
                email: "example@gmail.com"
            },
            task: "task example",
            createdAt: "2025-02-22T14:30:00.000Z"
        }

        const mockNoteWithLoading = { data: null, isError: false, isLoading: true };

        (useAuth as Mock).mockReturnValueOnce(mockNoteWithLoading).mockReturnValueOnce({
            data: {
                name: 'enrique',
                email: 'example@gmail.com',
                _id: '1'
            },
            isError: false,
            isLoading: false
        })
        const { rerender } = render(<NoteDetail note={mockNote} />, { wrapper: Wrapper });
        expect(screen.getByText("Loading..."))
        rerender(<NoteDetail note={mockNote} />)
        await waitFor(() => {
            expect(screen.getByText((content) => content.includes(mockNote.content))).not.toBeNull()
        })
    })

    test("should render note how cooperator", () => {
        const mockNote = {
            _id: "1",
            content: "test todo",
            createdBy: {
                _id: "2",
                name: "luis",
                email: "example@gmail.com"
            },
            task: "task example",
            createdAt: "2025-02-22T14:30:00.000Z"
        };

        (useAuth as Mock).mockReturnValue({
            data: {
                name: 'enrique',
                email: 'example@gmail.com',
                _id: '1'
            },
            isError: false,
            isLoading: false
        })
        render(<NoteDetail note={mockNote}/>, {wrapper: Wrapper})
        expect(screen.queryByText("Eliminar")).toBeNull()
    })

    test("should be delete a note", async () => {
        (deleteNote as Mock).mockResolvedValue("Nota Eliminada")

        const mockNote = {
            _id: "1",
            content: "test todo",
            createdBy: {
                _id: "1",
                name: "enrique",
                email: "example@gmail.com"
            },
            task: "task example",
            createdAt: "2025-02-22T14:30:00.000Z"
        };

        (useAuth as Mock).mockReturnValue({
            data: {
                name: 'enrique',
                email: 'example@gmail.com',
                _id: '1'
            },
            isError: false,
            isLoading: false
        })
        const user = userEvent.setup()
        render(<NoteDetail note={mockNote}/>, {wrapper: Wrapper})
        const button = screen.getByText("Eliminar")
        await user.click(button)
        expect(toast.success).toHaveBeenCalled()
        expect(toast.success).toHaveBeenCalledWith("Nota Eliminada")
    })
})