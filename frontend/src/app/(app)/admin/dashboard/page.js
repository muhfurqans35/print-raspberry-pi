'use client'

import Header from '@/app/(app)/Header'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/auth'

// export const metadata = {
//     title: 'Laravel - Dashboard',
// }

const Dashboard = () => {
    const router = useRouter()
    const { user, roles } = useAuth({ middleware: 'auth' })

    useEffect(() => {
        if (!roles.includes('admin')) {
            router.push('/unauthorized') // Redirect ke halaman unauthorized atau yang sesuai
        }
    }, [roles])
    return (
        <>
            <Header title="Dashboard" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            Dashboard Admin
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Dashboard
