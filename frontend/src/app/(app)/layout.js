'use client'
import { useAuth } from '@/hooks/auth'
import Navigation from '@/app/(app)/Navigation'
import Sidebar from '@/app/(app)/Sidebar'
import { Box, Toolbar } from '@mui/material'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Loading from '@/app/(app)/Loading'

const AppLayout = ({ children }) => {
    const { loading, user } = useAuth({ middleware: 'auth' })
    const router = useRouter()

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login')
        }
    }, [user, router, loading])

    if (!user) {
        return <Loading />
    }

    return (
        <>
            <Box sx={{ display: 'flex' }}>
                <Sidebar />

                {/* Main content */}

                <Box
                    component="main"
                    sx={{ flexGrow: 1, bgcolor: 'background.default', p: 0 }}>
                    <div className="min-h-screen bg-gray-100">
                        {/* Navigation Bar */}
                        <Navigation user={user} />

                        {/* Main Content */}
                        <main>{children}</main>
                    </div>
                </Box>
            </Box>
        </>
    )
}

export default AppLayout
