'use client'
import { getOrder } from '@/hooks/getorder'
import {
    Container,
    Typography,
    Card,
    CardContent,
    CircularProgress,
    Grid,
    List,
    ListItem,
    ListItemText,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Box,
    Button,
} from '@mui/material'
import { useState } from 'react'
import Link from 'next/link'
import {
    Add as AddIcon,
    GetApp as DownloadIcon,
    Visibility as ViewIcon,
} from '@mui/icons-material'
import Header from '../../Header'

export default function OrderPage() {
    const [filters, setFilters] = useState({
        status: 'all',
        startDate: null,
        endDate: null,
        perPage: 10,
        page: 1,
        sortBy: 'order_date',
        sortDirection: 'desc',
    })

    const { data, isLoading, error } = getOrder(filters)
    const orders = data?.orders || []
    const pagination = data?.pagination

    const statusOptions = [
        'all',
        'new',
        'accepted',
        'printing',
        'printed',
        'pickup_ready',
        'canceled',
        'finished',
        'failed',
    ]

    const handleFilterChange = (name, value) => {
        setFilters(prev => ({
            ...prev,
            [name]: value,
            page: 1,
        }))
    }

    // Function to handle file download
    const handleFileDownload = filePath => {
        window.open(
            `/api/download?path=${encodeURIComponent(filePath)}`,
            '_blank',
        )
    }

    // Function to handle file preview
    const handleFilePreview = filePath => {
        window.open(
            `/api/preview?path=${encodeURIComponent(filePath)}`,
            '_blank',
        )
    }

    const renderProductDetails = detail => {
        if (!detail) return null

        if (detail.product_type === 'print') {
            const printJob = detail.print_job
            return (
                <Box sx={{ p: 2 }}>
                    <Typography variant="subtitle2">
                        Print Job #{printJob?.print_job_id || 'Not found'}
                    </Typography>
                    <Typography component="div" variant="body2">
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <div className="space-y-1">
                                    <div>Quantity: {detail.quantity}</div>
                                    <div>
                                        Price: Rp{' '}
                                        {parseInt(
                                            detail.price,
                                        ).toLocaleString()}
                                    </div>
                                    <div>
                                        Paper Size: {printJob?.paper_size}
                                    </div>
                                    <div>
                                        Number of Pages:{' '}
                                        {printJob?.number_of_pages}
                                    </div>
                                    <div>
                                        Number of Copies:{' '}
                                        {printJob?.number_of_copies}
                                    </div>
                                </div>
                            </Grid>
                            <Grid item xs={6}>
                                <div className="space-y-1">
                                    <div>
                                        Color Type: {printJob?.color_type}
                                    </div>
                                    <div>
                                        Orientation: {printJob?.orientation}
                                    </div>
                                    <div>
                                        Cover Type: {printJob?.cover_type}
                                    </div>
                                    <div>
                                        Cover Color: {printJob?.cover_color}
                                    </div>
                                    <div>CD: {printJob?.cd ? 'Yes' : 'No'}</div>
                                    <div>
                                        Notes: {printJob?.notes || 'No notes'}
                                    </div>
                                </div>
                            </Grid>
                        </Grid>
                        {printJob?.print_file_path && (
                            <Box sx={{ mt: 2 }}>
                                <Typography variant="body2">
                                    File:{' '}
                                    {printJob.print_file_path.split('/').pop()}
                                </Typography>
                                <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
                                    <Button
                                        size="small"
                                        variant="outlined"
                                        startIcon={<DownloadIcon />}
                                        onClick={() =>
                                            handleFileDownload(
                                                printJob.print_file_path,
                                            )
                                        }>
                                        Download
                                    </Button>
                                    <Button
                                        size="small"
                                        variant="outlined"
                                        startIcon={<ViewIcon />}
                                        onClick={() =>
                                            handleFilePreview(
                                                printJob.print_file_path,
                                            )
                                        }>
                                        Preview
                                    </Button>
                                </Box>
                            </Box>
                        )}
                    </Typography>
                </Box>
            )
        } else if (detail.product_type === 'item') {
            const item = detail.item
            return (
                <Box sx={{ p: 2 }}>
                    <Typography variant="subtitle2">
                        {item?.name || 'Item not found'}
                    </Typography>
                    <Typography component="div" variant="body2">
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <div className="space-y-1">
                                    <div>Quantity: {detail.quantity}</div>
                                    <div>
                                        Price: Rp{' '}
                                        {parseInt(
                                            detail.price,
                                        ).toLocaleString()}
                                    </div>
                                    <div>
                                        Total Price: Rp{' '}
                                        {parseInt(
                                            detail.total_price,
                                        ).toLocaleString()}
                                    </div>
                                </div>
                            </Grid>
                        </Grid>
                    </Typography>
                </Box>
            )
        }
        return <Typography>Unknown product type</Typography>
    }

    if (error) {
        return (
            <Container>
                <Typography color="error">Error: {error}</Typography>
            </Container>
        )
    }

    return (
        <div className="py-12">
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="p-6 bg-white border-b border-gray-200">
                        <Container>
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    mb: 4,
                                }}>
                                <Typography variant="h4">
                                    Orders List
                                </Typography>
                                <Link href="/order/create" passHref>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        startIcon={<AddIcon />}>
                                        Create Order
                                    </Button>
                                </Link>
                            </Box>

                            <Box sx={{ mb: 3 }}>
                                <FormControl fullWidth sx={{ mb: 2 }}>
                                    <InputLabel>Status</InputLabel>
                                    <Select
                                        value={filters.status}
                                        onChange={e =>
                                            handleFilterChange(
                                                'status',
                                                e.target.value,
                                            )
                                        }
                                        label="Status">
                                        {statusOptions.map(status => (
                                            <MenuItem
                                                key={status}
                                                value={status}>
                                                {status
                                                    .charAt(0)
                                                    .toUpperCase() +
                                                    status.slice(1)}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Box>

                            {isLoading ? (
                                <Box display="flex" justifyContent="center">
                                    <CircularProgress />
                                </Box>
                            ) : orders.length === 0 ? (
                                <Typography align="center">
                                    No orders found.
                                </Typography>
                            ) : (
                                <>
                                    <Grid container spacing={3}>
                                        {orders.map(order => (
                                            <Grid
                                                item
                                                xs={12}
                                                key={order.order_id}>
                                                <Card>
                                                    <CardContent>
                                                        <div className="flex justify-between items-start mb-4">
                                                            <div>
                                                                <Typography
                                                                    variant="h6"
                                                                    gutterBottom>
                                                                    Order #
                                                                    {
                                                                        order.order_id
                                                                    }
                                                                </Typography>
                                                                <Typography
                                                                    variant="body2"
                                                                    color="text.secondary">
                                                                    Customer:{' '}
                                                                    {
                                                                        order
                                                                            .user
                                                                            ?.name
                                                                    }
                                                                </Typography>
                                                            </div>
                                                            <Typography
                                                                variant="body2"
                                                                className="px-3 py-1 rounded-full"
                                                                sx={{
                                                                    backgroundColor:
                                                                        'primary.main',
                                                                    color:
                                                                        'white',
                                                                }}>
                                                                {order.status}
                                                            </Typography>
                                                        </div>

                                                        <div className="grid grid-cols-2 gap-4 mb-4">
                                                            <Typography variant="body2">
                                                                Date:{' '}
                                                                {new Date(
                                                                    order.order_date,
                                                                ).toLocaleDateString()}
                                                            </Typography>
                                                            <Typography
                                                                variant="body2"
                                                                className="text-right">
                                                                Total: Rp{' '}
                                                                {parseInt(
                                                                    order.total_amount,
                                                                ).toLocaleString()}
                                                            </Typography>
                                                        </div>

                                                        <Typography
                                                            variant="subtitle1"
                                                            gutterBottom
                                                            sx={{ mt: 2 }}>
                                                            Order Details:
                                                        </Typography>
                                                        <List>
                                                            {order.order_details?.map(
                                                                detail => (
                                                                    <ListItem
                                                                        key={
                                                                            detail.order_detail_id
                                                                        }>
                                                                        <ListItemText
                                                                            primary={renderProductDetails(
                                                                                detail,
                                                                            )}
                                                                        />
                                                                    </ListItem>
                                                                ),
                                                            )}
                                                        </List>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                        ))}
                                    </Grid>

                                    {pagination && (
                                        <Box
                                            sx={{ mt: 3, textAlign: 'center' }}>
                                            <Typography variant="body2">
                                                Showing {pagination.from} to{' '}
                                                {pagination.to} of{' '}
                                                {pagination.total} entries
                                            </Typography>
                                        </Box>
                                    )}
                                </>
                            )}
                        </Container>
                    </div>
                </div>
            </div>
        </div>
    )
}
