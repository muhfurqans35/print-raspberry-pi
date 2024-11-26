'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/auth'
import {
    CardContent,
    Grid,
    TextField,
    Button,
    Typography,
    Container,
    CircularProgress,
} from '@mui/material'
import AuthSessionStatus from '@/app/(auth)/AuthSessionStatus'

const Profile = () => {
    const {
        user,
        updateProfile,
        deleteProfile,
        mutate,
        loading,
        error,
    } = useAuth()

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
                setImage(reader.result)
                setFileInput(file)
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
            formData.append('image', fileInput)
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
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
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
                                        <CardContent>
                                            <AuthSessionStatus
                                                className="mb-4"
                                                status={status}
                                            />
                                            <form
                                                onSubmit={
                                                    submitUpdateProfileForm
                                                }
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
                                                                htmlFor="account-settings-upload-image"
                                                                sx={{
                                                                    width: {
                                                                        xs:
                                                                            '100%',
                                                                        sm:
                                                                            'auto',
                                                                    },
                                                                }}>
                                                                Upload New Photo
                                                                <input
                                                                    hidden
                                                                    type="file"
                                                                    accept="image/png, image/jpeg, image/jpg"
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
                                                                onClick={
                                                                    handleReset
                                                                }
                                                                sx={{
                                                                    width: {
                                                                        xs:
                                                                            '100%',
                                                                        sm:
                                                                            'auto',
                                                                    },
                                                                }}>
                                                                Reset
                                                            </Button>
                                                        </div>
                                                        <Typography>
                                                            Allowed JPG, GIF, or
                                                            PNG. Max size of
                                                            800K.
                                                        </Typography>
                                                    </div>
                                                </div>

                                                <CardContent>
                                                    <Grid container spacing={2}>
                                                        {[
                                                            {
                                                                label: 'Name',
                                                                value: name,
                                                                setValue: setName,
                                                            },
                                                            {
                                                                label: 'Email',
                                                                value: email,
                                                                setValue: setEmail,
                                                            },
                                                            {
                                                                label:
                                                                    'Address',
                                                                value: address,
                                                                setValue: setAddress,
                                                            },
                                                            {
                                                                label:
                                                                    'Province',
                                                                value: province,
                                                                setValue: setProvince,
                                                            },
                                                            {
                                                                label: 'City',
                                                                value: city,
                                                                setValue: setCity,
                                                            },
                                                            {
                                                                label:
                                                                    'District',
                                                                value: district,
                                                                setValue: setDistrict,
                                                            },
                                                            {
                                                                label:
                                                                    'Subdistrict',
                                                                value: subdistrict,
                                                                setValue: setSubdistrict,
                                                            },
                                                            {
                                                                label:
                                                                    'Postcode',
                                                                value: postcode,
                                                                setValue: setPostcode,
                                                            },
                                                            {
                                                                label: 'Phone',
                                                                value: phone,
                                                                setValue: setPhone,
                                                            },
                                                        ].map(
                                                            (field, index) => (
                                                                <Grid
                                                                    key={index}
                                                                    item
                                                                    xs={12}
                                                                    sm={6}>
                                                                    <TextField
                                                                        fullWidth
                                                                        label={
                                                                            field.label
                                                                        }
                                                                        value={
                                                                            field.value
                                                                        }
                                                                        onChange={e =>
                                                                            field.setValue(
                                                                                e
                                                                                    .target
                                                                                    .value,
                                                                            )
                                                                        }
                                                                        sx={{
                                                                            width: {
                                                                                xs:
                                                                                    '100%',
                                                                            },
                                                                        }}
                                                                    />
                                                                </Grid>
                                                            ),
                                                        )}
                                                        <Grid
                                                            item
                                                            xs={12}
                                                            sm={6}>
                                                            <TextField
                                                                fullWidth
                                                                type="password"
                                                                label="Password"
                                                                value={password}
                                                                onChange={e =>
                                                                    setPassword(
                                                                        e.target
                                                                            .value,
                                                                    )
                                                                }
                                                                sx={{
                                                                    width: {
                                                                        xs:
                                                                            '100%',
                                                                    },
                                                                }}
                                                            />
                                                        </Grid>
                                                        <Grid
                                                            item
                                                            xs={12}
                                                            sm={6}>
                                                            <TextField
                                                                fullWidth
                                                                type="password"
                                                                label="Confirm Password"
                                                                value={
                                                                    passwordConfirmation
                                                                }
                                                                onChange={e =>
                                                                    setPasswordConfirmation(
                                                                        e.target
                                                                            .value,
                                                                    )
                                                                }
                                                                sx={{
                                                                    width: {
                                                                        xs:
                                                                            '100%',
                                                                    },
                                                                }}
                                                            />
                                                        </Grid>
                                                        <Grid
                                                            item
                                                            xs={12}
                                                            className="flex gap-4 flex-wrap">
                                                            <Button
                                                                variant="contained"
                                                                type="submit"
                                                                sx={{
                                                                    width: {
                                                                        xs:
                                                                            '100%',
                                                                        sm:
                                                                            'auto',
                                                                    },
                                                                }}>
                                                                Save Changes
                                                            </Button>
                                                            <Button
                                                                variant="outlined"
                                                                color="secondary"
                                                                onClick={
                                                                    handleReset
                                                                }
                                                                sx={{
                                                                    width: {
                                                                        xs:
                                                                            '100%',
                                                                        sm:
                                                                            'auto',
                                                                    },
                                                                }}>
                                                                Reset
                                                            </Button>
                                                            <Button
                                                                variant="outlined"
                                                                color="error"
                                                                onClick={
                                                                    deleteProfile
                                                                }
                                                                sx={{
                                                                    width: {
                                                                        xs:
                                                                            '100%',
                                                                        sm:
                                                                            'auto',
                                                                    },
                                                                }}>
                                                                Delete Account
                                                            </Button>
                                                        </Grid>
                                                    </Grid>
                                                </CardContent>
                                            </form>
                                        </CardContent>
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

export default Profile
