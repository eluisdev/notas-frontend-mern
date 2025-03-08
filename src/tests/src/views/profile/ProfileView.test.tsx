import ProfileView from "@/views/profile/ProfileView";
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import { render } from "@testing-library/react";
import { describe, Mock, test, vi } from "vitest";


vi.mock("@tanstack/react-query", async () => {
    const actual = await vi.importActual("@tanstack/react-query")
    return {
        ...actual,
        useQuery: vi.fn()
    }
})
const queryClient = new QueryClient()

const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
        {children}
    </QueryClientProvider>
)
describe("<ChangePasswordView />", () => {
    test("should render", () => {
        (useQuery as Mock).mockReturnValue({ data: {}, isError: false })
        render(<ProfileView />, { wrapper })
    })
})