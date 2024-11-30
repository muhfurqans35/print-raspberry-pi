import useSWR, { mutate } from 'swr'
import axios from 'axios'
import { useState } from 'react'

// Fetcher function untuk SWR
const fetcher = url => axios.get(url).then(res => res.data)

const useItems = () => {
    const [isMutating, setIsMutating] = useState(false)
    const [mutationError, setMutationError] = useState(null)

    // Menggunakan SWR untuk mengambil data items
    const { data: items, error } = useSWR('/api/items', fetcher)

    const loading = !items && !error

    // Menambah item baru
    const addItem = async (item, imageFile) => {
        setIsMutating(true)
        setMutationError(null)

        const formData = new FormData()
        formData.append('name', item.name)
        formData.append('description', item.description)
        formData.append('price', item.price)
        formData.append('stock_quantity', item.stock_quantity)
        formData.append('image', imageFile)

        try {
            const response = await axios.post('/api/items', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
            mutate('/api/items') // Refresh data from server
        } catch (err) {
            console.error(err)
            setMutationError(
                err.response?.data?.message || 'Failed to add item',
            )
        } finally {
            setIsMutating(false)
        }
    }

    // Mengupdate item yang sudah ada
    const updateItem = async (id, updatedItem, imageFile) => {
        setIsMutating(true)
        setMutationError(null)

        const formData = new FormData()
        formData.append('name', updatedItem.name)
        if (updatedItem.description) {
            formData.append('description', updatedItem.description)
        }
        formData.append('price', updatedItem.price)
        formData.append('stock_quantity', updatedItem.stock_quantity)
        if (imageFile) {
            formData.append('image', imageFile)
        }

        // Tambahkan _method sebagai PUT
        formData.append('_method', 'PUT')

        try {
            const response = await axios.post(`/api/items/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
            mutate('/api/items') // Refresh data from server
        } catch (err) {
            console.error(err)
            setMutationError(
                err.response?.data?.message || 'Failed to update item',
            )
        } finally {
            setIsMutating(false)
        }
    }

    // Menghapus item
    const deleteItem = async id => {
        setIsMutating(true)
        setMutationError(null)

        try {
            await axios.delete(`/api/items/${id}`)
            mutate('/api/items') // Refresh data from server
        } catch (err) {
            console.error(err)
            setMutationError(
                err.response?.data?.message || 'Failed to delete item',
            )
        } finally {
            setIsMutating(false)
        }
    }

    return {
        items,
        loading,
        error,
        isMutating,
        mutationError,
        addItem,
        updateItem,
        deleteItem,
    }
}

export default useItems
