import { Link, Navigate, useNavigate, useParams } from "react-router-dom"
import { useQuery } from '@tanstack/react-query'
import { getFullProject } from "@/api/ProjectAPI"
import AddTaskModal from "@/components/tasks/AddTaskModal"
import TaskList from "@/components/tasks/TaskList"
import EditTaskData from "@/components/tasks/EditTaskData"
import TaskModalDetails from "@/components/tasks/TaskModalDetails"
import { useAuth } from "@/hooks/useAuth"
import { isManager } from "@/utils/policies"
import { useMemo } from "react"
import Loading from "@/components/Loading"

export default function ProjectDetailsView() {

    const { data: user, isLoading: authLoading } = useAuth()
    const navigate = useNavigate()

    const params = useParams()
    const projectId = params.projectId!
    const { data, isLoading, isError } = useQuery({
        queryKey: ['project', projectId],
        queryFn: () => getFullProject(projectId),
        retry: false
    })
    const canEdit = useMemo(() => data?.manager === user?._id, [data, user])
    if (isLoading && authLoading) return <Loading />
    if (isError) return <Navigate to='/404' />
    if (data && user) return (
        <>
            <h1 className="text-3xl font-black">{data.projectName}</h1>
            <p className="text-xl font-light text-gray-500 mt-2">Descripción: {data.description}</p>

            {isManager(data.manager, user._id) && (
                <nav className="my-5 flex max-sm:flex-col gap-3">
                    <button
                        type="button"
                        className="bg-yellow-500 hover:bg-yellow-600 px-10 py-3 text-white font-bold cursor-pointer transition-colors"
                        onClick={() => navigate(location.pathname + '?newTask=true')}
                    >Agregar Tarea</button>

                    <Link
                        to={'team'}
                        className="bg-yellow-800 hover:bg-yellow-950 px-10 py-3 text-white font-bold cursor-pointer transition-colors"
                    >Colaboradores</Link>
                </nav>
            )}

            <TaskList
                tasks={data.tasks}
                canEdit={canEdit}
            />
            <AddTaskModal />
            <EditTaskData />
            <TaskModalDetails />
        </>
    )
}
