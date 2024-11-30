'use client'
import React from 'react'
import {
    Box,
    Button,
    Container,
    Typography,
    CircularProgress,
} from '@mui/material'
import {
    Print,
    ArrowForward,
    AccessTime,
    CurrencyExchange,
    AutoAwesome,
} from '@mui/icons-material'
import NavbarHero from '@/components/NavbarHero'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/auth'
import Loading from '@/components/Loading'

const LandingPage = () => {
    const router = useRouter()
    const { user, loading } = useAuth({ middleware: 'guest' })

    const handleOrders = () => {
        router.push('/order/create')
    }

    const handleFAQ = () => {
        router.push('/faq')
    }

    // Show loading state while auth is being checked
    if (loading) {
        return <Loading />
    }

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'black', color: 'white' }}>
            {/* Navbar */}
            <NavbarHero user={user} />

            {/* Hero Section */}
            <Box
                sx={{
                    minHeight: '100vh',
                    pt: 8,
                    display: 'flex',
                    alignItems: 'center',
                    position: 'relative',
                }}>
                <Container maxWidth="xl">
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', md: 'row' },
                            alignItems: 'center',
                            gap: 4,
                        }}>
                        {/* Left Content */}
                        <Box
                            sx={{
                                flex: 1,
                                textAlign: { xs: 'center', md: 'left' },
                            }}>
                            <Typography
                                variant="h2"
                                component="h1"
                                gutterBottom>
                                Solusi Cepat & Praktis
                                <Box
                                    component="span"
                                    sx={{
                                        color: 'rgb(56, 189, 248)',
                                        display: 'block',
                                    }}>
                                    untuk Fotocopy!
                                </Box>
                            </Typography>
                            <Typography
                                variant="h6"
                                sx={{
                                    color: 'grey.400',
                                    mb: 4,
                                    maxWidth: 'xl',
                                }}>
                                Pesan, cetak, dan kirim tanpa perlu antre.
                                Layanan fotocopy dan cetak dokumen yang mudah
                                dan terpercaya.
                            </Typography>
                            <Box
                                sx={{
                                    display: 'flex',
                                    gap: 2,
                                    justifyContent: {
                                        xs: 'center',
                                        md: 'flex-start',
                                    },
                                }}>
                                <Button
                                    variant="contained"
                                    sx={{
                                        bgcolor: 'rgb(56, 189, 248)',
                                        '&:hover': {
                                            bgcolor: 'rgb(14, 165, 233)',
                                        },
                                    }}
                                    endIcon={<ArrowForward />}
                                    onClick={handleOrders}>
                                    Mulai Sekarang
                                </Button>
                                <Button
                                    variant="outlined"
                                    sx={{
                                        color: 'white',
                                        borderColor: 'white',
                                        '&:hover': {
                                            borderColor: 'white',
                                            bgcolor: 'rgba(255,255,255,0.1)',
                                        },
                                    }}
                                    onClick={handleFAQ}>
                                    Pelajari Lebih Lanjut
                                </Button>
                            </Box>
                        </Box>

                        {/* Right Content */}
                        <Box
                            sx={{
                                flex: 1,
                                display: 'flex',
                                justifyContent: 'center',
                            }}>
                            <Box sx={{ position: 'relative' }}>
                                <Box
                                    sx={{
                                        bgcolor: 'rgba(56, 189, 248, 0.2)',
                                        width: 300,
                                        height: 300,
                                        borderRadius: '50%',
                                        position: 'absolute',
                                        top: -40,
                                        right: -40,
                                        filter: 'blur(40px)',
                                    }}
                                />
                                <Box
                                    sx={{
                                        bgcolor: 'white',
                                        p: 4,
                                        borderRadius: 4,
                                        boxShadow: 24,
                                        position: 'relative',
                                    }}>
                                    <Print
                                        sx={{
                                            fontSize: 200,
                                            color: 'rgb(56, 189, 248)',
                                        }}
                                    />
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </Container>
            </Box>

            {/* Features Section */}
            <Box sx={{ bgcolor: 'white', color: 'black', py: 10 }}>
                <Container maxWidth="xl">
                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: {
                                xs: '1fr',
                                md: 'repeat(3, 1fr)',
                            },
                            gap: 4,
                        }}>
                        <Box sx={{ p: 3, textAlign: 'center' }}>
                            <AccessTime
                                sx={{
                                    fontSize: 48,
                                    color: 'rgb(56, 189, 248)',
                                }}
                            />
                            <Typography variant="h5" sx={{ mt: 2, mb: 1 }}>
                                Cepat dan Praktis
                            </Typography>
                            <Typography color="text.secondary">
                                Pesan dari mana saja dan kapan saja, kami siap
                                cetak dan kirim dokumen Anda dengan cepat!
                            </Typography>
                        </Box>
                        <Box sx={{ p: 3, textAlign: 'center' }}>
                            <CurrencyExchange
                                sx={{
                                    fontSize: 48,
                                    color: 'rgb(56, 189, 248)',
                                }}
                            />
                            <Typography variant="h5" sx={{ mt: 2, mb: 1 }}>
                                Harga Terjangkau
                            </Typography>
                            <Typography color="text.secondary">
                                Dapatkan layanan cetak berkualitas tinggi dengan
                                harga yang ramah di kantong.
                            </Typography>
                        </Box>
                        <Box sx={{ p: 3, textAlign: 'center' }}>
                            <AutoAwesome
                                sx={{
                                    fontSize: 48,
                                    color: 'rgb(56, 189, 248)',
                                }}
                            />
                            <Typography variant="h5" sx={{ mt: 2, mb: 1 }}>
                                Hasil Sempurna
                            </Typography>
                            <Typography color="text.secondary">
                                Kepuasan pelanggan adalah prioritas kami
                            </Typography>
                        </Box>
                    </Box>
                </Container>
            </Box>
        </Box>
    )
}

export default LandingPage
