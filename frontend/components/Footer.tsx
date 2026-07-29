'use client';

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
                            <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Design and craft</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Press</a></li>
                        </ul>
                    </div>

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

                    <div>
                        <h3 className="text-xs font-bold tracking-widest mb-4">LEGAL</h3>
                        <ul className="space-y-2 text-sm text-gray-300">
                            <li><a href="#" className="hover:text-white transition-colors">Privacy policy</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Terms & conditions</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Cookie notice</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Accessebility</a></li>
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

                <div className="mt-10 sm:mt-16 text-xs sm:text-sm text-gray-400 text-center sm:text-left">
                    Change location and language{' '}
                    <span className="text-white font-medium cursor-pointer hover:underline block sm:inline mt-1 sm:mt-0">
                        United Kingdom - English ∨
                    </span>
                </div>
            </div>

            <div className="bg-[#1a1a1a] text-gray-400 text-xs px-6 sm:px-10 lg:px-16 py-4 text-center sm:text-left">
                © 2025 LYNE All rights reserved
            </div>
        </footer>
    );
}