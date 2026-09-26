export default function AccessibilityPage() {
    return (
        <div className="min-h-screen bg-white pt-32 pb-24 px-4 sm:px-6 font-sans text-black">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light text-center mb-16 tracking-wide">Accessibility</h1>

                <div className="space-y-12 text-sm sm:text-base text-gray-500 font-light leading-relaxed max-w-3xl mx-auto">
                    <p className="text-center">
                        LYNE Concept Store is committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone and applying the relevant accessibility standards.
                    </p>

                    <div>
                        <h2 className="text-sm tracking-[0.2em] uppercase text-black text-center mb-6 mt-16">Our Commitment</h2>
                        <p className="text-center">
                            We aim to adhere as strictly as possible to the World Wide Web Consortium’s (W3C) Web Content Accessibility Guidelines (WCAG) 2.1 at the AA level. These guidelines explain how to make web content more accessible to people with a wide array of disabilities.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-sm tracking-[0.2em] uppercase text-black text-center mb-6 mt-16">Feedback & Assistance</h2>
                        <p className="text-center">
                            We welcome your feedback on the accessibility of our website. If you encounter accessibility barriers, or if you need assistance navigating our store or placing an order, please contact our support team.
                        </p>
                        <p className="mt-8 text-black font-medium text-center">accessibility@lyne.com</p>
                        <p className="text-black font-medium text-center">0 (800) 313 234</p>
                    </div>
                </div>
            </div>
        </div>
    );
}