export default function FAQPage() {
    return (
        <div className="min-h-screen bg-white pt-32 pb-24 px-4 sm:px-6 font-sans text-black">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light text-center mb-16 tracking-wide">FAQ</h1>

                <div className="space-y-12 text-sm sm:text-base text-gray-500 font-light leading-relaxed max-w-3xl mx-auto">
                    <div>
                        <h2 className="text-sm tracking-[0.2em] uppercase text-black text-center mb-4 mt-8">Can I modify my order?</h2>
                        <p className="text-center">
                            We process orders quickly, but if you contact us within 1 hour of placing the order, we may be able to make changes.
                        </p>
                    </div>
                    
                    <div>
                        <h2 className="text-sm tracking-[0.2em] uppercase text-black text-center mb-4 mt-12">Do you ship internationally?</h2>
                        <p className="text-center">
                            Yes, we ship to most countries worldwide. Shipping costs will apply and will be added at checkout.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-sm tracking-[0.2em] uppercase text-black text-center mb-4 mt-12">How do I know my size?</h2>
                        <p className="text-center">
                            Please refer to our Size Guide located in the footer for detailed measurements and fitting recommendations.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}