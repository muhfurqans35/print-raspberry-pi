'use client'

import React, { useState, useEffect } from 'react'
import {
    Button,
    TextField,
    Modal,
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    CardMedia,
    IconButton,
    Container,
    CircularProgress,
} from '@mui/material'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import useItems from '@/hooks/item'
import { useAuth } from '@/hooks/auth'
import Header from '../../../components/Header'
import { useRouter } from 'next/navigation'

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90%', // Change modal width to be responsive
    maxWidth: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
}

const Item = () => {
    const {
        items,
        loading,
        error,
        addItem,
        updateItem,
        deleteItem,
        errors,
    } = useItems()

    const [openModal, setOpenModal] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [currentItem, setCurrentItem] = useState(null)
    const [newItem, setNewItem] = useState({
        name: '',
        description: '',
        price: 0,
        stock_quantity: 0,
    })
    const [imageFile, setImageFile] = useState(null)
    const { permissions } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!permissions.includes('product_management')) {
            router.push('/unauthorized')
        }
    }, [permissions])

    const handleInputChange = e => {
        const { name, value } = e.target
        setNewItem({ ...newItem, [name]: value })
    }

    const handleImageChange = e => {
        setImageFile(e.target.files[0])
    }

    const handleSubmit = e => {
        e.preventDefault()
        if (isEditing) {
            updateItem(currentItem.id, newItem, imageFile)
        } else {
            addItem(newItem, imageFile)
        }
        resetForm()
        setOpenModal(false)
    }

    const resetForm = () => {
        setNewItem({ name: '', description: '', price: 0, stock_quantity: 0 })
        setImageFile(null)
        setCurrentItem(null)
        setIsEditing(false)
    }

    const openEditModal = item => {
        setIsEditing(true)
        setCurrentItem(item)
        setNewItem({
            name: item.name,
            description: item.description,
            price: item.price,
            stock_quantity: item.stock_quantity,
        })
        setOpenModal(true)
    }

    const handleOpenModal = () => {
        resetForm()
        setOpenModal(true)
    }

    const handleCloseModal = () => {
        resetForm()
        setOpenModal(false)
    }

    if (error) return <p>Error: {error.message}</p>

    return (
        <>
            <Header title="Item Management" />
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
                                    <>
                                        <Typography variant="h4" gutterBottom>
                                            Items
                                        </Typography>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            startIcon={<AddCircleIcon />}
                                            onClick={handleOpenModal}
                                            sx={{ mb: 2 }}>
                                            Add New Item
                                        </Button>
                                        <Grid container spacing={2}>
                                            {items.map(item => (
                                                <Grid
                                                    item
                                                    xs={12}
                                                    sm={6}
                                                    md={4}
                                                    key={item.item_id}>
                                                    <Card>
                                                        <CardMedia
                                                            component="img"
                                                            image={`/storage/${item.image}`}
                                                            alt={item.name}
                                                            className="h-36 w-auto object-contain"
                                                        />
                                                        <CardContent>
                                                            <Typography variant="h6">
                                                                {item.name}
                                                            </Typography>
                                                            <Typography
                                                                variant="body2"
                                                                color="text.secondary">
                                                                {
                                                                    item.description
                                                                }
                                                            </Typography>
                                                            <Typography
                                                                variant="body1"
                                                                mt={1}>
                                                                Price: Rp.
                                                                {parseInt(
                                                                    item.price,
                                                                ).toLocaleString()}
                                                            </Typography>
                                                            <Typography variant="body1">
                                                                Stock:{' '}
                                                                {
                                                                    item.stock_quantity
                                                                }
                                                            </Typography>
                                                            <div
                                                                style={{
                                                                    display:
                                                                        'flex',
                                                                    justifyContent:
                                                                        'flex-end',
                                                                }}>
                                                                <IconButton
                                                                    color="primary"
                                                                    onClick={() =>
                                                                        openEditModal(
                                                                            item,
                                                                        )
                                                                    }>
                                                                    <EditIcon />
                                                                </IconButton>
                                                                <IconButton
                                                                    color="error"
                                                                    onClick={() =>
                                                                        deleteItem(
                                                                            item.id,
                                                                        )
                                                                    }>
                                                                    <DeleteIcon />
                                                                </IconButton>
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                </Grid>
                                            ))}
                                        </Grid>

                                        {/* Modal for Add/Edit Item */}
                                        <Modal
                                            open={openModal}
                                            onClose={handleCloseModal}
                                            aria-labelledby="modal-title"
                                            aria-describedby="modal-description">
                                            <Box sx={style}>
                                                <Typography
                                                    id="modal-title"
                                                    variant="h6"
                                                    component="h2"
                                                    gutterBottom>
                                                    {isEditing
                                                        ? 'Edit Item'
                                                        : 'Add New Item'}
                                                </Typography>
                                                <form onSubmit={handleSubmit}>
                                                    <TextField
                                                        fullWidth
                                                        margin="normal"
                                                        label="Name"
                                                        name="name"
                                                        value={newItem.name}
                                                        onChange={
                                                            handleInputChange
                                                        }
                                                        required
                                                    />
                                                    <TextField
                                                        fullWidth
                                                        margin="normal"
                                                        label="Description"
                                                        name="description"
                                                        value={
                                                            newItem.description
                                                        }
                                                        onChange={
                                                            handleInputChange
                                                        }
                                                    />
                                                    <TextField
                                                        fullWidth
                                                        margin="normal"
                                                        label="Price"
                                                        name="price"
                                                        type="number"
                                                        value={Number(
                                                            newItem.price,
                                                        )}
                                                        onChange={
                                                            handleInputChange
                                                        }
                                                        required
                                                    />
                                                    <TextField
                                                        fullWidth
                                                        margin="normal"
                                                        label="Stock Quantity"
                                                        name="stock_quantity"
                                                        type="number"
                                                        value={
                                                            newItem.stock_quantity
                                                        }
                                                        onChange={
                                                            handleInputChange
                                                        }
                                                        required
                                                    />
                                                    <Box
                                                        sx={{
                                                            display: 'flex',
                                                            justifyContent:
                                                                'space-between',
                                                            mt: 2,
                                                        }}>
                                                        <Button
                                                            variant="contained"
                                                            component="label">
                                                            Upload Image
                                                            <input
                                                                type="file"
                                                                hidden
                                                                onChange={
                                                                    handleImageChange
                                                                }
                                                                required={
                                                                    !isEditing
                                                                }
                                                            />
                                                        </Button>
                                                        <Button
                                                            type="submit"
                                                            variant="contained"
                                                            color="primary">
                                                            {isEditing
                                                                ? 'Update Item'
                                                                : 'Add Item'}
                                                        </Button>
                                                    </Box>
                                                </form>
                                            </Box>
                                        </Modal>
                                    </>
                                )}
                                {errors && (
                                    <Typography color="error" variant="body2">
                                        {errors}
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

export default Item
