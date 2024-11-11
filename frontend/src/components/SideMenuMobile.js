import * as React from 'react'
import PropTypes from 'prop-types'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Drawer, { drawerClasses } from '@mui/material/Drawer'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded'
import MenuContent from './MenuContent'
import { useAuth } from '@/hooks/auth'
import { useRouter } from 'next/navigation'

function SideMenuMobile({ open, toggleDrawer, user }) {
    const { logout } = useAuth()
    const router = useRouter()
    const handleRedirectProfile = () => {
        router.push('/profile')
    }
    return (
        <Drawer
            anchor="left"
            open={open}
            onClose={toggleDrawer(false)}
            sx={{
                zIndex: theme => theme.zIndex.drawer + 1,
                [`& .${drawerClasses.paper}`]: {
                    backgroundImage: 'none',
                    backgroundColor: 'background.paper',
                },
            }}>
            <Stack
                sx={{
                    maxWidth: '70dvw',
                    height: '100%',
                }}>
                <Stack
                    direction="row"
                    sx={{
                        p: 2,
                        pb: 2,
                        gap: 0,
                    }}>
                    <Stack
                        direction="row"
                        sx={{
                            gap: 0,
                            alignItems: 'center',
                            flexGrow: 1,
                            p: 2,
                            pb: 2,
                            cursor: 'pointer',
                            transition: 'background-color 0.3s, transform 0.1s',
                            '&:hover': {
                                backgroundColor: '#f0f4f8',
                            },
                            '&:active': {
                                transform: 'scale(0.98)',
                            },
                        }}
                        onClick={handleRedirectProfile}>
                        <Avatar
                            sizes="small"
                            alt="image"
                            src={
                                user?.image
                                    ? `/storage/${user.image}`
                                    : '/default-profile.jpg'
                            }
                            sx={{ width: 24, height: 24 }}
                        />
                        <Typography component="p" variant="h8">
                            {user?.name}
                        </Typography>
                    </Stack>
                </Stack>
                <Divider />
                <Stack sx={{ flexGrow: 1 }}>
                    <MenuContent />
                    <Divider />
                </Stack>
                <Stack sx={{ p: 2 }}>
                    <Button
                        variant="outlined"
                        fullWidth
                        startIcon={<LogoutRoundedIcon />}
                        onClick={logout}>
                        Logout
                    </Button>
                </Stack>
            </Stack>
        </Drawer>
    )
}

SideMenuMobile.propTypes = {
    open: PropTypes.bool,
    toggleDrawer: PropTypes.func.isRequired,
}

export default SideMenuMobile
