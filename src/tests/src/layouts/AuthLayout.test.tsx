import AuthLayout from "@/layouts/AuthLayout";
import { render } from "@testing-library/react";
import { describe, test } from "vitest";

describe("<AuthLayout />", () => {
    test("should render", () => {
        render(<AuthLayout />)
    })
})