'use client'
import React, { useState, useEffect } from 'react'
import {
    Box,
    Button,
    Container,
    TextField,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    Grid,
    Alert,
    Snackbar,
    CircularProgress,
} from '@mui/material'
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    Add as AddIcon,
    Refresh as RefreshIcon,
} from '@mui/icons-material'
import { useUserManagement } from '@/hooks/user-management'

const UserManagement = () => {
    const {
        users,
        isLoading,
        error,
        createUser,
        updateUser,
        deleteUser,
    } = useUserManagement()
    const [openModal, setOpenModal] = useState(false)
    const [selectedUser, setSelectedUser] = useState(null)
    const [formError, setFormError] = useState(null)
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        email: '',
        password: '',
        phone: '',
        address: '',
        image: null,
        province: '',
        city: '',
        district: '',
        subdistrict: '',
        postcode: '',
    })
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success',
    })

    const resetForm = () => {
        setFormData({
            name: '',
            username: '',
            email: '',
            password: '',
            phone: '',
            address: '',
            image: null,
            province: '',
            city: '',
            district: '',
            subdistrict: '',
            postcode: '',
        })
        setFormError(null)
    }

    const handleModalOpen = (user = null) => {
        if (user) {
            setFormData({ ...user })
            setSelectedUser(user)
        } else {
            resetForm()
            setSelectedUser(null)
        }
        setOpenModal(true)
    }

    const handleModalClose = () => {
        setOpenModal(false)
        resetForm()
        setSelectedUser(null)
    }

    const handleChange = e => {
        const { name, value, files } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: files ? files[0] : value,
        }))
    }

    const showNotification = (message, severity = 'success') => {
        setSnackbar({ open: true, message, severity })
    }

    const handleSubmit = async e => {
        e.preventDefault()
        const isUpdating = Boolean(selectedUser)
        const userData = new FormData()

        Object.entries(formData).forEach(([key, value]) => {
            if (key === 'image' && !value) return // Skip image if null
            userData.append(key, value)
        })

        try {
            if (isUpdating) {
                await updateUser(selectedUser.user_id, userData)
            } else {
                await createUser(userData)
            }
            handleModalClose()
            showNotification(
                `${isUpdating ? 'User updated' : 'User created'} successfully`,
            )
        } catch (err) {
            setFormError(err.message)
            showNotification(err.message, 'error')
        }
    }

    const handleDelete = async userId => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await deleteUser(userId)
                showNotification('User deleted successfully')
            } catch (err) {
                showNotification(err.message, 'error')
            }
        }
    }

    const handleCloseSnackbar = () => {
        setSnackbar(prev => ({ ...prev, open: false }))
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={3}>
                <Typography variant="h4">User Management</Typography>
                <Box>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => handleModalOpen()}>
                        Add User
                    </Button>
                </Box>
            </Box>

            {isLoading ? (
                <Box display="flex" justifyContent="center" p={3}>
                    <CircularProgress />
                </Box>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Phone</TableCell>
                                <TableCell>Address</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} align="center">
                                        No users found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                users.map(user => (
                                    <TableRow key={user.user_id}>
                                        <TableCell>{user.name}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>{user.phone}</TableCell>
                                        <TableCell>{user.address}</TableCell>
                                        <TableCell>
                                            <IconButton
                                                onClick={() =>
                                                    handleModalOpen(user)
                                                }>
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton
                                                onClick={() =>
                                                    handleDelete(user.user_id)
                                                }>
                                                <DeleteIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            <Dialog
                open={openModal}
                onClose={handleModalClose}
                maxWidth="md"
                fullWidth>
                <DialogTitle>
                    {selectedUser ? 'Edit User' : 'Create New User'}
                </DialogTitle>
                <DialogContent>
                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        sx={{ mt: 2 }}>
                        {formError && (
                            <Alert severity="error" sx={{ mb: 2 }}>
                                {formError}
                            </Alert>
                        )}

                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Name"
                                    name="name"
                                    value={formData.name || ''}
                                    onChange={handleChange}
                                    required={!selectedUser}
                                />
                            </Grid>

                            {!selectedUser && (
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Username"
                                        name="username"
                                        value={formData.username || ''}
                                        onChange={handleChange}
                                        required
                                    />
                                </Grid>
                            )}

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Email"
                                    name="email"
                                    type="email"
                                    value={formData.email || ''}
                                    onChange={handleChange}
                                    required={!selectedUser}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Password"
                                    name="password"
                                    type="password"
                                    onChange={handleChange}
                                    required={!selectedUser}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Phone"
                                    name="phone"
                                    value={formData.phone || ''}
                                    onChange={handleChange}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Address"
                                    name="address"
                                    multiline
                                    rows={3}
                                    value={formData.address || ''}
                                    onChange={handleChange}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Province"
                                    name="province"
                                    value={formData.province || ''}
                                    onChange={handleChange}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="City"
                                    name="city"
                                    value={formData.city || ''}
                                    onChange={handleChange}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="District"
                                    name="district"
                                    value={formData.district || ''}
                                    onChange={handleChange}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Subdistrict"
                                    name="subdistrict"
                                    value={formData.subdistrict || ''}
                                    onChange={handleChange}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Postcode"
                                    name="postcode"
                                    value={formData.postcode || ''}
                                    onChange={handleChange}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <input
                                    accept="image/*"
                                    type="file"
                                    name="image"
                                    onChange={handleChange}
                                    style={{ display: 'none' }}
                                    id="image-upload"
                                />
                                <label htmlFor="image-upload">
                                    <Button
                                        variant="contained"
                                        component="span">
                                        Upload Image
                                    </Button>
                                </label>
                                {formData.image && (
                                    <Typography
                                        variant="caption"
                                        sx={{ ml: 2 }}>
                                        Selected: {formData.image.name}
                                    </Typography>
                                )}
                            </Grid>
                        </Grid>

                        <Box
                            sx={{
                                mt: 3,
                                display: 'flex',
                                justifyContent: 'flex-end',
                            }}>
                            <Button onClick={handleModalClose} sx={{ mr: 1 }}>
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary">
                                {selectedUser ? 'Update' : 'Create'} User
                            </Button>
                        </Box>
                    </Box>
                </DialogContent>
            </Dialog>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container>
    )
}

export default UserManagement
