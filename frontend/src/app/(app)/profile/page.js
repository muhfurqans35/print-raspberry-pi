'use client'

import Header from '@/app/(app)/Header'
import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/auth'
import {
    CardContent,
    Grid2,
    TextField,
    Button,
    Typography,
} from '@mui/material'
import AuthSessionStatus from '@/app/(auth)/AuthSessionStatus'

const Profile = () => {
    const { user, updateProfile, deleteProfile, mutate } = useAuth()

    const [name, setName] = useState(user?.name || '')
    const [email, setEmail] = useState(user?.email || '')
    const [address, setAddress] = useState(user?.address || '')
    const [province, setProvince] = useState(user?.province || '')
    const [city, setCity] = useState(user?.city || '')
    const [district, setDistrict] = useState(user?.district || '')
    const [subdistrict, setSubdistrict] = useState(user?.subdistrict || '')
    const [postcode, setPostcode] = useState(user?.postcode || '')
    const [phone, setPhone] = useState(user?.phone || '')
    const [image, setImage] = useState(user?.image || '')
    const [password, setPassword] = useState('')
    const [passwordConfirmation, setPasswordConfirmation] = useState('')
    const [fileInput, setFileInput] = useState(null)
    const [errors, setErrors] = useState([])
    const [status, setStatus] = useState(null)

    useEffect(() => {
        if (user?.image) {
            setImage(`/storage/${user.image}`)
        }
    }, [user?.image])

    const handleFileInputChange = event => {
        const { files } = event.target

        if (files && files.length > 0) {
            const file = files[0]
            const reader = new FileReader()

            reader.onloadend = () => {
                setImage(reader.result) // Show preview image
                setFileInput(file) // Set file input for upload
            }

            reader.readAsDataURL(file)
        }
    }

    const submitUpdateProfileForm = async event => {
        event.preventDefault()

        const formData = new FormData()
        formData.append('name', name)
        formData.append('email', email)
        formData.append('address', address)
        formData.append('province', province)
        formData.append('city', city)
        formData.append('district', district)
        formData.append('subdistrict', subdistrict)
        formData.append('postcode', postcode)
        formData.append('phone', phone)

        if (fileInput) {
            formData.append('image', fileInput) // Append raw file here
        }

        formData.append('password', password)
        formData.append('password_confirmation', passwordConfirmation)

        await updateProfile({
            formData,
            setErrors,
            setStatus,
            mutate,
        })
    }

    const handleReset = () => {
        setName(user?.name || '')
        setEmail(user?.email || '')
        setAddress(user?.address || '')
        setProvince(user?.province || '')
        setCity(user?.city || '')
        setDistrict(user?.district || '')
        setSubdistrict(user?.subdistrict || '')
        setPostcode(user?.postcode || '')
        setPhone(user?.phone || '')
        setImage(user?.image ? `/storage/${user.image}` : '')
        setPassword('')
        setPasswordConfirmation('')
        setFileInput(null)
    }

    return (
        <>
            <Header title="Update Profile" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <CardContent className="mbe-5">
                                <AuthSessionStatus
                                    className="mb-4"
                                    status={status}
                                />
                                <form
                                    onSubmit={submitUpdateProfileForm}
                                    encType="multipart/form-data">
                                    <div className="flex max-sm:flex-col s-center gap-6 p-5">
                                        <div className="bg-white-100 flex items-center justify-center">
                                            <img
                                                height={100}
                                                width={100}
                                                className="rounded"
                                                src={
                                                    image ||
                                                    '/default-profile.jpg'
                                                }
                                                alt="Profile"
                                            />
                                        </div>

                                        <div className="flex flex-grow flex-col gap-4">
                                            <div className="flex flex-col sm:flex-row gap-4">
                                                <Button
                                                    component="label"
                                                    size="small"
                                                    variant="contained"
                                                    htmlFor="account-settings-upload-image">
                                                    Upload New Photo
                                                    <input
                                                        hidden
                                                        type="file"
                                                        accept="image/png, image/jpeg"
                                                        onChange={
                                                            handleFileInputChange
                                                        }
                                                        id="account-settings-upload-image"
                                                        name="image"
                                                    />
                                                </Button>
                                                <Button
                                                    size="small"
                                                    variant="outlined"
                                                    color="error"
                                                    onClick={handleReset}>
                                                    Reset
                                                </Button>
                                            </div>
                                            <Typography>
                                                Allowed JPG, GIF or PNG. Max
                                                size of 800K
                                            </Typography>
                                        </div>
                                    </div>

                                    <CardContent>
                                        <Grid2 container spacing={5}>
                                            <Grid2 xs={12} sm={6}>
                                                <TextField
                                                    fullWidth
                                                    label="Name"
                                                    value={name}
                                                    onChange={e =>
                                                        setName(e.target.value)
                                                    }
                                                />
                                            </Grid2>
                                            <Grid2 xs={12} sm={6}>
                                                <TextField
                                                    fullWidth
                                                    label="Email"
                                                    value={email}
                                                    onChange={e =>
                                                        setEmail(e.target.value)
                                                    }
                                                />
                                            </Grid2>
                                            <Grid2 xs={12} sm={6}>
                                                <TextField
                                                    fullWidth
                                                    label="Address"
                                                    value={address}
                                                    onChange={e =>
                                                        setAddress(
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                            </Grid2>
                                            <Grid2 xs={12} sm={6}>
                                                <TextField
                                                    fullWidth
                                                    label="Province"
                                                    value={province}
                                                    onChange={e =>
                                                        setProvince(
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                            </Grid2>
                                            <Grid2 xs={12} sm={6}>
                                                <TextField
                                                    fullWidth
                                                    label="City"
                                                    value={city}
                                                    onChange={e =>
                                                        setCity(e.target.value)
                                                    }
                                                />
                                            </Grid2>
                                            <Grid2 xs={12} sm={6}>
                                                <TextField
                                                    fullWidth
                                                    label="District"
                                                    value={district}
                                                    onChange={e =>
                                                        setDistrict(
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                            </Grid2>
                                            <Grid2 xs={12} sm={6}>
                                                <TextField
                                                    fullWidth
                                                    label="Subdistrict"
                                                    value={subdistrict}
                                                    onChange={e =>
                                                        setSubdistrict(
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                            </Grid2>
                                            <Grid2 xs={12} sm={6}>
                                                <TextField
                                                    fullWidth
                                                    label="Postcode"
                                                    value={postcode}
                                                    onChange={e =>
                                                        setPostcode(
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                            </Grid2>
                                            <Grid2 xs={12} sm={6}>
                                                <TextField
                                                    fullWidth
                                                    label="Phone"
                                                    value={phone}
                                                    onChange={e =>
                                                        setPhone(e.target.value)
                                                    }
                                                />
                                            </Grid2>
                                            <Grid2 xs={12} sm={6}>
                                                <TextField
                                                    fullWidth
                                                    type="password"
                                                    label="Password"
                                                    value={password}
                                                    onChange={e =>
                                                        setPassword(
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                            </Grid2>
                                            <Grid2 xs={12} sm={6}>
                                                <TextField
                                                    fullWidth
                                                    type="password"
                                                    label="Confirm Password"
                                                    value={passwordConfirmation}
                                                    onChange={e =>
                                                        setPasswordConfirmation(
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                            </Grid2>
                                            <Grid2
                                                xs={12}
                                                className="flex gap-4 flex-wrap">
                                                <Button
                                                    variant="contained"
                                                    type="submit">
                                                    Save Changes
                                                </Button>
                                                <Button
                                                    variant="outlined"
                                                    color="secondary"
                                                    onClick={handleReset}>
                                                    Reset
                                                </Button>
                                                <Button
                                                    variant="outlined"
                                                    color="error"
                                                    onClick={deleteProfile}>
                                                    Delete Account
                                                </Button>
                                            </Grid2>
                                        </Grid2>
                                    </CardContent>
                                </form>
                            </CardContent>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Profile
