import React, { useState } from 'react'
import {
    AppBar,
    Box,
    Button,
    Container,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Menu,
    MenuItem,
    Toolbar,
    Typography,
    Avatar,
    useMediaQuery,
    useTheme,
} from '@mui/material'
import {
    Print,
    Menu as MenuIcon,
    AccountCircle,
    Person,
    ExitToApp,
} from '@mui/icons-material'
import { useAuth } from '@/hooks/auth'
import { useRouter } from 'next/navigation'
import ApplicationLogo2 from './ApplicationLogo2'

const LandingPage = () => {
    const [mobileOpen, setMobileOpen] = useState(false)
    const [anchorEl, setAnchorEl] = useState(null)
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('md'))
    const { user, logout } = useAuth({ middleware: 'guest' })
    const router = useRouter()
    const navItems = [
        { label: 'Home', href: '/' },
        { label: 'Orders', href: '/order/create' },
        { label: 'Contact', href: '/contact' },
        { label: 'FAQ', href: '/faq' },
    ]

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen)
    }

    const handleMenuClick = event => {
        setAnchorEl(event.currentTarget)
    }

    const handleMenuClose = () => {
        setAnchorEl(null)
    }

    const handleLogin = () => {
        router.push('/login')
    }
    const handleOrderIndex = () => {
        router.push('/order/index')
    }
    const handleRegister = () => {
        router.push('/register')
    }
    const handleProfile = () => {
        router.push('/profile')
    }

    // Menu untuk user yang sudah login
    const userMenu = (
        <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}>
            <MenuItem onClick={handleProfile} sx={{ gap: 1 }}>
                <Person fontSize="small" />
                Profile
            </MenuItem>
            <MenuItem onClick={handleOrderIndex} sx={{ gap: 1 }}>
                <Person fontSize="small" />
                My Orders
            </MenuItem>
            <MenuItem onClick={logout} sx={{ gap: 1 }}>
                <ExitToApp fontSize="small" />
                Logout
            </MenuItem>
        </Menu>
    )

    // Drawer content untuk mobile
    const drawer = (
        <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
            <List>
                {navItems.map(item => (
                    <ListItem key={item.label} disablePadding>
                        <ListItemButton sx={{ textAlign: 'center' }}>
                            <ListItemText primary={item.label} />
                        </ListItemButton>
                    </ListItem>
                ))}
                {!user ? (
                    <ListItem disablePadding>
                        <ListItemButton
                            sx={{ textAlign: 'center' }}
                            onClick={handleLogin}>
                            <ListItemText primary="Login" />
                        </ListItemButton>
                        <ListItemButton
                            sx={{ textAlign: 'center' }}
                            onClick={handleRegister}>
                            <ListItemText primary="Register" />
                        </ListItemButton>
                    </ListItem>
                ) : (
                    <>
                        <ListItem disablePadding>
                            <ListItemButton sx={{ textAlign: 'center' }}>
                                <ListItemText primary="Profile" />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton
                                sx={{ textAlign: 'center' }}
                                onClick={logout}>
                                <ListItemText primary="Logout" />
                            </ListItemButton>
                        </ListItem>
                    </>
                )}
            </List>
        </Box>
    )

    return (
        <>
            {/* Navbar */}
            <AppBar position="fixed" sx={{ bgcolor: 'black' }}>
                <Container maxWidth="xl">
                    <Toolbar>
                        <Typography
                            variant="h6"
                            component="div"
                            sx={{
                                flexGrow: 1,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                            }}>
                            <ApplicationLogo2 />
                        </Typography>

                        {!isMobile ? (
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 2,
                                }}>
                                {navItems.map(item => (
                                    <Button
                                        key={item.label}
                                        sx={{ color: 'white' }}>
                                        {item.label}
                                    </Button>
                                ))}

                                {/* Conditional rendering berdasarkan status login */}
                                {user ? (
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 1,
                                        }}>
                                        <Button
                                            onClick={handleMenuClick}
                                            sx={{
                                                color: 'white',
                                                textTransform: 'none',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 1,
                                            }}>
                                            {user ? (
                                                <Avatar
                                                    src={
                                                        user?.image
                                                            ? `/storage/${user.image}`
                                                            : '/default-profile.jpg'
                                                    }
                                                    sx={{
                                                        width: 32,
                                                        height: 32,
                                                    }}
                                                />
                                            ) : (
                                                <AccountCircle
                                                    sx={{ fontSize: 32 }}
                                                />
                                            )}
                                            {user.name}
                                        </Button>
                                        {userMenu}
                                    </Box>
                                ) : (
                                    <Box sx={{ display: 'flex', gap: 2 }}>
                                        <Button
                                            variant="contained"
                                            onClick={handleLogin}
                                            sx={{
                                                bgcolor: 'rgb(56, 189, 248)',
                                                '&:hover': {
                                                    bgcolor:
                                                        'rgb(14, 165, 233)',
                                                },
                                            }}>
                                            Login
                                        </Button>
                                        <Button
                                            variant="contained"
                                            onClick={handleRegister}
                                            sx={{
                                                bgcolor: 'rgb(56, 189, 248)',
                                                '&:hover': {
                                                    bgcolor:
                                                        'rgb(14, 165, 233)',
                                                },
                                            }}>
                                            Register
                                        </Button>
                                    </Box>
                                )}
                            </Box>
                        ) : (
                            <IconButton
                                color="inherit"
                                aria-label="open drawer"
                                edge="start"
                                onClick={handleDrawerToggle}>
                                <MenuIcon />
                            </IconButton>
                        )}
                    </Toolbar>
                </Container>
            </AppBar>

            {/* Mobile Drawer */}
            <Drawer
                variant="temporary"
                anchor="right"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{
                    keepMounted: true,
                }}>
                {drawer}
            </Drawer>
        </>
    )
}

export default LandingPage
