import Link from 'next/link';

const Unauthorized = () => {
    return (
        <div style={{ textAlign: 'center', padding: '50px' }}>
            <h1>403 - Unauthorized</h1>
            <p>You do not have permission to access this page.</p>
            <Link href="/" style={{ color: '#0070f3' }}>
                Go back to the homepage
            </Link>
        </div>
    );
};

export default Unauthorized;
