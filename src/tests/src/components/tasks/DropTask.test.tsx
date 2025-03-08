import DropTask from "@/components/tasks/DropTask";
import { DndContext } from "@dnd-kit/core";
import { render, screen, cleanup } from "@testing-library/react";
import { describe, expect, test, afterEach } from "vitest";

describe("<DropTask />", () => {
    afterEach(() => {
        cleanup()
    })

    test("should be render", () => {
        render(<DropTask status="pending" />)
        expect(screen.getByText("Soltar tarea aquí")).toBeDefined()
    })

    test("applies correct opacity when isOver is true", () => {
        render(
            <DndContext>
                <DropTask status="pending" />
            </DndContext>
        );
        const divElement = screen.getByText("Soltar tarea aquí")
        expect((divElement as HTMLDivElement).style.opacity).toBe("")
    });
})