import TaskForm from "@/components/tasks/TaskForm";
import { TaskFormData } from "@/types/index";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import { afterEach, describe, expect, test, vi } from "vitest";

describe("<TaskForm />", () => {
    const mockRegister: UseFormRegister<TaskFormData> = (fieldName) => ({
        onChange: vi.fn(),
        onBlur: vi.fn(),
        ref: vi.fn(),
        name: fieldName
    })

    const mockErrors: FieldErrors<TaskFormData> = {
        name: { type: "required", message: "El nombre de la tarea es obligatorio" },
        description: { type: "required", message: "La descripción de la tarea es obligatoria" }
    }

    afterEach(() => {
        cleanup()
        vi.clearAllMocks()
    })

    test("should render", () => {
        render(<TaskForm register={mockRegister} errors={{}} />)
        expect(screen.getByPlaceholderText("Nombre de la tarea")).toBeDefined()
        expect(screen.getByPlaceholderText("Descripción de la tarea")).toBeDefined()
    })

    test("should render errors", () => {
        render(<TaskForm register={mockRegister} errors={mockErrors} />)
        expect(screen.getByText("La descripción de la tarea es obligatoria")).toBeDefined()
    })

    test("allows to user to type into inputs", async () => {
        const user = userEvent.setup()
        render(<TaskForm register={mockRegister} errors={{}} />)
        const nameInput = screen.getByPlaceholderText("Nombre de la tarea")
        const descriptionInput = screen.getByPlaceholderText("Descripción de la tarea")
        await user.type(nameInput, "input example")
        await user.type(descriptionInput, "description example")
        expect((nameInput as HTMLInputElement).value).toBe("input example")
        expect((descriptionInput as HTMLTextAreaElement).value).toBe("description example")
    })
})