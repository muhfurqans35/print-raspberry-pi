import { useState, useEffect } from 'react'
import axios from '@/lib/axios'
import useSWR from 'swr'

export const useUserManagement = () => {
    const [errors, setErrors] = useState([])
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Fetch data for users using SWR
    const { data: users, error, mutate } = useSWR(
        '/api/usermanagements',
        async () => {
            try {
                const response = await axios.get('/api/usermanagements')
                return response.data
            } catch (err) {
                throw new Error('Failed to fetch users')
            }
        },
    )

    // Create new user
    const createUser = async userData => {
        setIsSubmitting(true)
        setErrors([])

        try {
            const response = await axios.post(
                '/api/usermanagements',
                userData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                },
            )

            await mutate(
                currentUsers => [response.data, ...(currentUsers || [])],
                false,
            )

            return response.data
        } catch (error) {
            handleError(error)
            throw error // Re-throw untuk handling di component
        } finally {
            setIsSubmitting(false)
        }
    }

    // Update existing user
    const updateUser = async (id, updatedData) => {
        setIsSubmitting(true)
        setErrors([])

        try {
            // Gunakan POST dengan _method=PUT
            const response = await axios.post(
                `/api/usermanagements/${id}`,
                updatedData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                },
            )

            await mutate(currentUsers => {
                return currentUsers.map(user =>
                    user.user_id === id ? response.data : user,
                )
            }, false)

            return response.data
        } catch (error) {
            handleError(error)
            throw error // Re-throw untuk handling di component
        } finally {
            setIsSubmitting(false)
        }
    }

    // Delete user
    const deleteUser = async id => {
        setIsSubmitting(true)
        setErrors([])

        try {
            await axios.delete(`/api/usermanagements/${id}`)

            await mutate(
                currentUsers =>
                    currentUsers.filter(user => user.user_id !== id),
                false,
            )
        } catch (error) {
            handleError(error)
            throw error // Re-throw untuk handling di component
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleError = error => {
        console.error('User action error:', error)
        if (error.response?.data?.errors) {
            // Handle jika errors berupa object
            if (typeof error.response.data.errors === 'object') {
                const errorMessages = Object.values(
                    error.response.data.errors,
                ).flat()
                setErrors(errorMessages)
            } else {
                setErrors(error.response.data.errors)
            }
        } else if (error.response?.data?.message) {
            setErrors([error.response.data.message])
        } else {
            setErrors(['An unexpected error occurred. Please try again.'])
        }
    }

    return {
        users,
        errors,
        error,
        isLoading: !users && !error,
        isSubmitting,
        createUser,
        updateUser,
        deleteUser,
    }
}
