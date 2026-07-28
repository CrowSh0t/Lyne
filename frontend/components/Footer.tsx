// components/Footer.tsx
'use client';

export default function Footer() {
    return (
        <footer>
            {/* Чорна частина */}
            <div className="bg-black text-white px-16 py-16 w-full">
                {/* Логотип по центру */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-light tracking-widest">LYNE</h2>
                    <p className="text-xs tracking-[0.3em] text-gray-400 mt-1">CONCEPT STORE</p>
                </div>

                {/* Колонки */}
                <div className="grid grid-cols-4 gap-8">
                    {/* The Company */}
                    <div>
                        <h3 className="text-xs font-bold tracking-widest mb-4">THE COMPANY</h3>
                        <ul className="space-y-2 text-sm text-gray-300">
                            <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Design and craft</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Press</a></li>
                        </ul>
                    </div>

                    {/* Assistance */}
                    <div>
                        <h3 className="text-xs font-bold tracking-widest mb-4">ASSISTANCE</h3>
                        <ul className="space-y-2 text-sm text-gray-300">
                            <li><a href="#" className="hover:text-white transition-colors">Delivery information</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Payments</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Return & Refunds</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Product care</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Size guide</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Fit guide</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Student discount</a></li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h3 className="text-xs font-bold tracking-widest mb-4">LEGAL</h3>
                        <ul className="space-y-2 text-sm text-gray-300">
                            <li><a href="#" className="hover:text-white transition-colors">Privacy policy</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Terms & conditions</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Cookie notice</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Accessebility</a></li>
                        </ul>
                    </div>

                    {/* Follow Us */}
                    <div>
                        <h3 className="text-xs font-bold tracking-widest mb-4">FOLLOW US</h3>
                        <ul className="space-y-2 text-sm text-gray-300">
                            <li><a href="#" className="hover:text-white transition-colors flex items-center gap-2">
                                <span className="w-5 h-5 rounded-full bg-white flex items-center justify-center">
                                    <span className="text-black text-xs">f</span>
                                </span>
                                Facebook
                            </a></li>
                            <li><a href="#" className="hover:text-white transition-colors flex items-center gap-2">
                                <span className="w-5 h-5 rounded-full bg-white flex items-center justify-center">
                                    <span className="text-black text-xs">ig</span>
                                </span>
                                Instagram
                            </a></li>
                            <li><a href="#" className="hover:text-white transition-colors flex items-center gap-2">
                                <span className="w-5 h-5 rounded-full bg-white flex items-center justify-center">
                                    <span className="text-black text-xs">p</span>
                                </span>
                                Pinterest
                            </a></li>
                            <li><a href="#" className="hover:text-white transition-colors flex items-center gap-2">
                                <span className="w-5 h-5 rounded-full bg-white flex items-center justify-center">
                                    <span className="text-black text-xs">tt</span>
                                </span>
                                TikTok
                            </a></li>
                        </ul>
                    </div>
                </div>

                {/* Change location */}
                <div className="mt-16 text-sm text-gray-400">
                    Change location and language{' '}
                    <span className="text-white font-medium cursor-pointer hover:underline">
                        United Kingdom - English ∨
                    </span>
                </div>
            </div>

            {/* Сіра смужка знизу */}
            <div className="bg-[#1a1a1a] text-gray-400 text-xs px-16 py-4">
                © 2025 LYNE All rights reserved
            </div>
        </footer>
    );
}