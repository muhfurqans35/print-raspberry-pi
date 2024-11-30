// import { useState, useEffect } from 'react'
// import axios from 'axios'

// export const getOrder = filters => {
//     const [data, setData] = useState({ orders: [], pagination: null })
//     const [isLoading, setIsLoading] = useState(true)
//     const [error, setError] = useState(null)
//     const [isUpdating, setIsUpdating] = useState(false)
//     const [updateError, setUpdateError] = useState(null)

//     useEffect(() => {
//         const fetchOrders = async () => {
//             setIsLoading(true)
//             setError(null)
//             try {
//                 const queryParams = new URLSearchParams()

//                 if (filters.status && filters.status !== 'all') {
//                     queryParams.append('status', filters.status)
//                 }
//                 if (filters.startDate) {
//                     queryParams.append('start_date', filters.startDate)
//                 }
//                 if (filters.endDate) {
//                     queryParams.append('end_date', filters.endDate)
//                 }
//                 if (filters.perPage) {
//                     queryParams.append('per_page', filters.perPage)
//                 }
//                 if (filters.page) {
//                     queryParams.append('page', filters.page)
//                 }
//                 if (filters.sortBy) {
//                     queryParams.append('sort_by', filters.sortBy)
//                 }
//                 if (filters.sortDirection) {
//                     queryParams.append('sort_direction', filters.sortDirection)
//                 }

//                 const response = await axios.get(
//                     `/api/orders?${queryParams.toString()}`,
//                 )

//                 if (response.data.success) {
//                     setData({
//                         orders: response.data.data.orders,
//                         pagination: response.data.data.pagination,
//                     })
//                 } else {
//                     setError(response.data.message || 'Failed to fetch orders')
//                 }
//             } catch (error) {
//                 setError(
//                     error.response?.data?.message ||
//                         'An error occurred while fetching orders',
//                 )
//             } finally {
//                 setIsLoading(false)
//             }
//         }

//         fetchOrders()
//     }, [filters])

//     const updateOrderStatus = async (orderId, newStatus) => {
//         setIsUpdating(true)
//         setUpdateError(null)

//         try {
//             const response = await axios.patch(
//                 `/api/orders/${orderId}/status`,
//                 { status: newStatus },
//                 {
//                     headers: {
//                         'Content-Type': 'application/json',
//                         Accept: 'application/json',
//                     },
//                 },
//             )

//             if (response.data.success) {
//                 setData(prevData => {
//                     const updatedOrders = prevData.orders.map(order =>
//                         order.id === orderId
//                             ? { ...order, status: newStatus }
//                             : order,
//                     )
//                     return { ...prevData, orders: updatedOrders }
//                 })
//             } else {
//                 throw new Error(
//                     response.data.message || 'Failed to update order status',
//                 )
//             }
//         } catch (error) {
//             setUpdateError(
//                 error.response?.data?.message ||
//                     'Failed to update order status',
//             )
//         } finally {
//             setIsUpdating(false)
//         }
//     }
//     const deleteOrder = async id => {
//         setIsMutating(true)
//         setMutationError(null)

//         try {
//             await axios.delete(`/api/orders/${id}`)
//             mutate('/api/orders')
//         } catch (err) {
//             console.error(err)
//             setMutationError(
//                 err.response?.data?.message || 'Failed to delete order',
//             )
//         } finally {
//             setIsMutating(false)
//         }
//     }

//     return {
//         data,
//         isLoading,
//         error,
//         updateOrderStatus,
//         isUpdating,
//         updateError,
//         deleteOrder,
//     }
// }
