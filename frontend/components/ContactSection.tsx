'use client';

import React, { useState } from 'react';

export default function ContactSection() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        text: ''
    });
    const [status, setStatus] = useState('idle'); // idle | loading | success | error

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');

        try {
            // Звертаємося до Next.js API, який ми створили на Кроці 1
            const response = await fetch('/api/inquiries', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setStatus('success');
                setFormData({ name: '', email: '', phone: '', text: '' });
            } else {
                setStatus('error');
            }
        } catch (error) {
            setStatus('error');
        }
    };

    return (
        <div className="flex flex-col w-full">
            <h2 className="text-2xl font-bold mb-6">You have any questions? Contact us</h2>
            
            {status === 'success' && (
                <div className="mb-4 p-4 bg-green-100 text-green-700 rounded">
                    Your inquiry has been sent successfully!
                </div>
            )}
            {status === 'error' && (
                <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
                    Something went wrong. Please try again.
                </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-2xl">
                <input 
                    type="email" 
                    name="email" 
                    placeholder="Email*" 
                    value={formData.email} 
                    onChange={handleChange} 
                    required 
                    className="border border-gray-300 p-3 rounded" 
                />
                <input 
                    type="text" 
                    name="name" 
                    placeholder="Your name*" 
                    value={formData.name} 
                    onChange={handleChange} 
                    required 
                    className="border border-gray-300 p-3 rounded" 
                />
                <input 
                    type="tel" 
                    name="phone" 
                    placeholder="Phone number*" 
                    value={formData.phone} 
                    onChange={handleChange} 
                    required 
                    className="border border-gray-300 p-3 rounded" 
                />
                <textarea 
                    name="text" 
                    placeholder="Text*" 
                    value={formData.text} 
                    onChange={handleChange} 
                    required 
                    className="border border-gray-300 p-3 rounded h-32 resize-none"
                ></textarea>
                
                <button 
                    type="submit" 
                    disabled={status === 'loading'} 
                    className="bg-black text-white p-3 rounded mt-2 w-48 disabled:bg-gray-500"
                >
                    {status === 'loading' ? 'Sending...' : 'Send inquiry'}
                </button>
            </form>
        </div>
    );
}