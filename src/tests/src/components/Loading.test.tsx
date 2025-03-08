import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import Loading from "@/components/Loading";

describe("<Loading />", () => {
    test("should render", () => {
        render(<Loading />)
        expect(screen.getByRole("status")).toBeDefined()
    })
})