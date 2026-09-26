'use client';
import Link from 'next/link';

export default function Footer() {
    return (
        <footer>
            <div className="bg-black text-white px-6 sm:px-10 lg:px-16 py-10 sm:py-12 lg:py-16 w-full">
                <div className="text-center mb-10 sm:mb-16">
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light tracking-widest">LYNE</h2>
                    <p className="text-xs tracking-[0.3em] text-gray-400 mt-1">CONCEPT STORE</p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                    <div>
                        <h3 className="text-xs font-bold tracking-widest mb-4">THE COMPANY</h3>
                        <ul className="space-y-2 text-sm text-gray-300">
                            <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
                            <li><Link href="/design-and-craft" className="hover:text-white transition-colors">Design and craft</Link></li>
                            <li><Link href="/press" className="hover:text-white transition-colors">Press</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-xs font-bold tracking-widest mb-4">ASSISTANCE</h3>
                        <ul className="space-y-2 text-sm text-gray-300">
                            <li><Link href="/delivery" className="hover:text-white transition-colors">Delivery information</Link></li>
                            <li><Link href="/payments" className="hover:text-white transition-colors">Payments</Link></li>
                            <li><Link href="/returns" className="hover:text-white transition-colors">Return & Refunds</Link></li>
                            <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
                            <li><Link href="/product-care" className="hover:text-white transition-colors">Product care</Link></li>
                            <li><Link href="/size-guide" className="hover:text-white transition-colors">Size guide</Link></li>
                            <li><Link href="/fit-guide" className="hover:text-white transition-colors">Fit guide</Link></li>
                            <li><Link href="/student-discount" className="hover:text-white transition-colors">Student discount</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-xs font-bold tracking-widest mb-4">LEGAL</h3>
                        <ul className="space-y-2 text-sm text-gray-300">
                            <li><Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy policy</Link></li>
                            <li><Link href="/terms-and-conditions" className="hover:text-white transition-colors">Terms & conditions</Link></li>
                            <li><Link href="/cookie-notice" className="hover:text-white transition-colors">Cookie notice</Link></li>
                            <li><Link href="/accessibility" className="hover:text-white transition-colors">Accessibility</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-xs font-bold tracking-widest mb-4">FOLLOW US</h3>
                        <ul className="space-y-2 text-sm text-gray-300">
                            <li><a href="#" className="hover:text-white transition-colors flex items-center gap-2">
                                <span className="w-5 h-5 rounded-full bg-white flex items-center justify-center shrink-0">
                                    <span className="text-black text-xs">f</span>
                                </span>
                                Facebook
                            </a></li>
                            <li><a href="#" className="hover:text-white transition-colors flex items-center gap-2">
                                <span className="w-5 h-5 rounded-full bg-white flex items-center justify-center shrink-0">
                                    <span className="text-black text-xs">ig</span>
                                </span>
                                Instagram
                            </a></li>
                            <li><a href="#" className="hover:text-white transition-colors flex items-center gap-2">
                                <span className="w-5 h-5 rounded-full bg-white flex items-center justify-center shrink-0">
                                    <span className="text-black text-xs">p</span>
                                </span>
                                Pinterest
                            </a></li>
                            <li><a href="#" className="hover:text-white transition-colors flex items-center gap-2">
                                <span className="w-5 h-5 rounded-full bg-white flex items-center justify-center shrink-0">
                                    <span className="text-black text-xs">tt</span>
                                </span>
                                TikTok
                            </a></li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="bg-[#1a1a1a] text-gray-400 text-xs px-6 sm:px-10 lg:px-16 py-4 text-center sm:text-left">
                © 2026 LYNE All rights reserved
            </div>
        </footer>
    );
}