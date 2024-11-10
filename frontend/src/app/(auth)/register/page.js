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

const Register = () => {
    const router = useRouter()

    const { user, roles, register } = useAuth({
        middleware: 'guest',
        redirectIfAuthenticated: roles => {
            if (roles.includes('admin')) {
                return '/admin/dashboard'
            } else if (roles.includes('customer')) {
                return '/customer/dashboard'
            } else {
                return '/unauthorized'
            }
        },
    })

    const [username, setUsername] = useState('')
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [passwordConfirmation, setPasswordConfirmation] = useState('')
    const [role, setRole] = useState('customer')
    const [companyName, setCompanyName] = useState('')
    const [shouldRemember, setShouldRemember] = useState(false)
    const [errors, setErrors] = useState([])
    const [status, setStatus] = useState(null)

    useEffect(() => {
        if (router.reset?.length > 0 && errors.length === 0) {
            setStatus(atob(router.reset))
        } else {
            setStatus(null)
        }
    })

    const submitForm = async event => {
        event.preventDefault()

        register({
            username,
            name,
            email,
            role,
            password,
            password_confirmation: passwordConfirmation,
            remember: shouldRemember,
            setErrors,
            setStatus,
        })
    }

    return (
        <>
            <AuthSessionStatus className="mb-4" status={status} />
            <form onSubmit={submitForm}>
                {/* name */}
                <div>
                    <Label htmlFor="name">Name</Label>

                    <Input
                        id="name"
                        type="text"
                        value={name}
                        className="block mt-1 w-full"
                        onChange={event => setName(event.target.value)}
                        required
                        autoFocus
                    />

                    <InputError messages={errors.name} className="mt-2" />
                </div>
                {/* Username */}
                <div>
                    <Label htmlFor="username">Username</Label>

                    <Input
                        id="username"
                        type="text"
                        value={username}
                        className="block mt-1 w-full"
                        onChange={event => setUsername(event.target.value)}
                        required
                        autoFocus
                    />

                    <InputError messages={errors.username} className="mt-2" />
                </div>
                {/* Role Selection */}
                <div className="mt-4">
                    <Label>Role</Label>

                    <div className="flex items-center mt-2">
                        <input
                            id="role-customer"
                            type="radio"
                            name="role"
                            value="customer"
                            checked={role === 'customer'}
                            onChange={event => setRole(event.target.value)}
                            className="mr-2"
                        />
                        <Label
                            htmlFor="role-customer"
                            className="text-sm text-gray-600">
                            Customer
                        </Label>
                    </div>
                </div>

                {/* Email Address */}
                <div className="mt-4">
                    <Label htmlFor="email">Email</Label>

                    <Input
                        id="email"
                        type="email"
                        value={email}
                        className="block mt-1 w-full"
                        onChange={event => setEmail(event.target.value)}
                        required
                    />

                    <InputError messages={errors.email} className="mt-2" />
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
                        autoComplete="new-password"
                    />

                    <InputError messages={errors.password} className="mt-2" />
                </div>

                {/* Confirm Password */}
                <div className="mt-4">
                    <Label htmlFor="passwordConfirmation">
                        Confirm Password
                    </Label>

                    <Input
                        id="passwordConfirmation"
                        type="password"
                        value={passwordConfirmation}
                        className="block mt-1 w-full"
                        onChange={event =>
                            setPasswordConfirmation(event.target.value)
                        }
                        required
                        autoComplete="new-password"
                    />

                    <InputError
                        messages={errors.passwordConfirmation}
                        className="mt-2"
                    />
                </div>

                <div className="flex items-center justify-between mt-4">
                    <Link
                        href="/login"
                        className="underline text-sm text-gray-600 hover:text-gray-900">
                        Already registered?
                    </Link>

                    <Button>Register</Button>
                </div>
            </form>
        </>
    )
}

export default Register
