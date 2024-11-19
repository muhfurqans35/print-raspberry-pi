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
import { useState, useEffect } from 'react'
import { getOrder } from '@/hooks/getorder'
import { useAuth } from '@/hooks/auth'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'

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
    const { permissions } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!permissions.includes('order_management')) {
            router.push('/unauthorized')
        }
    }, [permissions])

    const handlePageChange = (event, newPage) => {
        setFilters(prevFilters => ({
            ...prevFilters,
            page: newPage + 1, // Material-UI page starts at 0, we need to increment by 1
        }))
    }

    const handleStatusChange = (orderId, newStatus) => {
        updateOrderStatus(orderId, newStatus)
    }

    const formatDate = dateStr => {
        const date = new Date(dateStr)
        return date.toLocaleDateString() // Adjust format as needed
    }

    return (
        <>
            <Header title="Order Management" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <Container>
                                {isLoading ? (
                                    <CircularProgress />
                                ) : error ? (
                                    <Typography color="error">
                                        {error}
                                    </Typography>
                                ) : (
                                    <>
                                        <TableContainer component={Paper}>
                                            <Table>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>
                                                            Order ID
                                                        </TableCell>
                                                        <TableCell>
                                                            Customer
                                                        </TableCell>
                                                        <TableCell>
                                                            Order Date
                                                        </TableCell>
                                                        <TableCell>
                                                            Total Price
                                                        </TableCell>
                                                        <TableCell>
                                                            Status
                                                        </TableCell>
                                                        <TableCell>
                                                            Product Type
                                                        </TableCell>
                                                        <TableCell>
                                                            Action
                                                        </TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {data.orders.map(order => (
                                                        <TableRow
                                                            key={
                                                                order.order_id
                                                            }>
                                                            <TableCell>
                                                                {order.order_id}
                                                            </TableCell>
                                                            <TableCell>
                                                                {
                                                                    order.user
                                                                        ?.name
                                                                }
                                                            </TableCell>
                                                            <TableCell>
                                                                {formatDate(
                                                                    order.order_date,
                                                                )}
                                                            </TableCell>
                                                            <TableCell>
                                                                Rp.{' '}
                                                                {parseInt(
                                                                    order.total_amount,
                                                                ).toLocaleString()}
                                                            </TableCell>
                                                            <TableCell>
                                                                {order.status}
                                                            </TableCell>
                                                            <TableCell>
                                                                {order.order_details.map(
                                                                    detail => (
                                                                        <p
                                                                            key={
                                                                                detail.order_detail_id
                                                                            }>
                                                                            {
                                                                                detail.product_type
                                                                            }
                                                                        </p>
                                                                    ),
                                                                )}
                                                            </TableCell>
                                                            <TableCell>
                                                                <Select
                                                                    value={
                                                                        order.status
                                                                    }
                                                                    onChange={e =>
                                                                        handleStatusChange(
                                                                            order.order_id,
                                                                            e
                                                                                .target
                                                                                .value,
                                                                        )
                                                                    }
                                                                    fullWidth
                                                                    disabled={
                                                                        isUpdating
                                                                    }>
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
                                                                        Pickup
                                                                        Ready
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
                                                                    <CircularProgress
                                                                        size={
                                                                            24
                                                                        }
                                                                    />
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
                                                setFilters({
                                                    ...filters,
                                                    perPage: e.target.value,
                                                })
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
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
