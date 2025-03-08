import Tabs from "@/components/profile/Tabs";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useLocation } from "react-router-dom";
import { describe, expect, Mock, test, vi } from "vitest";

const mockNavigate = vi.fn()

vi.mock("react-router-dom", () => ({
    ...vi.importActual("react-router-dom"),
    useNavigate: () => mockNavigate,
    useLocation: vi.fn(),
    Link: vi.fn(),
}))


describe("<Tabs />", () => {
    test("should be render and use useNavigate", async () => {
        (useLocation as Mock).mockReturnValue({ pathname: "/profile" })
        render(<Tabs />)
        const user = userEvent.setup()
        const select = screen.getByRole("combobox")
        await user.selectOptions(select, "/profile/password")
        expect(mockNavigate).toHaveBeenCalledWith("/profile/password")
    })
})