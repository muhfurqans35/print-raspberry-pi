import Link from 'next/link';

const Error = ({ statusCode }) => {
    return (
        <div style={{ textAlign: 'center', padding: '50px' }}>
            <h1>{statusCode ? `An error ${statusCode} occurred on server` : 'An error occurred on client'}</h1>
            <p>Sorry, something went wrong.</p>
            <Link href="/" style={{ color: '#0070f3' }}>
                Go back to the homepage
            </Link>
        </div>
    );
};

Error.getInitialProps = ({ res, err }) => {
    const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
    return { statusCode };
};

export default Error;
