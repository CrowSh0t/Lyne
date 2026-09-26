export default function StudentDiscountPage() {
    return (
        <div className="min-h-screen bg-white pt-32 pb-24 px-4 sm:px-6 font-sans text-black">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light text-center mb-16 tracking-wide">Student Discount</h1>

                <div className="space-y-12 text-sm sm:text-base text-gray-500 font-light leading-relaxed max-w-3xl mx-auto">
                    <p className="text-center">
                        We believe that great design should be accessible. LYNE offers a 15% discount to all verified students year-round.
                    </p>

                    <div>
                        <h2 className="text-sm tracking-[0.2em] uppercase text-black text-center mb-6 mt-16">How it works</h2>
                        <p className="text-center">
                            To unlock your discount, simply verify your student status using your university email address. Once verified, you will receive a unique single-use promo code that can be applied at checkout.
                        </p>
                    </div>

                    <div className="pt-8 text-center">
                        <button className="bg-black text-white px-12 py-4 uppercase tracking-widest text-xs font-medium hover:bg-gray-800 transition-colors">
                            Verify Student Status
                        </button>
                    </div>

                    <div>
                        <h2 className="text-sm tracking-[0.2em] uppercase text-black text-center mb-6 mt-16">Terms</h2>
                        <p className="text-center">
                            The discount applies to full-priced items only and cannot be combined with other offers, sale items, or limited-edition capsule collections.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}