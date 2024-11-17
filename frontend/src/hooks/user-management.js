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
                        'Content-Type': 'application/json',
                    },
                },
            )

            mutate(
                currentUsers => [response.data, ...(currentUsers || [])],
                false,
            )

            return response.data
        } catch (error) {
            handleError(error)
        } finally {
            setIsSubmitting(false)
        }
    }

    // Update existing user
    const updateUser = async (id, updatedData) => {
        setIsSubmitting(true)
        setErrors([])

        try {
            const response = await axios.put(
                `/api/usermanagements/${id}`,
                updatedData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                },
            )

            mutate(currentUsers => {
                return currentUsers.map(user =>
                    user.user_id === id ? response.data : user,
                )
            }, false)

            return response.data
        } catch (error) {
            handleError(error)
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

            mutate(
                currentUsers =>
                    currentUsers.filter(user => user.user_id !== id),
                false,
            )
        } catch (error) {
            handleError(error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleError = error => {
        console.error('User action error:', error)
        if (error.response?.data?.errors) {
            setErrors(error.response.data.errors)
        } else {
            setErrors(['An unexpected error occurred. Please try again.'])
        }
    }

    return {
        users,
        errors,
        isLoading: !users && !error,
        isSubmitting,
        createUser,
        updateUser,
        deleteUser,
    }
}
