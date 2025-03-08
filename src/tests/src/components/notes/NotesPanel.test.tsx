import NotesPanel from "@/components/notes/NotesPanel";
import { useAuth } from "@/hooks/useAuth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, Mock, test, vi } from "vitest";

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

describe("<NotesPanel />", () => {

    test("should be render", () => {
        (useAuth as Mock).mockResolvedValue({
            data: {
                name: 'enrique',
                email: 'example@gmail.com',
                _id: '1'
            },
            isError: false,
            isLoading: false
        })
        const mockNotes = [{
            _id: "1",
            content: "test todo",
            createdBy: {
                _id: "1",
                name: "enrique",
                email: "example@gmail.com"
            },
            task: "task example",
            createdAt: "2025-02-22T14:30:00.000Z"
        }]
        render(<NotesPanel notes={mockNotes} />, { wrapper: Wrapper })
    })
})