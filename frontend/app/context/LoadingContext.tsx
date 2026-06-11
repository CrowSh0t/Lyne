
'use client';
import { createContext, useContext, useState } from 'react';

const LoadingContext = createContext({
    setLoading: (_: boolean) => {},
});

export const useLoading = () => useContext(LoadingContext);

export function LoadingProvider({ children }: { children: React.ReactNode }) {
    const [loading, setLoading] = useState(false);

    return (
        <LoadingContext.Provider value={{ setLoading }}>
            {loading && (
                <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
                    <div className="w-10 h-10 border-2 border-black border-t-transparent rounded-full animate-spin" />
                </div>
            )}
            {children}
        </LoadingContext.Provider>
    );
}