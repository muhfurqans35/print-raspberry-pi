import * as React from 'react'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Stack from '@mui/material/Stack'
import HomeRoundedIcon from '@mui/icons-material/HomeRounded'
import PrintIcon from '@mui/icons-material/Print'
import PrintOutlinedIcon from '@mui/icons-material/PrintOutlined'
import LocalGroceryStoreIcon from '@mui/icons-material/LocalGroceryStore'
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard'
import InventoryIcon from '@mui/icons-material/Inventory'
import Link from 'next/link'
import { useAuth } from '@/hooks/auth'
export default function MenuContent() {
    const { getDashboardUrl } = useAuth()
    const mainListItems = [
        { text: 'Home', icon: <HomeRoundedIcon />, href: '/' },
        {
            text: 'Dashboard',
            icon: <SpaceDashboardIcon />,
            href: getDashboardUrl(),
        },
        { text: 'Orders', icon: <LocalGroceryStoreIcon />, href: '/order' },
        { text: 'Items', icon: <InventoryIcon />, href: '/item' },
        { text: 'Printers', icon: <PrintOutlinedIcon />, href: '/printer' },
        { text: 'Print', icon: <PrintIcon />, href: '/print' },
    ]
    return (
        <>
            <Stack sx={{ flexGrow: 1, p: 1, justifyContent: 'space-between' }}>
                <List dense>
                    {mainListItems.map((item, index) => (
                        <Link href={item.href} key={item.text} passHref>
                            <ListItem button component="a">
                                <ListItemIcon>{item.icon}</ListItemIcon>
                                <ListItemText primary={item.text} />
                            </ListItem>
                        </Link>
                    ))}
                </List>
            </Stack>
        </>
    )
}
