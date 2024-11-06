module.exports = {
    async rewrites() {
        return [
            {
                source: '/storage/:path*',
                destination: `${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/:path*`,
            },
            {
                source: '/api/:path*',
                destination: 'http://localhost:8000/api/:path*',
            },
        ]
    },
}
