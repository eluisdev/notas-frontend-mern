
import AddNoteForm from "@/components/notes/AddNoteForm"
import { cleanup, render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, test, expect, vi, Mock, beforeEach, afterEach } from "vitest"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter } from "react-router-dom"
import { createNote } from "@/api/NoteAPI"
import { toast } from "react-toastify"


vi.mock('@/api/NoteAPI', () => ({
    createNote: vi.fn(),
}))

vi.mock('react-toastify', () => ({
    toast: {
        success: vi.fn(),
        error: vi.fn(),
    },
}))

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom')
    return {
        ...actual,
        useParams: vi.fn(() => ({ projectId: '123' })),
        useLocation: vi.fn(() => ({
            search: '?viewTask=456',
        })),
    }
})

const queryClient = new QueryClient()

const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
        <BrowserRouter>
            {children}
        </BrowserRouter>
    </QueryClientProvider>
)


describe("<AddNoteForm/>", () => {

    beforeEach(()=>{
        render(<AddNoteForm />, { wrapper: Wrapper })
    })

    afterEach(()=>{
        cleanup()
        vi.clearAllMocks()
    })

    test("render the form correctly", () => {
        
        const form = screen.getByRole("form")
        expect(form).toBeDefined()
        expect(form).not.toBeNull()

        const [inputText] = form.querySelectorAll("input")

        expect(inputText).toBeDefined()
        expect(inputText).not.toBeNull()
    })

    test("shows error with input empty", async () => {
        const user = userEvent.setup()
        const form = screen.getByRole("form")
        const [, inputButton] = form.querySelectorAll("input")
        await user.click(inputButton)
        expect(form.innerHTML.includes("El contenido de la nota es obligatorio")).toBeDefined();
    })

    test("add note in the form", async () => {
        (createNote as Mock).mockResolvedValue('Nota creada exitosamente')
        const user = userEvent.setup()
        const form = screen.getByRole("form")
        const [inputText, inputButton] = form.querySelectorAll("input")
        await user.type(inputText, "prueba")
        await user.click(inputButton)
        await waitFor(() => {
            expect(createNote).toHaveBeenCalledTimes(1)
            expect(createNote).toHaveBeenCalledWith({
                projectId:'123', 
                taskId: '456', 
                formData: { content: 'prueba' }
            })
            expect(toast.success).toHaveBeenCalledWith('Nota creada exitosamente')
            expect(inputText.value).toBe("")
        })
    })
})