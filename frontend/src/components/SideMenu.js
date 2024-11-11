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

            <Stack
                direction="row"
                sx={{
                    p: 2,
                    gap: 1,
                    alignItems: 'center',
                    borderTop: '1px solid',
                    borderColor: 'divider',
                }}>
                <Avatar
                    sizes="small"
                    alt="image"
                    src={
                        user?.image
                            ? `/storage/${user.image}`
                            : '/default-profile.jpg'
                    }
                    sx={{ width: 36, height: 36 }}
                />
                <Box sx={{ mr: 'auto' }}>
                    <Typography
                        variant="body2"
                        sx={{ fontWeight: 500, lineHeight: '16px' }}>
                        {user?.name}
                    </Typography>
                    <Typography
                        variant="caption"
                        sx={{ color: 'text.secondary' }}>
                        {user?.email}
                    </Typography>
                </Box>
            </Stack>
        </Drawer>
    )
}
