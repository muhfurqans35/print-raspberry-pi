'use client'
import { useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation'
import Header from '../../Header';
import { useAuth } from '@/hooks/auth';

export default function CartPage() {
    const router = useRouter();
    const { user, roles } = useAuth({ middleware: 'auth' });

    useEffect(() => {
        if (!roles.includes('customer')) {
            router.push('/unauthorized'); // Redirect ke halaman unauthorized atau yang sesuai
        }
    }, [roles]);

    const handleAddToCart = async (productType, productId, quantity) => {
        try {
            const response = await axios.post('/api/cart/add', {
                product_type: productType,
                product_id: productId,
                quantity,
            });
            console.log('Item added to cart:', response.data);
        } catch (error) {
            console.error('Error adding to cart:', error);
        }
    };
    return (
        <>
        <Header title="Cart"/>
        
        {user ? (
            <>
                {/* Here you can display cart items */}
                <button onClick={() => handleAddToCart('item', 1, 2)}>Add Item</button>
                <button onClick={() => handleAddToCart('print', 2, 1)}>Add Print Job</button>
            </>
        ) : (
            <p>Loading...</p>
        )}
    </>
        
    );
}