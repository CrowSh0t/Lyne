export default function ReturnsPage() {
    return (
        <div className="min-h-screen bg-white pt-32 pb-24 px-4 sm:px-6 font-sans text-black">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light text-center mb-16 tracking-wide">Return & Refunds</h1>

                <div className="space-y-12 text-sm sm:text-base text-gray-500 font-light leading-relaxed max-w-3xl mx-auto">
                    <p className="text-center">
                        We want you to be completely satisfied with your purchase. If you change your mind, you can return your items within 14 days of delivery.
                    </p>

                    <div>
                        <h2 className="text-sm tracking-[0.2em] uppercase text-black text-center mb-6 mt-16">Return Conditions</h2>
                        <div className="flex flex-col items-center space-y-2 text-center">
                            <p>Items must be unworn, unwashed, and in their original condition.</p>
                            <p>All original tags and packaging must be attached.</p>
                            <p>Underwear, swimwear, and perfumes cannot be returned for hygiene reasons.</p>
                        </div>
                    </div>

                    <div>
                        <h2 className="text-sm tracking-[0.2em] uppercase text-black text-center mb-6 mt-16">Refund Process</h2>
                        <p className="text-center">
                            Once your return is received and inspected, we will send you an email to notify you. Refunds will be processed within 5-7 business days and automatically applied to your original method of payment.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}