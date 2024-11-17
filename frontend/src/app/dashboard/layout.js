'use client'
import { useAuth } from '@/hooks/auth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Loading from '@/components/Loading'
import * as React from 'react'
import { alpha } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import AppNavbar from '@/components/AppNavbar'

import SideMenu from '@/components/SideMenu'

const DashboardLayout = ({ children }) => {
    const { loading, user } = useAuth({ middleware: 'auth' })
    const router = useRouter()

    useEffect(() => {
        if (!loading) {
            if (!user) {
                router.push('/login')
            } else if (!user.email_verified_at) {
                router.push('/verify-email')
            }
        }
    }, [user, loading, router])

    if (!user) {
        return <Loading />
    }

    return (
        <>
            <CssBaseline enableColorScheme />
            <Box sx={{ display: 'flex' }}>
                <SideMenu user={user} />
                <AppNavbar user={user} />

                <Box
                    component="main"
                    sx={theme => ({
                        flexGrow: 1,
                        backgroundColor: theme.vars
                            ? `rgba(${theme.vars.palette.background.defaultChannel} / 1)`
                            : alpha(theme.palette.background.default, 1),
                        overflow: 'auto',
                    })}>
                    <Stack
                        spacing={2}
                        sx={{
                            alignItems: 'center',
                            mx: 3,
                            pb: 0,
                            mt: { xs: 8, md: 0 },
                        }}></Stack>
                    <main>{children}</main>
                </Box>
            </Box>
        </>
    )
}

export default DashboardLayout
