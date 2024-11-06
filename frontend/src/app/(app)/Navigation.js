'use client'

import Dropdown from '@/components/Dropdown'

import ResponsiveNavLink, {
    ResponsiveNavButton,
} from '@/components/ResponsiveNavLink'
import { DropdownButton } from '@/components/DropdownLink'
import { useAuth } from '@/hooks/auth'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { IconButton } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'

const Navigation = ({ user }) => {
    const router = useRouter()
    const { logout, getDashboardUrl } = useAuth()

    const [open, setOpen] = useState(false)
    const handleRedirectProfile = () => {
        router.push('/profile')
    }

    return (
        <nav className="bg-white border-b border-gray-100">
            {/* Primary Navigation Menu */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        {/* Logo */}
                        <div className="flex-shrink-0 flex items-center"></div>
                    </div>

                    {/* Settings Dropdown */}
                    <div className="hidden sm:flex sm:items-center sm:ml-6">
                        <Dropdown
                            align="right"
                            width="48"
                            trigger={
                                <button className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 focus:outline-none transition duration-150 ease-in-out">
                                    <div>{user?.name}</div>

                                    <div className="ml-1">
                                        <svg
                                            className="fill-current h-4 w-4"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20">
                                            <path
                                                fillRule="evenodd"
                                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </div>
                                </button>
                            }>
                            {/* Authentication */}
                            <DropdownButton onClick={handleRedirectProfile}>
                                Profile
                            </DropdownButton>
                            <DropdownButton onClick={logout}>
                                Logout
                            </DropdownButton>
                        </Dropdown>
                    </div>

                    {/* Hamburger */}
                    <IconButton
                        color="gray"
                        aria-label="open drawer"
                        edge="start"
                        onClick={() => setOpen(open => !open)}
                        sx={{ ml: 0, display: { sm: 'none' }, mt: 1 }}>
                        <MenuIcon />
                    </IconButton>
                </div>
            </div>

            {/* Responsive Navigation Menu */}
            {open && (
                <div className="block sm:hidden w-full">
                    {/* Responsive Settings Options */}
                    <div className="pt-4 border-t border-gray-200 ">
                        <ResponsiveNavLink
                            href="/profile"
                            active={usePathname() === '/profile'}>
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <img
                                        height={48}
                                        width={48}
                                        className="rounded"
                                        src={
                                            user?.image
                                                ? `/storage/${user.image}`
                                                : '/default-profile.jpg'
                                        }
                                        alt="Profile"
                                    />
                                </div>

                                <div className="ml-3">
                                    <div className="font-medium text-base text-gray-800">
                                        {user?.name}
                                    </div>
                                    <div className="font-medium text-sm text-gray-500">
                                        {user?.email}
                                    </div>
                                </div>
                            </div>
                        </ResponsiveNavLink>

                        <div className="mt-3 space-y-1">
                            {/* Authentication */}
                            <ResponsiveNavButton onClick={logout}>
                                Logout
                            </ResponsiveNavButton>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    )
}

export default Navigation
