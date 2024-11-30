'use client'
import { useState, useEffect } from 'react'
import { usePrintJobs } from '@/hooks/printjob'
import { usePrinters } from '@/hooks/printer'
import { useAuth } from '@/hooks/auth'
import { useRouter } from 'next/navigation'
import axios from '@/lib/axios'
import {
    Container,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    CircularProgress,
    List,
    ListItem,
    ListItemIcon,
    Checkbox,
    ListItemText,
    Grid,
} from '@mui/material'
import Header from '../../../components/Header'

const PrintPage = () => {
    const {
        printJobs,
        isLoading: loadingPrintJobs,
        isError: errorPrintJobs,
    } = usePrintJobs()
    const {
        printers,
        isFetchingStatus,
        statusMessage,
        printerStatus,
        isLoading: loadingPrinters,
        isError: errorPrinters,
        fetchPrinterStatus,
    } = usePrinters()

    const [selectedPrinter, setSelectedPrinter] = useState('')
    const [selectedPrintJob, setSelectedPrintJob] = useState(null)
    const { permissions } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!permissions.includes('print_management')) {
            router.push('/unauthorized')
        }
    }, [permissions])
    // Fungsi untuk menangani submit print
    const handlePrintSubmit = async () => {
        if (!selectedPrinter || !selectedPrintJob) {
            alert('Please select a printer and a print job.')
            return
        }

        try {
            await axios.post('/api/submitPrint', {
                printer_id: selectedPrinter,
                print_job_id: selectedPrintJob,
            })
            alert('Print request submitted successfully!')
        } catch (error) {
            console.error(
                'Error submitting print request:',
                error.response ? error.response.data : error,
            )
            alert('Failed to submit print request.')
        }
    }
    return (
        <>
            <Header title="Print Jobs" />
            <div className="py-12 px-4 sm:px-8 lg:px-16">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <Container>
                                {loadingPrintJobs || loadingPrinters ? (
                                    <CircularProgress />
                                ) : errorPrintJobs || errorPrinters ? (
                                    <Typography color="error">
                                        {errorPrintJobs || errorPrinters}
                                    </Typography>
                                ) : (
                                    <>
                                        <Typography
                                            variant="h6"
                                            component="h2"
                                            sx={{ mb: 2 }}>
                                            Select Print Job
                                        </Typography>
                                        <List>
                                            {printJobs.map(job => (
                                                <ListItem
                                                    component="div"
                                                    key={job.print_job_id}
                                                    selected={
                                                        selectedPrintJob ===
                                                        job.print_job_id
                                                    }
                                                    onClick={() =>
                                                        setSelectedPrintJob(
                                                            job.print_job_id,
                                                        )
                                                    }
                                                    sx={{
                                                        border:
                                                            selectedPrintJob ===
                                                            job.print_job_id
                                                                ? '2px solid #3f51b5'
                                                                : '1px solid #ddd',
                                                        padding: '8px',
                                                        borderRadius: '8px',
                                                        backgroundColor:
                                                            selectedPrintJob ===
                                                            job.print_job_id
                                                                ? '#e3f2fd'
                                                                : 'transparent',
                                                        '&:hover': {
                                                            backgroundColor:
                                                                '#f5f5f5',
                                                        },
                                                    }}>
                                                    <ListItemText
                                                        primary={`File: ${job.print_file_path
                                                            .split('/')
                                                            .pop()}`}
                                                        secondary={`Copies: ${job.number_of_copies}, Orientation: ${job.orientation}, Paper Size: ${job.paper_size}, Color Type: ${job.color_type}`}
                                                    />
                                                    {/* Optional Checkbox for Print Job */}
                                                    <ListItemIcon>
                                                        <Checkbox
                                                            checked={
                                                                selectedPrintJob ===
                                                                job.print_job_id
                                                            }
                                                            color="primary"
                                                        />
                                                    </ListItemIcon>
                                                </ListItem>
                                            ))}
                                        </List>

                                        <Grid
                                            container
                                            spacing={2}
                                            alignItems="center"
                                            sx={{ mb: 2 }}>
                                            <Grid item xs={9}>
                                                {' '}
                                                {/* 3/4 width */}
                                                <FormControl fullWidth>
                                                    <InputLabel>
                                                        Select Printer
                                                    </InputLabel>
                                                    <Select
                                                        value={selectedPrinter}
                                                        onChange={e =>
                                                            setSelectedPrinter(
                                                                e.target.value,
                                                            )
                                                        }
                                                        label="Select Printer">
                                                        {printers.map(
                                                            printer => (
                                                                <MenuItem
                                                                    key={
                                                                        printer.printer_id
                                                                    }
                                                                    value={
                                                                        printer.printer_id
                                                                    }>
                                                                    {
                                                                        printer.name
                                                                    }
                                                                </MenuItem>
                                                            ),
                                                        )}
                                                    </Select>
                                                </FormControl>
                                            </Grid>
                                            <Grid item xs={3}>
                                                {' '}
                                                {/* 1/4 width */}
                                                <Button
                                                    variant="contained"
                                                    onClick={fetchPrinterStatus}
                                                    disabled={isFetchingStatus}
                                                    fullWidth>
                                                    {isFetchingStatus
                                                        ? 'Fetching...'
                                                        : 'Check Printer Status'}
                                                </Button>
                                            </Grid>
                                        </Grid>

                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={handlePrintSubmit}
                                            disabled={
                                                !selectedPrinter ||
                                                !selectedPrintJob
                                            }>
                                            Submit Print
                                        </Button>

                                        {statusMessage && (
                                            <Typography sx={{ mt: 2 }}>
                                                {statusMessage}
                                            </Typography>
                                        )}
                                        {printerStatus && (
                                            <List>
                                                {printerStatus.map(
                                                    (status, index) => (
                                                        <ListItem key={index}>
                                                            <ListItemText
                                                                primary={
                                                                    status.name
                                                                }
                                                                secondary={
                                                                    status.status
                                                                }
                                                            />
                                                        </ListItem>
                                                    ),
                                                )}
                                            </List>
                                        )}
                                    </>
                                )}
                            </Container>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default PrintPage
