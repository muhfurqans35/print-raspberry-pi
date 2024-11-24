'use client'
import React, { useState, useEffect } from 'react'
import { usePrinters } from '@/hooks/printer'
import { useAuth } from '@/hooks/auth'
import { useRouter } from 'next/navigation'
import {
    Container,
    Typography,
    Box,
    TextField,
    Button,
    CircularProgress,
    Paper,
    List,
    ListItem,
    ListItemText,
    IconButton,
    Chip,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import Header from '@/components/Header'

const PrintersPage = () => {
    const {
        printers,
        loading,
        error,
        createPrinter,
        updatePrinter,
        deletePrinter,
    } = usePrinters()
    const [name, setName] = useState('')
    const [editId, setEditId] = useState(null)
    const { permissions } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!permissions.includes('print_management')) {
            router.push('/unauthorized')
        }
    }, [permissions])

    const handleSubmit = e => {
        e.preventDefault()
        const printerData = { name }

        if (editId) {
            updatePrinter(editId, printerData)
        } else {
            createPrinter(printerData)
        }

        setName('')
        setEditId(null)
    }

    const handleEdit = printer => {
        setName(printer.name)
        setEditId(printer.printer_id)
    }

    const resetForm = () => {
        setName('')
        setEditId(null)
    }

    const getStatusChip = status => {
        // Map status to colors and labels
        const statusColors = {
            ready: 'success',
            printing: 'primary',
            error: 'error',
            'out of paper': 'warning',
        }

        return (
            <Chip
                label={status || 'Unknown'}
                color={statusColors[status] || 'default'}
                size="small"
                variant="outlined"
            />
        )
    }

    if (loading) return <CircularProgress />
    if (error) return <Typography color="error">{error}</Typography>

    return (
        <>
            <Header title="Printer Management" />
            <div className="py-12 px-4 sm:px-8 lg:px-16">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <Container>
                                {loading ? (
                                    <CircularProgress />
                                ) : error ? (
                                    <Typography color="error">
                                        {error}
                                    </Typography>
                                ) : (
                                    <Box sx={{ mb: 4 }}>
                                        <Box
                                            component="form"
                                            onSubmit={handleSubmit}
                                            sx={{ mb: 3 }}>
                                            <TextField
                                                label="Printer Name"
                                                value={name}
                                                onChange={e =>
                                                    setName(e.target.value)
                                                }
                                                fullWidth
                                                required
                                                sx={{ mb: 2 }}
                                            />
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    gap: 1,
                                                }}>
                                                <Button
                                                    type="submit"
                                                    variant="contained"
                                                    color="primary">
                                                    {editId
                                                        ? 'Update Printer'
                                                        : 'Add Printer'}
                                                </Button>
                                                {editId && (
                                                    <Button
                                                        variant="outlined"
                                                        color="secondary"
                                                        onClick={resetForm}>
                                                        Cancel
                                                    </Button>
                                                )}
                                            </Box>
                                        </Box>

                                        <Paper>
                                            <List>
                                                {printers &&
                                                printers.length > 0 ? (
                                                    printers.map(printer => (
                                                        <ListItem
                                                            key={
                                                                printer.printer_id
                                                            }
                                                            divider>
                                                            <ListItemText
                                                                primary={
                                                                    printer.name
                                                                }
                                                                secondary={`Status: ${
                                                                    printer.status ||
                                                                    'Unknown'
                                                                }`}
                                                            />
                                                            {getStatusChip(
                                                                printer.status,
                                                            )}
                                                            <IconButton
                                                                edge="end"
                                                                onClick={() =>
                                                                    handleEdit(
                                                                        printer,
                                                                    )
                                                                }>
                                                                <EditIcon />
                                                            </IconButton>
                                                            <IconButton
                                                                edge="end"
                                                                color="error"
                                                                onClick={() =>
                                                                    deletePrinter(
                                                                        printer.printer_id,
                                                                    )
                                                                }>
                                                                <DeleteIcon />
                                                            </IconButton>
                                                        </ListItem>
                                                    ))
                                                ) : (
                                                    <Typography
                                                        variant="body2"
                                                        color="textSecondary">
                                                        No printers found.
                                                    </Typography>
                                                )}
                                            </List>
                                        </Paper>
                                    </Box>
                                )}
                            </Container>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default PrintersPage
