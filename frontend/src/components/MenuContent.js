import * as React from 'react'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import Button from '@mui/material/Button'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Stack from '@mui/material/Stack'
import HomeRoundedIcon from '@mui/icons-material/HomeRounded'
import PrintIcon from '@mui/icons-material/Print'
import PrintOutlinedIcon from '@mui/icons-material/PrintOutlined'
import LocalGroceryStoreIcon from '@mui/icons-material/LocalGroceryStore'
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard'
import InventoryIcon from '@mui/icons-material/Inventory'
import LogoutIcon from '@mui/icons-material/Logout'
import AccountBoxIcon from '@mui/icons-material/AccountBox'
import Link from 'next/link'
import { useAuth } from '@/hooks/auth'
import { useRouter } from 'next/navigation'
export default function MenuContent() {
    const { getDashboardUrl, logout } = useAuth()
    const router = useRouter()
    const currentPath = router.pathname || ''
    const mainListItems = [
        { text: 'Home', icon: <HomeRoundedIcon />, href: '/' },
        {
            text: 'Dashboard',
            icon: <SpaceDashboardIcon />,
            href: getDashboardUrl(),
        },
        {
            text: 'Orders',
            icon: <LocalGroceryStoreIcon />,
            href: '/dashboard/order',
        },
        { text: 'Items', icon: <InventoryIcon />, href: '/dashboard/item' },
        {
            text: 'Printers',
            icon: <PrintOutlinedIcon />,
            href: '/dashboard/printer',
        },
        { text: 'Print', icon: <PrintIcon />, href: '/dashboard/print' },
    ]
    const secondaryListItems = [
        { text: 'Profile', icon: <AccountBoxIcon />, href: '/profile' },
        { text: 'Logout', icon: <LogoutIcon />, href: '/logout' },
    ]
    return (
        <>
            <Stack sx={{ flexGrow: 1, p: 1, justifyContent: 'space-between' }}>
                <List dense>
                    {mainListItems.map((item, index) => (
                        <Link href={item.href} key={item.text} passHref>
                            <ListItem
                                button
                                component="a"
                                selected={
                                    currentPath &&
                                    currentPath.startsWith(item.href)
                                }
                                sx={{
                                    '&.Mui-selected': {
                                        backgroundColor: 'primary.light',
                                        color: 'primary.main',
                                        fontWeight: 'bold',
                                    },
                                    '&:hover': {
                                        backgroundColor: 'primary.light',
                                    },
                                }}>
                                <ListItemIcon>{item.icon}</ListItemIcon>
                                <ListItemText primary={item.text} />
                            </ListItem>
                        </Link>
                    ))}
                </List>

                <List dense>
                    <Stack sx={{ p: 2 }}>
                        <Button
                            variant="outlined"
                            fullWidth
                            startIcon={<LogoutIcon />}
                            onClick={logout}>
                            Logout
                        </Button>
                    </Stack>
                </List>
            </Stack>
        </>
    )
}
