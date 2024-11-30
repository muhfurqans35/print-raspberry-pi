import { useState } from 'react'
import useSWR from 'swr'
import axios from '@/lib/axios'

const fetcher = url => axios.get(url).then(response => response.data)

export const useOrder = (filters = {}) => {
    // State untuk mutasi (update/delete)
    const [isUpdating, setIsUpdating] = useState(false)
    const [updateError, setUpdateError] = useState(null)
    const [isMutating, setIsMutating] = useState(false)
    const [mutationError, setMutationError] = useState(null)

    // State untuk submit order baru
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitErrors, setSubmitErrors] = useState([])
    const [status, setStatus] = useState(null)

    // Menggunakan SWR untuk fetch data
    const queryParams = new URLSearchParams(filters).toString()
    const { data, error, mutate } = useSWR(
        `/api/orders?${queryParams}`,
        fetcher,
    )

    const initializeCsrf = async () => {
        await axios.get('/sanctum/csrf-cookie')
    }

    const submitOrder = async formData => {
        setIsSubmitting(true)
        setSubmitErrors([])

        try {
            await initializeCsrf()

            const response = await axios.post('/api/orders', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Accept: 'application/json',
                },
            })

            // Mutate untuk menambah order baru ke list
            mutate(
                currentData => ({
                    ...currentData,
                    data: {
                        ...currentData.data,
                        orders: [response.data, ...currentData.data.orders],
                    },
                }),
                false,
            )

            setStatus('success')
            return response.data
        } catch (error) {
            setSubmitErrors(
                error.response?.data?.errors || [
                    'An unexpected error occurred.',
                ],
            )
            setStatus('error')
            throw error
        } finally {
            setIsSubmitting(false)
        }
    }

    const updateOrderStatus = async (orderId, newStatus) => {
        setIsUpdating(true)
        setUpdateError(null)

        try {
            const response = await axios.patch(
                `/api/orders/${orderId}/status`,
                { status: newStatus },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                    },
                },
            )

            if (response.data.success) {
                // Mutate untuk mengupdate status order
                mutate(
                    currentData => ({
                        ...currentData,
                        data: {
                            ...currentData.data,
                            orders: currentData.data.orders.map(order =>
                                order.order_id === orderId
                                    ? { ...order, status: newStatus }
                                    : order,
                            ),
                        },
                    }),
                    false,
                )
            } else {
                throw new Error('Failed to update order status')
            }
        } catch (error) {
            setUpdateError(
                error.response?.data?.message || 'Failed to update status',
            )
        } finally {
            setIsUpdating(false)
        }
    }

    const deleteOrder = async id => {
        setIsMutating(true)
        setMutationError(null)

        try {
            await axios.delete(`/api/orders/${id}`)

            // Mutate untuk menghapus order dari list
            mutate(
                currentData => ({
                    ...currentData,
                    data: {
                        ...currentData.data,
                        orders: currentData.data.orders.filter(
                            order => order.order_id !== id,
                        ),
                    },
                }),
                false,
            )
        } catch (err) {
            setMutationError(
                err.response?.data?.message || 'Failed to delete order',
            )
        } finally {
            setIsMutating(false)
        }
    }

    return {
        data: data?.data || { orders: [], pagination: null },
        isLoading: !data && !error,
        error,
        submitOrder,
        isSubmitting,
        submitErrors,
        status,
        updateOrderStatus,
        isUpdating,
        updateError,
        deleteOrder,
        isMutating,
        mutationError,
    }
}
