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
    Menu as MenuIcon,
    AccountCircle,
    Person,
    ExitToApp,
    LocalGroceryStore,
    SpaceDashboard,
} from '@mui/icons-material'
import { useAuth } from '@/hooks/auth'
import { useRouter } from 'next/navigation'
import ApplicationLogo2 from './ApplicationLogo2'
import Link from 'next/link'

const NavbarHero = () => {
    const [mobileOpen, setMobileOpen] = useState(false)
    const [anchorEl, setAnchorEl] = useState(null)
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('md'))
    const { roles, user, logout, getDashboardUrl } = useAuth({
        middleware: 'guest',
    })
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
    const isAdminOrSuperAdmin =
        roles &&
        Array.isArray(roles) &&
        (roles.includes('admin') || roles.includes('super_admin'))
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
            {isAdminOrSuperAdmin && (
                <MenuItem
                    onClick={() => router.push(getDashboardUrl())}
                    sx={{ gap: 1 }}>
                    <SpaceDashboard fontSize="small" />
                    Dashboard
                </MenuItem>
            )}
            <MenuItem onClick={handleOrderIndex} sx={{ gap: 1 }}>
                <LocalGroceryStore fontSize="small" />
                My Orders
            </MenuItem>
            <MenuItem onClick={handleProfile} sx={{ gap: 1 }}>
                <Person fontSize="small" />
                Profile
            </MenuItem>

            <MenuItem onClick={logout} sx={{ gap: 1 }}>
                <ExitToApp fontSize="small" />
                Logout
            </MenuItem>
        </Menu>
    )

    // Drawer content for mobile
    const drawer = (
        <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
            <List>
                {navItems.map(item => (
                    <Link href={item.href} passHref key={item.label}>
                        <ListItemButton sx={{ textAlign: 'center' }}>
                            <ListItemText primary={item.label} />
                        </ListItemButton>
                    </Link>
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
                            <ListItemButton
                                onClick={() => router.push(getDashboardUrl())}
                                sx={{ textAlign: 'center' }}>
                                <ListItemText primary="Dashboard" />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton
                                onClick={() => router.push('/profile')}
                                sx={{ textAlign: 'center' }}>
                                <ListItemText primary="Profile" />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton
                                onClick={() => router.push('/order/index')}
                                sx={{ textAlign: 'center' }}>
                                <ListItemText primary="My Orders" />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton
                                onClick={logout}
                                sx={{ textAlign: 'center' }}>
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
                                    <ListItemButton
                                        component="a"
                                        key={item.label}
                                        sx={{ textAlign: 'center' }}
                                        href={item.href}>
                                        <ListItemText primary={item.label} />
                                    </ListItemButton>
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

export default NavbarHero
