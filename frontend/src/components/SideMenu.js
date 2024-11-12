import * as React from 'react'
import { styled } from '@mui/material/styles'
import Avatar from '@mui/material/Avatar'
import MuiDrawer, { drawerClasses } from '@mui/material/Drawer'
import Box from '@mui/material/Box'

import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

import MenuContent from '@/components/MenuContent'
import ApplicationLogo from './ApplicationLogo'
import { Divider } from '@mui/material'
import { useRouter } from 'next/navigation'
import Button from '@mui/material/Button'

const drawerWidth = 240

const Drawer = styled(MuiDrawer)({
    width: drawerWidth,
    flexShrink: 0,
    boxSizing: 'border-box',
    mt: 10,
    [`& .${drawerClasses.paper}`]: {
        width: drawerWidth,
        boxSizing: 'border-box',
    },
})

export default function SideMenu({ user }) {
    const router = useRouter()
    const handleRedirectProfile = () => {
        router.push('/profile')
    }
    return (
        <Drawer
            variant="permanent"
            sx={{
                display: { xs: 'none', md: 'block' },
                [`& .${drawerClasses.paper}`]: {
                    backgroundColor: 'background.paper',
                },
            }}>
            <div className="p-5 justify-center w-full flex">
                <ApplicationLogo />
            </div>
            <Divider />
            <MenuContent />
            <Button onClick={handleRedirectProfile} fullWidth>
                <Stack
                    direction="row"
                    sx={{
                        p: 2,
                        gap: 2, // Increase gap between elements
                        alignItems: 'center',
                        width: '100%', // Make sure it takes up full width
                        borderTop: '1px solid',
                        borderColor: 'divider',
                        transition: 'background-color 0.3s, transform 0.1s',
                        '&:hover': {
                            backgroundColor: '#f0f4f8',
                        },
                    }}>
                    <Avatar
                        sizes="small"
                        alt="image"
                        src={
                            user?.image
                                ? `/storage/${user.image}`
                                : '/default-profile.jpg'
                        }
                        sx={{ width: 40, height: 40 }} // Adjust size to match text
                    />
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            mr: 'auto',
                        }}>
                        <Typography
                            variant="body2"
                            sx={{ fontSize: '12px', fontWeight: '500' }}>
                            {user?.name}
                        </Typography>
                    </Box>
                </Stack>
            </Button>
        </Drawer>
    )
}
