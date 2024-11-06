'use client'
import React from 'react'
import {
    Box,
    Button,
    Container,
    Grid,
    Typography,
    AppBar,
    Toolbar,
    Card,
    CardContent,
} from '@mui/material'
import { styled } from '@mui/system'
import LoginLinks from './LoginLinks'
import ApplicationLogo from '@/components/ApplicationLogo'

const HeroSection = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1976d2',
    color: 'white',
    height: '60vh',
    textAlign: 'center',
    padding: theme.spacing(4),
    marginBottom: theme.spacing(4),
}))

const FeatureCard = styled(Card)(({ theme }) => ({
    height: '100%',
    textAlign: 'center',
    backgroundColor: '#f5f5f5',
}))

const Home = () => {
    return (
        <>
            {/* Navbar */}
            <AppBar position="static">
                <Toolbar>
                    <ApplicationLogo className="block h-10 w-auto fill-current text-gray-600" />
                    <LoginLinks />
                </Toolbar>
            </AppBar>

            {/* Hero Section */}
            <HeroSection>
                <Container maxWidth="md">
                    <Typography variant="h3" gutterBottom>
                        Solusi Cepat dan Praktis untuk Fotocopy Online!
                    </Typography>
                    <Typography variant="h6" paragraph>
                        Pesan, cetak, dan kirim tanpa perlu antre. Layanan
                        fotocopy dan cetak dokumen yang mudah dan terpercaya.
                    </Typography>
                    <Button variant="contained" color="secondary" size="large">
                        Pesan Sekarang
                    </Button>
                </Container>
            </HeroSection>

            {/* Features Section */}
            <Container>
                <Typography variant="h4" align="center" gutterBottom>
                    Keunggulan Kami
                </Typography>
                <Typography variant="body1" align="center" paragraph>
                    Kenapa memilih FotocopyOnline?
                </Typography>
                <Grid container spacing={4} sx={{ mt: 2 }}>
                    <Grid item xs={12} md={4}>
                        <FeatureCard>
                            <CardContent>
                                <Typography variant="h5" gutterBottom>
                                    Cepat dan Praktis
                                </Typography>
                                <Typography>
                                    Pesan dari mana saja dan kapan saja, kami
                                    siap cetak dan kirim dokumen Anda dengan
                                    cepat!
                                </Typography>
                            </CardContent>
                        </FeatureCard>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <FeatureCard>
                            <CardContent>
                                <Typography variant="h5" gutterBottom>
                                    Harga Terjangkau
                                </Typography>
                                <Typography>
                                    Dapatkan layanan cetak berkualitas tinggi
                                    dengan harga yang ramah di kantong.
                                </Typography>
                            </CardContent>
                        </FeatureCard>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <FeatureCard>
                            <CardContent>
                                <Typography variant="h5" gutterBottom>
                                    Kualitas Terbaik
                                </Typography>
                                <Typography>
                                    Menggunakan material cetak premium untuk
                                    hasil yang memuaskan dan tahan lama.
                                </Typography>
                            </CardContent>
                        </FeatureCard>
                    </Grid>
                </Grid>
            </Container>

            {/* Call to Action */}
            <Box
                sx={{
                    backgroundColor: '#1976d2',
                    color: 'white',
                    py: 6,
                    mt: 8,
                    textAlign: 'center',
                }}>
                <Container>
                    <Typography variant="h4" gutterBottom>
                        Siap Mulai?
                    </Typography>
                    <Typography variant="h6" paragraph>
                        Mulai pengalaman fotocopy online yang cepat, praktis,
                        dan terjangkau!
                    </Typography>
                    <Button variant="contained" color="secondary" size="large">
                        Daftar Sekarang
                    </Button>
                </Container>
            </Box>

            {/* Footer */}
            <Box
                sx={{
                    backgroundColor: '#333',
                    color: 'white',
                    py: 4,
                    textAlign: 'center',
                }}>
                <Container>
                    <Typography variant="body2">
                        © 2023 FotocopyOnline. Semua Hak Dilindungi.
                    </Typography>
                </Container>
            </Box>
        </>
    )
}

export default Home
