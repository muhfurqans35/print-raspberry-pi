'use client'

import Button from '@/components/Button'
import Input from '@/components/Input'
import InputError from '@/components/InputError'
import Label from '@/components/Label'
import Link from 'next/link'
import { useAuth } from '@/hooks/auth'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AuthSessionStatus from '@/app/(auth)/AuthSessionStatus'
import Loading from '@/app/(app)/Loading'
const Login = () => {
    const router = useRouter()

    const { login } = useAuth({
        middleware: 'guest',
        redirectIfAuthenticated: roles => {
            if (roles.includes('admin')) {
                return '/admin/dashboard'
            } else if (roles.includes('customer')) {
                return '/customer/dashboard'
            } else if (roles.includes('super_admin')) {
                return '/super-admin/dashboard'
            } else {
                return '/unauthorized'
            }
        },
    })

    const [identifier, setIdentifier] = useState('')
    const [password, setPassword] = useState('')
    const [shouldRemember, setShouldRemember] = useState(false)
    const [errors, setErrors] = useState({})
    const [status, setStatus] = useState(null)

    useEffect(() => {
        if (router.query?.reset && Object.keys(errors).length === 0) {
            setStatus(atob(router.query.reset))
        } else {
            setStatus(null)
        }
    }, [router.query, errors])

    const submitForm = async event => {
        event.preventDefault()

        try {
            await login({
                identifier,
                password,
                remember: shouldRemember,
                setErrors,
                setStatus,
            })
        } catch (error) {
            // Handle error if login fails
            console.error('Login failed:', error)
            setErrors({
                identifier: ['Login failed. Please check your credentials.'],
            })
        }
    }

    return (
        <>
            <AuthSessionStatus className="mb-4" status={status} />
            <form onSubmit={submitForm}>
                {/* Identifier (Email or Username) */}
                <div>
                    <Label htmlFor="identifier">Email or Username</Label>
                    <Input
                        id="identifier"
                        type="text"
                        value={identifier}
                        className="block mt-1 w-full"
                        onChange={event => setIdentifier(event.target.value)}
                        required
                        autoFocus
                        autoComplete="username"
                    />
                    <InputError messages={errors.identifier} className="mt-2" />
                </div>

                {/* Password */}
                <div className="mt-4">
                    <Label htmlFor="password">Password</Label>
                    <Input
                        id="password"
                        type="password"
                        value={password}
                        className="block mt-1 w-full"
                        onChange={event => setPassword(event.target.value)}
                        required
                        autoComplete="current-password"
                    />
                    <InputError messages={errors.password} className="mt-2" />
                </div>

                {/* Remember Me */}
                <div className="block mt-4">
                    <label
                        htmlFor="remember_me"
                        className="inline-flex items-center">
                        <input
                            id="remember_me"
                            type="checkbox"
                            name="remember"
                            className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            onChange={event =>
                                setShouldRemember(event.target.checked)
                            }
                        />
                        <span className="ml-2 text-sm text-gray-600">
                            Remember me
                        </span>
                    </label>
                </div>

                <div className="flex items-center justify-between mt-4">
                    <Link
                        href="/register"
                        className="underline text-sm text-gray-600 hover:text-gray-900">
                        Want to register?
                    </Link>

                    <div className="flex items-center">
                        <Link
                            href="/forgot-password"
                            className="underline text-sm text-gray-600 hover:text-gray-900 mr-3">
                            Forgot your password?
                        </Link>
                        <Button type="submit">Login</Button>
                    </div>
                </div>
            </form>
        </>
    )
}

export default Login
