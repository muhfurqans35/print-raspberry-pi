import useSWR from 'swr'
import axios from '@/lib/axios'

export const usePrintJobs = () => {
    const { data, error } = useSWR('/api/printjobs', url =>
        axios.get(url).then(res => res.data),
    )

    return {
        printJobs: data || [],
        isLoading: !data && !error,
        isError: error,
    }
}
