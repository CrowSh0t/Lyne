'use client';
import { useEffect, useState } from 'react';

export default function MyAccountPage() {
    const [name, setName] = useState('');

    useEffect(() => {
        setName(localStorage.getItem('username') || '');
    }, []);

    return (
        <h1>My account page, {name}</h1>
    );
}