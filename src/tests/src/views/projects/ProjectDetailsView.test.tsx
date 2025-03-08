import { useAuth } from "@/hooks/useAuth";
import ProjectDetailsView from "@/views/projects/ProjectDetailsView";
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, Mock, test, vi } from "vitest";

vi.mock("@tanstack/react-query", async () => {
    const actual = await vi.importActual("@tanstack/react-query");
    return {
        ...actual,
        useQuery: vi.fn()
    };
});

vi.mock("@/hooks/useAuth", () => {
    return {
        useAuth: vi.fn()
    }
})

const queryClient = new QueryClient();

const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
        <MemoryRouter>
            {children}
        </MemoryRouter>
    </QueryClientProvider>
);

const mockProject = {
    _id: "1",
    projectName: "projectOne",
    clientName: "clientOne",
    description: "descriptionOne",
    manager: "managerOne",
    tasks: [{
        _id: "1",
        name: "Sample Task",
        description: "This is a test task",
        status: "pending",
    }],
    team: []
};

const mockTask = {
    _id: "1",
    name: "Sample Task",
    description: "This is a test task",
    status: "pending",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-02T00:00:00Z",
    completedBy: [],
    notes: [],
};

describe("<ProjectDetailsView />", () => {

    beforeEach(() => {
        cleanup()
        vi.clearAllMocks()
    });

    test("should render", () => {
        (useAuth as Mock).mockReturnValue({
            data: {
                _id: "1",
                name: "userExample",
                email: "example@example.com"
            },
            isLoading: false
        });
        (useQuery as Mock).mockImplementation(({ queryKey }) => {
            if (queryKey[0] === 'project') {
                return {
                    isLoading: false,
                    isError: false,
                    data: mockProject,
                };
            }
            if (queryKey[0] === 'task') {
                return {
                    isLoading: false,
                    isError: false,
                    data: mockTask,
                };
            }
            return {
                isLoading: false,
                isError: true,
                data: null,
            };
        });
        render(<ProjectDetailsView />, { wrapper });
        expect(screen.getByText("projectOne")).toBeDefined()
    });

    test("should show component loading", () => {
        (useAuth as Mock).mockReturnValue({
            data: {},
            isLoading: true
        });
        (useQuery as Mock).mockReturnValue({ isLoading: true, isError: false, data: undefined, });
        render(<ProjectDetailsView />, { wrapper });
        expect(screen.getByText("Loading...")).toBeDefined()
    });
});
