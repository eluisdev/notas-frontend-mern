import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import Logo from "@/components/Logo";

describe("<Logo />", () => {
    test("should render", () => {
        render(<Logo />)
        expect(screen.getByRole("img")).toBeDefined()
    })
})