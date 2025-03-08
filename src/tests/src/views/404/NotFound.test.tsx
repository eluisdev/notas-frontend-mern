import NotFound from "@/views/404/NotFound";
import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, test } from "vitest";

describe("<NotFound />", () => {

    beforeEach(() => {
        cleanup()
    })

    test("should render", () => {
        render(
            <MemoryRouter>
                <NotFound />
            </MemoryRouter>
        )
        expect(screen.getByText("Página No Encontrada")).toBeDefined()
    })

    test('The "Projects" link renders correctly with the "/" path', () => {
        render(
            <MemoryRouter>
                <NotFound />
            </MemoryRouter>
        );

        const link = screen.getByText("Proyectos");
        expect(link).toBeDefined();
        expect(link.getAttribute("href")).toBe("/")
    });
})