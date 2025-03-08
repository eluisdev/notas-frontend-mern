import { Link, Outlet, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Logo from '@/components/Logo'
import NavMenu from '@/components/NavMenu'
import { useAuth } from '@/hooks/useAuth'
import Loading from '@/components/Loading'

export default function AppLayout() {

    const { data, isError, isLoading } = useAuth()
    if (isLoading) return <Loading allPage />
    if (isError) {
        return <Navigate to='/auth/login' />
    }
    if (data) return (
        <>
            <header className='bg-gray-900 py-5'>
                <div className='max-w-screen-xl mx-auto flex flex-col gap-5 lg:flex-row justify-between items-center max-xl:px-10 sm:gap-0' >

                    <Link to={'/'}>
                        <Logo className='h-10' />
                    </Link>

                    <NavMenu
                        name={data.name}
                    />
                </div>
            </header>
            <section className='max-w-screen-xl mx-auto py-5 max-xl:px-10' >
                <Outlet />
            </section>
            <footer className='py-5'>
                <p className='text-center'>
                    Todos los derechos reservados {new Date().getFullYear()}
                </p>
            </footer>
            <ToastContainer
                pauseOnHover={false}
                pauseOnFocusLoss={false}
            />
        </>
    )
}
