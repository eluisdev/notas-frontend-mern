import { getUser } from "@/api/AuthAPI";
import { useAuth } from "@/hooks/useAuth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { describe, expect, Mock, test, vi } from "vitest";

vi.mock("@/api/AuthAPI", () => {
    return {
        getUser: vi.fn()
    }
})

const queryClient = new QueryClient()

const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
        {children}
    </QueryClientProvider>
)

describe("useAuth hook", () => {
    test("should get user", async () => {
        const userMocked = { _id: "1", name: "example", email: "example@example.com" };
        (getUser as Mock).mockResolvedValueOnce(userMocked)
        const { result } = renderHook(() => useAuth(), { wrapper })
        await waitFor(() => expect(result.current.isLoading).toBeFalsy())
        expect(result.current.data).toBe(userMocked)
    })
})