'use client'
import { Box } from '@mui/material'
import NavbarHero from '@/components/NavbarHero'
import { useAuth } from '@/hooks/auth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Loading from '@/app/dashboard/Loading'

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
        <Box sx={{ minHeight: '100vh', bgcolor: 'white', color: 'black' }}>
            <NavbarHero user={user} />
            {children}
        </Box>
    )
}

export default AppLayout
