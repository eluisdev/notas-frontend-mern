import ErrorMessage from "@/components/ErrorMessage";
import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

describe("<ErrorMessage />", () => {
    test("should render", () => {
        render(<ErrorMessage>Error</ErrorMessage>)
        expect(screen.getByText("Error")).toBeDefined()
    })
})