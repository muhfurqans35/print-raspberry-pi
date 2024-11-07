'use client'
import {
    TablePagination,
    Container,
    Typography,
    Paper,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    CircularProgress,
    TableContainer,
    Select,
    MenuItem,
} from '@mui/material'
import { useState } from 'react'
import { getOrder } from '@/hooks/getorder'

export default function OrderManagementPage() {
    const [filters, setFilters] = useState({
        status: 'all',
        perPage: 10,
        page: 1,
    })
    const {
        data,
        isLoading,
        error,
        updateOrderStatus,
        isUpdating,
        updateError,
    } = getOrder(filters)

    const handlePageChange = (event, newPage) => {
        setFilters(prevFilters => ({
            ...prevFilters,
            page: newPage + 1, // Material-UI page starts at 0, we need to increment by 1
        }))
    }

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Order Management
            </Typography>

            {isLoading ? (
                <CircularProgress />
            ) : error ? (
                <Typography color="error">{error}</Typography>
            ) : (
                <>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>No</TableCell>
                                    <TableCell>Customer</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {data.orders.map(order => (
                                    <TableRow key={order.id}>
                                        <TableCell>{order.id}</TableCell>
                                        <TableCell>
                                            {order.user?.name}
                                        </TableCell>
                                        <TableCell>{order.status}</TableCell>
                                        <TableCell>
                                            <Select
                                                value={order.status}
                                                onChange={e =>
                                                    handleStatusChange(
                                                        order.id,
                                                        e.target.value,
                                                    )
                                                }
                                                fullWidth
                                                disabled={isUpdating}>
                                                <MenuItem value="new">
                                                    New
                                                </MenuItem>
                                                <MenuItem value="accepted">
                                                    Accepted
                                                </MenuItem>
                                                <MenuItem value="printing">
                                                    Printing
                                                </MenuItem>
                                                <MenuItem value="printed">
                                                    Printed
                                                </MenuItem>
                                                <MenuItem value="pickup_ready">
                                                    Pickup Ready
                                                </MenuItem>
                                                <MenuItem value="canceled">
                                                    Canceled
                                                </MenuItem>
                                                <MenuItem value="finished">
                                                    Finished
                                                </MenuItem>
                                                <MenuItem value="failed">
                                                    Failed
                                                </MenuItem>
                                            </Select>

                                            {isUpdating && (
                                                <CircularProgress size={24} />
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <TablePagination
                        component="div"
                        count={data.pagination?.total || 0}
                        page={filters.page - 1} // Adjusting the page value
                        rowsPerPage={filters.perPage}
                        onPageChange={handlePageChange}
                        onRowsPerPageChange={e =>
                            setFilters({ ...filters, perPage: e.target.value })
                        }
                    />
                </>
            )}

            {updateError && (
                <Typography color="error" variant="body2">
                    {updateError}
                </Typography>
            )}
        </Container>
    )
}
