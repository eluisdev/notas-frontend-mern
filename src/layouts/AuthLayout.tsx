import Logo from '@/components/Logo'
import { Outlet } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'

export default function AuthLayout() {

    return (
        <>
            <div className='bg-gradient bg-180 animate-gradient-animation min-h-screen px-10 sm:px-20 flex'>
                <div className='py-10 lg:py-20 flex justify-center items-center min-h-full w-full flex-col sm:flex-row gap-5' >
                    <div className='flex-1'>
                        <Logo className='mx-auto' />
                    </div>
                    <div className='flex-1'>
                        <Outlet />
                    </div>
                </div>
            </div>
            <ToastContainer
                pauseOnHover={false}
                pauseOnFocusLoss={false}
            />
        </>
    )
}
