import * as React from 'react'
import {
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Divider,
    Box,
    IconButton,
    useMediaQuery,
} from '@mui/material'
import InboxIcon from '@mui/icons-material/Inbox'
import MailIcon from '@mui/icons-material/Mail'
import MenuIcon from '@mui/icons-material/Menu'
import Link from 'next/link'
import ApplicationLogo from '@/components/ApplicationLogo'
import { useAuth } from '@/hooks/auth'
import { useTheme } from '@mui/material/styles'

const drawerWidth = 240

const Sidebar = () => {
    const { getDashboardUrl } = useAuth()
    const menuItems = [
        { text: 'Dashboard', icon: <InboxIcon />, href: getDashboardUrl() },
        { text: 'Orders', icon: <MailIcon />, href: '/order/index' },
        { text: 'Products', icon: <InboxIcon />, href: '/product' },
        { text: 'Customers', icon: <MailIcon />, href: '/order' },
        { text: 'Reports', icon: <InboxIcon />, href: '/order' },
    ]

    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
    const [mobileOpen, setMobileOpen] = React.useState(false)

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen)
    }

    const drawerContent = (
        <>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '12px 0',
                }}>
                <Link href="/">
                    <ApplicationLogo className="block h-10 w-auto fill-current text-gray-600" />
                </Link>
            </Box>
            <Divider />
            <List>
                {menuItems.map(item => (
                    <Link href={item.href} key={item.text} passHref>
                        <ListItem button component="a">
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.text} />
                        </ListItem>
                    </Link>
                ))}
            </List>
        </>
    )

    return (
        <Box sx={{ display: 'flex' }}>
            {isMobile ? (
                <>
                    <IconButton
                        color="gray"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ ml: 0, display: { sm: 'none' }, mt: 3 }}>
                        <MenuIcon />
                    </IconButton>
                    <Drawer
                        variant="temporary"
                        open={mobileOpen}
                        onClose={handleDrawerToggle}
                        ModalProps={{
                            keepMounted: true, // Better open performance on mobile.
                        }}
                        sx={{
                            display: { xs: 'block', sm: 'none' },
                            '& .MuiDrawer-paper': {
                                boxSizing: 'border-box',
                                width: drawerWidth,
                            },
                        }}>
                        {drawerContent}
                    </Drawer>
                </>
            ) : (
                <Drawer
                    variant="permanent"
                    sx={{
                        width: drawerWidth,
                        flexShrink: 0,
                        '& .MuiDrawer-paper': {
                            width: drawerWidth,
                            boxSizing: 'border-box',
                        },
                    }}
                    anchor="left">
                    {drawerContent}
                </Drawer>
            )}
        </Box>
    )
}

export default Sidebar
