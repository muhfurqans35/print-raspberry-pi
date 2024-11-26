// hooks/order.js
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

    const submitOrder = async (formData, type) => {
        setIsSubmitting(true)
        setErrors([])

        try {
            // Initialize CSRF protection before making the request
            await initializeCsrf()

            // Inisialisasi response di sini
            const response = await axios.post('/api/orders', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Accept: 'application/json',
                },
            })

            // Mutate the orders cache to include the new order
            mutate(currentOrders => {
                const updatedOrders = Array.isArray(currentOrders)
                    ? [...currentOrders]
                    : []
                updatedOrders.unshift(response.data) // response sudah didefinisikan sebelumnya
                return updatedOrders
            }, false) // Set to false to avoid revalidation immediately

            setStatus('success')
            return response.data
        } catch (error) {
            console.error('Order submission error:', error)

            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors)
            } else {
                setErrors(['An unexpected error occurred. Please try again.'])
            }

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
