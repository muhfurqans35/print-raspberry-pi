import { useState } from 'react'
import axios from '@/lib/axios'
import useSWR from 'swr'

export const useOrder = () => {
    const [errors, setErrors] = useState([])
    const [status, setStatus] = useState(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Initialize CSRF protection
    const initializeCsrf = async () => {
        await axios.get('/sanctum/csrf-cookie')
    }

    // Fetch orders data and provide mutate function for cache update
    const { data: orders, error, mutate } = useSWR('/api/orders', url =>
        axios.get(url).then(res => res.data),
    )

    // Submit order
    const submitOrder = async formData => {
        setIsSubmitting(true)
        setErrors([])

        try {
            // Initialize CSRF protection before making the request
            await initializeCsrf()

            // Submit order
            const response = await axios.post('/api/orders', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Accept: 'application/json',
                },
            })

            // Update the cache optimistically
            mutate(currentOrders => {
                const updatedOrders = Array.isArray(currentOrders)
                    ? [...currentOrders]
                    : []
                updatedOrders.unshift(response.data) // Add the new order to the beginning
                return updatedOrders
            }, false) // Don't trigger revalidation immediately

            setStatus('success')
            return response.data
        } catch (error) {
            console.error('Order submission error:', error)

            // Handle different error responses
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors)
            } else {
                setErrors(['An unexpected error occurred. Please try again.'])
            }

            // Optionally set status to 'error' to show global error message
            setStatus('error')

            throw error
        } finally {
            setIsSubmitting(false)
        }
    }

    return {
        submitOrder,
        errors,
        status,
        orders,
        error,
        isLoading: !error && !orders,
        isSubmitting,
    }
}
