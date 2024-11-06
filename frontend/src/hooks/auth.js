import useSWR from 'swr'
import axios from '@/lib/axios'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'

export const useAuth = ({ middleware, redirectIfAuthenticated } = {}) => {
    const router = useRouter()
    const params = useParams()
    const [errors, setErrors] = useState([])

    const { data: user, error, mutate } = useSWR('/api/user', () =>
        axios
            .get('/api/user')
            .then(res => res.data)
            .catch(err => {
                if (err.response && err.response.status !== 409) throw err
                router.push('/verify-email')
            }),
    )

    const csrf = async () => {
        try {
            await axios.get('/sanctum/csrf-cookie')
        } catch (err) {
            console.error('CSRF token error:', err)
        }
    }

    const register = async data => {
        await csrf()
        setErrors([])

        axios
            .post('/register', data)
            .then(() => {
                mutate()
            })
            .catch(err => {
                if (err.response && err.response.status !== 422) throw err
                setErrors(err.response ? err.response.data.errors : {})
            })
    }

    const login = async ({ setErrors, setStatus, ...props }) => {
        await csrf()

        setErrors([])
        setStatus(null)

        try {
            const response = await axios.post('/login', props)
            if (response.data.token) {
                localStorage.setItem('auth_token', response.data.token)
                axios.defaults.headers.common[
                    'Authorization'
                ] = `Bearer ${response.data.token}`
                mutate()
            }
        } catch (error) {
            console.error('Login error:', error)
            if (error.response && error.response.status !== 422) throw error
            setErrors(error.response ? error.response.data.errors : {})
        }
    }

    const forgotPassword = async ({ setErrors, setStatus, email }) => {
        await csrf()

        setErrors([])
        setStatus(null)

        axios
            .post('/forgot-password', { email })
            .then(response => {
                setStatus(response.data.status)
                mutate()
            })
            .catch(error => {
                if (error.response && error.response.status !== 422) throw error
                setErrors(error.response ? error.response.data.errors : {})
            })
    }

    const resetPassword = async ({ setErrors, setStatus, ...props }) => {
        await csrf()

        setErrors([])
        setStatus(null)

        axios
            .post('/reset-password', { token: params.token, ...props })
            .then(response =>
                router.push('/login?reset=' + btoa(response.data.status)),
            )
            .catch(error => {
                if (error.response && error.response.status !== 422) throw error
                setErrors(error.response ? error.response.data.errors : {})
            })
    }

    const resendEmailVerification = ({ setStatus }) => {
        axios
            .post('/email/verification-notification')
            .then(response => setStatus(response.data.status))
    }

    const logout = async () => {
        await axios.post('/logout')
        localStorage.removeItem('auth_token')
        delete axios.defaults.headers.common['Authorization']
        mutate(null, false)
        router.push('/login')
    }

    const updateProfile = async ({ formData, setStatus }) => {
        await csrf()
        setErrors([])
        setStatus(null)

        axios
            .post('/profile', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            })
            .then(() => {
                mutate()
                setStatus('Profile updated successfully.')
            })
            .catch(err => {
                if (err.response) {
                    if (err.response.status === 422) {
                        setErrors(err.response.data.errors || [])
                    } else {
                        setStatus(
                            `Error ${err.response.status}: ${err.response.statusText}`,
                        )
                    }
                } else {
                    setStatus('An unexpected error occurred. Please try again.')
                }
            })
    }

    const deleteProfile = async () => {
        await csrf()
        setErrors([])

        axios
            .delete('/profile')
            .then(() => {
                mutate(null, false)
                router.push('/login')
            })
            .catch(err => {
                if (err.response && err.response.status !== 422) throw err
                setErrors(err.response ? err.response.data.errors : {})
            })
    }

    useEffect(() => {
        if (middleware === 'guest' && redirectIfAuthenticated && user) {
            router.push(redirectIfAuthenticated(user.roles))
        }
        if (
            window.location.pathname === '/verify-email' &&
            user?.email_verified_at
        ) {
            router.push(redirectIfAuthenticated(user.roles))
        }
        if (middleware === 'auth' && error) logout()
    }, [user, error])

    const getDashboardUrl = () => {
        if (user?.roles.includes('admin')) return '/admin/dashboard'
        if (user?.roles.includes('service_owner'))
            return '/service-owner/dashboard'
        if (user?.roles.includes('customer')) return '/customer/dashboard'
        if (user?.roles.includes('super_admin')) return '/super_admin/dashboard'
    }

    return {
        user: user?.user,
        roles: user?.roles,
        login,
        register,
        forgotPassword,
        resetPassword,
        updateProfile,
        deleteProfile,
        resendEmailVerification,
        logout,
        getDashboardUrl,
    }
}
