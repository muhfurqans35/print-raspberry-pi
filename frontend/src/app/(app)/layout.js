'use client'
import { useAuth } from '@/hooks/auth'
import Navigation from '@/app/(app)/Navigation'
import Loading from '@/app/(app)/Loading'
import Sidebar from '@/app/(app)/Sidebar'
import { Box, Toolbar } from '@mui/material'

const AppLayout = ({ children }) => {
    const { user } = useAuth({ middleware: 'auth' })

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
