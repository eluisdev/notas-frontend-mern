import ProjectForm from "@/components/projects/ProjectForm";
import { ProjectFormData } from "@/types/index";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { UseFormRegister } from "react-hook-form";
import { afterEach, describe, expect, test, vi } from "vitest";

describe("<ProjectForm />", () => {
    const mockErrors = {
        projectName: { type: "required", message: "El Titulo del Proyecto es obligatorio" },
        clientName: { type: "required", message: "El Nombre del Cliente es obligatorio" },
        description: { type: "required", message: "Una descripción del proyecto es obligatoria" }
    }

    const mockRegister: UseFormRegister<ProjectFormData> = (fieldName) => ({
        onChange: vi.fn(),
        onBlur: vi.fn(),
        ref: vi.fn(),
        name: fieldName,
    });

    afterEach(() => {
        cleanup()
        vi.clearAllMocks()
    })

    test("should be render", () => {
        render(<ProjectForm errors={{}} register={mockRegister} />)
        expect(screen.getByText("Nombre del Proyecto")).not.toBeNull()
    })

    test("displays error messages when there are validation errors", () => {
        render(<ProjectForm register={mockRegister} errors={mockErrors} />);
        expect(screen.getByText(mockErrors.projectName.message)).toBeDefined();
        expect(screen.getByText(mockErrors.clientName.message)).not.toBeNull();
        expect(screen.getByText(mockErrors.description.message)).toBeDefined();
    })

    test("allows to user to type into input fields", async () => {
        const user = userEvent.setup();
        render(<ProjectForm register={mockRegister} errors={{}} />);
        const projectNameInput = screen.getByPlaceholderText("Nombre del Proyecto");
        const clientNameInput = screen.getByPlaceholderText("Nombre del Cliente");
        const descriptionInput = screen.getByPlaceholderText("Descripción del Proyecto");
        await user.type(projectNameInput, "Nuevo Proyecto"),
        await user.type(clientNameInput, "Cliente XYZ"),
        await user.type(descriptionInput, "Este es un proyecto de prueba")
        expect((projectNameInput as HTMLInputElement).value).toBe("Nuevo Proyecto");
        expect((clientNameInput as HTMLInputElement).value).toBe("Cliente XYZ");
        expect((descriptionInput as HTMLTextAreaElement).value).toBe("Este es un proyecto de prueba");
    })
})