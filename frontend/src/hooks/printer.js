import { useState } from 'react'
import axios from '@/lib/axios'
import useSWR from 'swr'

export const usePrinters = () => {
    const [errors, setErrors] = useState([])
    const [status, setStatus] = useState(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Initialize CSRF protection
    const initializeCsrf = async () => {
        await axios.get('/sanctum/csrf-cookie')
    }

    // Fetch printers data and provide mutate function for cache update
    const { data: printers, error, mutate } = useSWR('/api/printers', url =>
        axios.get(url).then(res => res.data),
    )

    const createPrinter = async printerData => {
        setIsSubmitting(true)
        setErrors([])

        try {
            await initializeCsrf()

            const response = await axios.post('/api/printers', printerData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            mutate(
                currentPrinters => [response.data, ...(currentPrinters || [])],
                false,
            )

            setStatus('success')
            return response.data
        } catch (error) {
            handleError(error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const updatePrinter = async (id, updatedData) => {
        setIsSubmitting(true)
        setErrors([])

        try {
            await initializeCsrf()

            const response = await axios.put(
                `/api/printers/${id}`,
                updatedData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                },
            )

            mutate(currentPrinters => {
                return currentPrinters.map(printer =>
                    printer.printer_id === id ? response.data : printer,
                )
            }, false)

            setStatus('success')
            return response.data
        } catch (error) {
            handleError(error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const updatePrinterStatus = async (name, status, details = null) => {
        setIsSubmitting(true)
        setErrors([])

        try {
            await initializeCsrf()

            const response = await axios.post(
                '/api/printer-status',
                { name, status, details },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                },
            )

            mutate(currentPrinters => {
                return currentPrinters.map(printer =>
                    printer.name === name
                        ? { ...printer, ...response.data }
                        : printer,
                )
            }, false)

            setStatus('success')
            return response.data
        } catch (error) {
            handleError(error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const deletePrinter = async id => {
        setIsSubmitting(true)
        setErrors([])

        try {
            await initializeCsrf()

            await axios.delete(`/api/printers/${id}`)

            mutate(
                currentPrinters =>
                    currentPrinters.filter(
                        printer => printer.printer_id !== id,
                    ),
                false,
            )

            setStatus('success')
        } catch (error) {
            handleError(error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleError = error => {
        console.error('Printer action error:', error)
        if (error.response?.data?.errors) {
            setErrors(error.response.data.errors)
        } else {
            setErrors(['An unexpected error occurred. Please try again.'])
        }
    }

    return {
        printers,
        errors,
        status,
        isLoading: !error && !printers,
        isSubmitting,
        createPrinter,
        updatePrinter,
        updatePrinterStatus, // Ditambahkan fungsi ini
        deletePrinter,
    }
}
