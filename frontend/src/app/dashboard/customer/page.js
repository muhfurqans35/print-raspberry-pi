'use client'

import Header from '@/components/Header'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/auth'

const Dashboard = () => {
    const router = useRouter()
    const { roles } = useAuth()

    useEffect(() => {
        if (!roles.includes('customer')) {
            router.push('/unauthorized')
        }
    }, [roles])
    return (
        <>
            <Header title="Dashboard" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            Dashboard Customer
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Dashboard
