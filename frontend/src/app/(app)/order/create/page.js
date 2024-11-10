'use client'
import { useState, useEffect } from 'react'
import {
    Container,
    Card,
    CardContent,
    CardMedia,
    Typography,
    Tabs,
    Tab,
    Box,
    TextField,
    Button,
    Grid,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    FormControlLabel,
    Switch,
    Divider,
    Alert,
    CircularProgress,
} from '@mui/material'
import { useOrder } from '@/hooks/order'
import { useAuth } from '@/hooks/auth'
import { useRouter } from 'next/navigation'
import useItems from '@/hooks/item'
import Header from '../../Header'

// Constants for form options
const PAPER_SIZES = [
    { value: 'A4s', label: 'A4s' },
    { value: 'F4', label: 'F4' },
    { value: 'A4', label: 'A4' },
]

const COLOR_TYPES = [
    { value: 'black_white', label: 'Black & White' },
    { value: 'color', label: 'Color' },
]

const COVER_TYPES = [
    { value: 'plastik', label: 'Plastik' },
    { value: 'soft_cover', label: 'Soft Cover' },
    { value: 'spiral_kawat', label: 'Spiral Kawat' },
    { value: 'spiral_plastik', label: 'Spiral Plastik' },
    { value: 'hard_cover', label: 'Hard Cover' },
]

const COVER_COLORS = [
    { value: 'red', label: 'Red' },
    { value: 'green', label: 'Green' },
    { value: 'blue', label: 'Blue' },
    { value: 'yellow', label: 'Yellow' },
    { value: 'black', label: 'Black' },
]

const INITIAL_PRINT_JOB = {
    coverType: '',
    coverColor: '',
    paperSize: '',
    colorType: '',
    orientation: 'portrait',
    numberOfPages: 1,
    numberOfCopies: 1,
    cd: false,
    notes: '',
    printFile: null,
    cdFile: null,
}

export default function OrderPage() {
    const [tabValue, setTabValue] = useState(0)
    const [printJobs, setPrintJobs] = useState([])
    const [printJobOrder, setPrintJobOrder] = useState(INITIAL_PRINT_JOB)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [successMessage, setSuccessMessage] = useState('')
    const [hasCover, setHasCover] = useState(false)
    const { items } = useItems()
    const [orderItems, setOrderItems] = useState([])

    const { submitOrder } = useOrder()
    const router = useRouter()
    const { permissions } = useAuth()

    useEffect(() => {
        if (!permissions.includes('order_create_and_index')) {
            router.push('/unauthorized')
        }
    }, [permissions])

    // Tab for Item and Print Job
    const handleTabChange = (event, newValue) => {
        setTabValue(newValue)
        setErrorMessage('')
        setSuccessMessage('')
    }

    // Update Quantity
    const updateQuantity = (itemId, newQuantity, stockQuantity) => {
        setOrderItems(prevOrderItems =>
            prevOrderItems.map(item =>
                item.item_id === itemId
                    ? {
                          ...item,
                          quantity: Math.max(
                              1,
                              Math.min(newQuantity, stockQuantity),
                          ), // Ensure quantity is between 1 and stockQuantity
                      }
                    : item,
            ),
        )
    }
    // Remove from add order
    const removeFromOrder = itemId => {
        setOrderItems(prevOrderItems =>
            prevOrderItems.filter(item => item.item_id !== itemId),
        )
    }

    // HandleInputChange
    const handleInputChange = setter => e => {
        const { name, value } = e.target
        setter(prev => ({ ...prev, [name]: value }))
    }
    // Handle File
    const handleFileChange = setter => e => {
        const { name, files } = e.target
        const file = files[0]

        // Validate file size (10MB limit for print files, 700MB for CD files)
        const maxSize = name === 'cdFile' ? 700 * 1024 * 1024 : 10 * 1024 * 1024

        if (file && file.size > maxSize) {
            setErrorMessage(
                `File size exceeds ${
                    name === 'cdFile' ? '700MB' : '10MB'
                } limit`,
            )
            return
        }

        setter(prev => ({ ...prev, [name]: file }))
    }
    // Switch for CD
    const handleSwitchChange = e => {
        const { name, checked } = e.target
        setPrintJobOrder(prev => ({
            ...prev,
            [name]: checked,
        }))
    }
    // Cover Type
    const handleCoverTypeChange = event => {
        setHasCover(event.target.checked)
        if (!event.target.checked) {
            setPrintJobOrder(prev => ({
                ...prev,
                coverType: '',
                coverColor: '',
            }))
        }
    }

    // Add Order Item
    const addToOrder = item => {
        setOrderItems(prevOrderItems => {
            const existingItem = prevOrderItems.find(
                orderItem => orderItem.item_id === item.item_id,
            )

            if (existingItem) {
                return prevOrderItems.map(orderItem =>
                    orderItem.item_id === item.item_id
                        ? {
                              ...orderItem,
                              quantity: Math.min(
                                  orderItem.quantity + 1,
                                  item.stock_quantity,
                              ),
                          }
                        : orderItem,
                )
            } else {
                return [...prevOrderItems, { ...item, quantity: 1 }]
            }
        })
    }
    // Add Print Job
    const handleAddPrintJob = () => {
        try {
            validatePrintJob(printJobOrder)
            setPrintJobs(prev => [...prev, { ...printJobOrder }])
            setPrintJobOrder(INITIAL_PRINT_JOB)
            setSuccessMessage('Print job added successfully')
            setErrorMessage('')
            console.log(printJobs)
        } catch (error) {
            setErrorMessage(error.message)
        }
    }
    // Submit Items
    const handleSubmitItems = async () => {
        try {
            setIsSubmitting(true)
            setErrorMessage('')

            if (orderItems.length === 0) {
                throw new Error('Please add at least one item to your order.')
            }

            const formData = new FormData()
            formData.append('type', 'item')

            // Loop over each item in orderItems and add to formData
            orderItems.forEach((item, index) => {
                formData.append(`items[${index}][item_id]`, item.item_id) // Assuming item_id is the product identifier
                formData.append(
                    `items[${index}][quantity]`,
                    String(item.quantity),
                ) // Convert quantity to a string if needed
            })

            await submitOrder(formData)
            setOrderItems([]) // Clear the order after submission
            setSuccessMessage('Items added to order successfully')
        } catch (error) {
            setErrorMessage(error.response?.data?.message || error.message)
        } finally {
            setIsSubmitting(false)
        }
    }
    //  Submit PrintJobs
    const handleSubmitPrintJobs = async () => {
        try {
            setIsSubmitting(true)
            setErrorMessage('')

            if (printJobs.length === 0) {
                throw new Error('Please add at least one print job')
            }

            const formData = new FormData()
            formData.append('type', 'print')

            printJobs.forEach((job, index) => {
                // Basic fields
                Object.entries({
                    paper_size: job.paperSize,
                    color_type: job.colorType,
                    number_of_pages: job.numberOfPages,
                    number_of_copies: job.numberOfCopies,
                    orientation: job.orientation,
                    cd: job.cd ? '1' : '0',
                    notes: job.notes || '',
                }).forEach(([key, value]) => {
                    formData.append(`print_jobs[${index}][${key}]`, value)
                })

                // Handle cover fields based on hasCover state
                formData.append(
                    `print_jobs[${index}][cover_type]`,
                    job.coverType || '',
                )
                formData.append(
                    `print_jobs[${index}][cover_color]`,
                    job.coverColor || '',
                )
                // Handle print file
                if (job.printFile instanceof File) {
                    formData.append(
                        `print_jobs[${index}][print_file]`,
                        job.printFile,
                        job.printFile.name, // Include original filename
                    )
                }

                // Handle CD file if CD option is selected
                if (job.cd && job.cdFile instanceof File) {
                    formData.append(
                        `print_jobs[${index}][cd_file]`,
                        job.cdFile,
                        job.cdFile.name, // Include original filename
                    )
                }
            })

            // Log formData contents for debugging
            for (let pair of formData.entries()) {
                console.log(pair[0] + ': ' + pair[1])
            }

            const response = await submitOrder(formData)
            setPrintJobs([])
            setSuccessMessage('Print jobs submitted successfully')

            // Log the response
            console.log('Order submission response:', response)
        } catch (error) {
            console.error('Order submission error:', error)
            setErrorMessage(error.response?.data?.message || error.message)
        } finally {
            setIsSubmitting(false)
        }
    }

    // Validasi
    const validatePrintJob = job => {
        const requiredFields = [
            { field: 'paperSize', message: 'Paper size is required' },
            { field: 'colorType', message: 'Color type is required' },
            { field: 'numberOfPages', message: 'Number of pages is required' },
            {
                field: 'numberOfCopies',
                message: 'Number of copies is required',
            },
            { field: 'printFile', message: 'Print file is required' },
        ]

        for (const { field, message } of requiredFields) {
            if (!job[field]) {
                throw new Error(message)
            }
        }

        if (hasCover) {
            if (!job.coverType) {
                throw new Error('Cover type is required when cover is included')
            }
            if (!job.coverColor) {
                throw new Error(
                    'Cover color is required when cover is included',
                )
            }
        }

        if (job.cd && !job.cdFile) {
            throw new Error('CD file is required when CD option is selected')
        }
    }

    return (
        <>
            <Header title="Silahkan Order" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <Container maxWidth="md">
                                <Tabs
                                    value={tabValue}
                                    onChange={handleTabChange}
                                    centered>
                                    <Tab label="Order Item" />
                                    <Tab label="Print Job" />
                                </Tabs>

                                {/* Item Order Tab */}
                                <Box hidden={tabValue !== 0} p={3}>
                                    <Box>
                                        {errorMessage && (
                                            <Alert
                                                severity="error"
                                                sx={{ mb: 2 }}>
                                                {errorMessage}
                                            </Alert>
                                        )}

                                        {successMessage && (
                                            <Alert
                                                severity="success"
                                                sx={{ mb: 2 }}>
                                                {successMessage}
                                            </Alert>
                                        )}

                                        {/* Order Summary */}
                                        {orderItems.length > 0 && (
                                            <Box
                                                sx={{
                                                    mb: 4,
                                                    p: 2,
                                                    border: '1px solid',
                                                    borderColor: 'divider',
                                                    borderRadius: 1,
                                                }}>
                                                <Typography
                                                    variant="h6"
                                                    gutterBottom>
                                                    Order Summary
                                                </Typography>
                                                <Grid container spacing={2}>
                                                    {orderItems.map(item => (
                                                        <Grid
                                                            item
                                                            xs={12}
                                                            key={item.item_id}>
                                                            <Box
                                                                display="flex"
                                                                alignItems="center"
                                                                justifyContent="space-between">
                                                                <Typography>
                                                                    {item.name}
                                                                </Typography>
                                                                <Box
                                                                    display="flex"
                                                                    alignItems="center"
                                                                    gap={2}>
                                                                    <Button
                                                                        size="small"
                                                                        onClick={() =>
                                                                            updateQuantity(
                                                                                item.item_id,
                                                                                item.quantity -
                                                                                    1,
                                                                                item.stock_quantity,
                                                                            )
                                                                        }>
                                                                        -
                                                                    </Button>
                                                                    <Typography>
                                                                        {
                                                                            item.quantity
                                                                        }
                                                                    </Typography>
                                                                    <Button
                                                                        size="small"
                                                                        onClick={() =>
                                                                            updateQuantity(
                                                                                item.item_id,
                                                                                item.quantity +
                                                                                    1,
                                                                                item.stock_quantity,
                                                                            )
                                                                        }>
                                                                        +
                                                                    </Button>
                                                                    <Typography>
                                                                        Rp{' '}
                                                                        {Number(
                                                                            item.price *
                                                                                item.quantity,
                                                                        ).toLocaleString()}
                                                                    </Typography>
                                                                    <Button
                                                                        color="error"
                                                                        size="small"
                                                                        onClick={() =>
                                                                            removeFromOrder(
                                                                                item.item_id,
                                                                            )
                                                                        }>
                                                                        Remove
                                                                    </Button>
                                                                </Box>
                                                            </Box>
                                                        </Grid>
                                                    ))}
                                                </Grid>

                                                {/* Right-aligned Submit Button */}
                                                <Box
                                                    display="flex"
                                                    justifyContent="flex-end"
                                                    mt={2}>
                                                    <Button
                                                        variant="contained"
                                                        color="primary"
                                                        onClick={
                                                            handleSubmitItems
                                                        }
                                                        disabled={isSubmitting}>
                                                        {isSubmitting
                                                            ? 'Submitting...'
                                                            : 'Submit Order'}
                                                    </Button>
                                                </Box>
                                            </Box>
                                        )}

                                        {/* Available Items */}
                                        <Grid container spacing={3}>
                                            {items?.map(item => (
                                                <Grid
                                                    item
                                                    xs={12}
                                                    sm={6}
                                                    md={4}
                                                    key={item.id}>
                                                    <Card>
                                                        <CardMedia
                                                            component="img"
                                                            image={`/storage/${item.image}`}
                                                            alt={item.name}
                                                            className="h-36 w-auto object-contain"
                                                        />
                                                        <CardContent>
                                                            <Typography
                                                                variant="h6"
                                                                gutterBottom>
                                                                {item.name}
                                                            </Typography>
                                                            <Typography
                                                                variant="body2"
                                                                color="text.secondary"
                                                                paragraph>
                                                                {
                                                                    item.description
                                                                }
                                                            </Typography>
                                                            <Typography
                                                                variant="subtitle1"
                                                                color="primary">
                                                                Rp.
                                                                {Number(
                                                                    item.price.toLocaleString(),
                                                                )}
                                                            </Typography>
                                                            <Typography
                                                                variant="body2"
                                                                gutterBottom>
                                                                Stock:{' '}
                                                                {
                                                                    item.stock_quantity
                                                                }
                                                            </Typography>
                                                            <Button
                                                                variant="contained"
                                                                fullWidth
                                                                disabled={
                                                                    item.stock_quantity ===
                                                                        0 ||
                                                                    orderItems.some(
                                                                        orderItem =>
                                                                            orderItem.id ===
                                                                                item.id &&
                                                                            orderItem.quantity >=
                                                                                item.stock_quantity,
                                                                    )
                                                                }
                                                                onClick={() =>
                                                                    addToOrder(
                                                                        item,
                                                                    )
                                                                }>
                                                                Add to Order
                                                            </Button>
                                                        </CardContent>
                                                    </Card>
                                                </Grid>
                                            ))}
                                        </Grid>
                                    </Box>
                                </Box>

                                {/* Print Job Tab */}
                                <Box hidden={tabValue !== 1} p={3}>
                                    <Grid container spacing={2}>
                                        {/* Print Job Form Fields */}
                                        {/* Paper Size */}
                                        <Grid item xs={12} md={4}>
                                            <FormControl fullWidth required>
                                                <InputLabel>
                                                    Paper Size
                                                </InputLabel>
                                                <Select
                                                    name="paperSize"
                                                    value={
                                                        printJobOrder.paperSize
                                                    }
                                                    onChange={handleInputChange(
                                                        setPrintJobOrder,
                                                    )}>
                                                    {PAPER_SIZES.map(size => (
                                                        <MenuItem
                                                            key={size.value}
                                                            value={size.value}>
                                                            {size.label}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        {/* Color Type */}
                                        <Grid item xs={12} md={4}>
                                            <FormControl fullWidth required>
                                                <InputLabel>
                                                    Color Type
                                                </InputLabel>
                                                <Select
                                                    name="colorType"
                                                    value={
                                                        printJobOrder.colorType
                                                    }
                                                    onChange={handleInputChange(
                                                        setPrintJobOrder,
                                                    )}>
                                                    {COLOR_TYPES.map(type => (
                                                        <MenuItem
                                                            key={type.value}
                                                            value={type.value}>
                                                            {type.label}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </Grid>

                                        {/* Orientation */}
                                        <Grid item xs={12} md={4}>
                                            <FormControl fullWidth required>
                                                <InputLabel>
                                                    Orientation
                                                </InputLabel>
                                                <Select
                                                    name="orientation"
                                                    value={
                                                        printJobOrder.orientation
                                                    }
                                                    onChange={handleInputChange(
                                                        setPrintJobOrder,
                                                    )}>
                                                    <MenuItem value="portrait">
                                                        Portrait
                                                    </MenuItem>
                                                    <MenuItem value="landscape">
                                                        Landscape
                                                    </MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid>

                                        {/* Number of Pages */}
                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                fullWidth
                                                required
                                                type="number"
                                                label="Number of Pages"
                                                name="numberOfPages"
                                                value={
                                                    printJobOrder.numberOfPages
                                                }
                                                onChange={handleInputChange(
                                                    setPrintJobOrder,
                                                )}
                                                InputProps={{
                                                    inputProps: { min: 1 },
                                                }}
                                            />
                                        </Grid>

                                        {/* Number of Copies */}
                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                fullWidth
                                                required
                                                type="number"
                                                label="Number of Copies"
                                                name="numberOfCopies"
                                                value={
                                                    printJobOrder.numberOfCopies
                                                }
                                                onChange={handleInputChange(
                                                    setPrintJobOrder,
                                                )}
                                                InputProps={{
                                                    inputProps: { min: 1 },
                                                }}
                                            />
                                        </Grid>
                                        {/* Cover Type Switch */}
                                        <Grid item xs={12}>
                                            <FormControlLabel
                                                control={
                                                    <Switch
                                                        checked={hasCover}
                                                        onChange={
                                                            handleCoverTypeChange
                                                        }
                                                        name="hasCover"
                                                    />
                                                }
                                                label="Include Cover"
                                            />
                                        </Grid>

                                        {/* Cover Type and Color (conditional rendering) */}
                                        {hasCover && (
                                            <>
                                                <Grid item xs={12} md={6}>
                                                    <FormControl
                                                        fullWidth
                                                        required>
                                                        <InputLabel>
                                                            Cover Type
                                                        </InputLabel>
                                                        <Select
                                                            name="coverType"
                                                            value={
                                                                printJobOrder.coverType ||
                                                                ''
                                                            }
                                                            onChange={handleInputChange(
                                                                setPrintJobOrder,
                                                            )}>
                                                            {COVER_TYPES.map(
                                                                type => (
                                                                    <MenuItem
                                                                        key={
                                                                            type.value
                                                                        }
                                                                        value={
                                                                            type.value
                                                                        }>
                                                                        {
                                                                            type.label
                                                                        }
                                                                    </MenuItem>
                                                                ),
                                                            )}
                                                        </Select>
                                                    </FormControl>
                                                </Grid>

                                                <Grid item xs={12} md={6}>
                                                    <FormControl
                                                        fullWidth
                                                        required>
                                                        <InputLabel>
                                                            Cover Color
                                                        </InputLabel>
                                                        <Select
                                                            name="coverColor"
                                                            value={
                                                                printJobOrder.coverColor ||
                                                                ''
                                                            }
                                                            onChange={handleInputChange(
                                                                setPrintJobOrder,
                                                            )}>
                                                            {COVER_COLORS.map(
                                                                color => (
                                                                    <MenuItem
                                                                        key={
                                                                            color.value
                                                                        }
                                                                        value={
                                                                            color.value
                                                                        }>
                                                                        {
                                                                            color.label
                                                                        }
                                                                    </MenuItem>
                                                                ),
                                                            )}
                                                        </Select>
                                                    </FormControl>
                                                </Grid>
                                            </>
                                        )}

                                        {/* CD Option */}
                                        <Grid item xs={12} md={12}>
                                            <FormControlLabel
                                                control={
                                                    <Switch
                                                        name="cd"
                                                        checked={
                                                            printJobOrder.cd
                                                        }
                                                        onChange={
                                                            handleSwitchChange
                                                        }
                                                    />
                                                }
                                                label="Include CD"
                                            />
                                        </Grid>

                                        {/* File Uploads */}
                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                fullWidth
                                                required
                                                type="file"
                                                label="Print File"
                                                name="printFile"
                                                onChange={handleFileChange(
                                                    setPrintJobOrder,
                                                )}
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                            />
                                        </Grid>

                                        {printJobOrder.cd && (
                                            <Grid item xs={12} md={6}>
                                                <TextField
                                                    fullWidth
                                                    required
                                                    type="file"
                                                    label="CD File"
                                                    name="cdFile"
                                                    onChange={handleFileChange(
                                                        setPrintJobOrder,
                                                    )}
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                />
                                            </Grid>
                                        )}

                                        {/* Notes */}
                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                multiline
                                                rows={4}
                                                label="Notes"
                                                name="notes"
                                                value={printJobOrder.notes}
                                                onChange={handleInputChange(
                                                    setPrintJobOrder,
                                                )}
                                            />
                                        </Grid>

                                        <Grid item xs={12}>
                                            <Box display="flex" gap={2}>
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={handleAddPrintJob}
                                                    disabled={isSubmitting}
                                                    fullWidth>
                                                    Add Print Job
                                                </Button>
                                                <Button
                                                    variant="contained"
                                                    color="secondary"
                                                    onClick={
                                                        handleSubmitPrintJobs
                                                    }
                                                    disabled={
                                                        isSubmitting ||
                                                        printJobs.length === 0
                                                    }
                                                    fullWidth>
                                                    {isSubmitting ? (
                                                        <CircularProgress
                                                            size={24}
                                                        />
                                                    ) : (
                                                        'Submit All Print Jobs'
                                                    )}
                                                </Button>
                                            </Box>
                                        </Grid>

                                        {/* Print Jobs List */}
                                        {printJobs.length > 0 && (
                                            <Grid item xs={12}>
                                                <Typography
                                                    variant="h6"
                                                    gutterBottom>
                                                    Added Print Jobs (
                                                    {printJobs.length})
                                                </Typography>
                                                <Box>
                                                    {printJobs.map(
                                                        (job, index) => (
                                                            <Box
                                                                key={index}
                                                                border={1}
                                                                borderColor="grey.300"
                                                                borderRadius={2}
                                                                padding={2}
                                                                marginBottom={2}
                                                                boxShadow={1}>
                                                                <Typography
                                                                    variant="h6"
                                                                    gutterBottom>
                                                                    Print Job #
                                                                    {index + 1}
                                                                </Typography>
                                                                <Divider
                                                                    sx={{
                                                                        marginBottom: 2,
                                                                    }}
                                                                />

                                                                <Grid
                                                                    container
                                                                    spacing={1}>
                                                                    <Grid
                                                                        item
                                                                        xs={6}>
                                                                        <Typography
                                                                            variant="body2"
                                                                            color="textSecondary">
                                                                            Paper
                                                                            Size:
                                                                        </Typography>
                                                                        <Typography variant="body1">
                                                                            {
                                                                                job.paperSize
                                                                            }
                                                                        </Typography>
                                                                    </Grid>
                                                                    <Grid
                                                                        item
                                                                        xs={6}>
                                                                        <Typography
                                                                            variant="body2"
                                                                            color="textSecondary">
                                                                            Color
                                                                            Type:
                                                                        </Typography>
                                                                        <Typography variant="body1">
                                                                            {
                                                                                job.colorType
                                                                            }
                                                                        </Typography>
                                                                    </Grid>
                                                                    <Grid
                                                                        item
                                                                        xs={6}>
                                                                        <Typography
                                                                            variant="body2"
                                                                            color="textSecondary">
                                                                            Copies:
                                                                        </Typography>
                                                                        <Typography variant="body1">
                                                                            {
                                                                                job.numberOfCopies
                                                                            }
                                                                        </Typography>
                                                                    </Grid>
                                                                    <Grid
                                                                        item
                                                                        xs={6}>
                                                                        <Typography
                                                                            variant="body2"
                                                                            color="textSecondary">
                                                                            Pages
                                                                        </Typography>
                                                                        <Typography variant="body1">
                                                                            {
                                                                                job.numberOfPages
                                                                            }
                                                                        </Typography>
                                                                    </Grid>
                                                                    <Grid
                                                                        item
                                                                        xs={6}>
                                                                        <Typography
                                                                            variant="body2"
                                                                            color="textSecondary">
                                                                            Orientation:
                                                                        </Typography>
                                                                        <Typography variant="body1">
                                                                            {
                                                                                job.orientation
                                                                            }
                                                                        </Typography>
                                                                    </Grid>
                                                                    <Grid
                                                                        item
                                                                        xs={6}>
                                                                        <Typography
                                                                            variant="body2"
                                                                            color="textSecondary">
                                                                            Notes:
                                                                        </Typography>
                                                                        <Typography variant="body1">
                                                                            {
                                                                                job.notes
                                                                            }
                                                                        </Typography>
                                                                    </Grid>
                                                                </Grid>
                                                            </Box>
                                                        ),
                                                    )}
                                                </Box>
                                            </Grid>
                                        )}
                                    </Grid>
                                </Box>
                            </Container>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
