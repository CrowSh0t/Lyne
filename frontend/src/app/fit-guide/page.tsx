export default function FitGuidePage() {
    return (
        <div className="min-h-screen bg-white pt-32 pb-24 px-4 sm:px-6 font-sans text-black">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light text-center mb-16 tracking-wide">Fit Guide</h1>

                <div className="space-y-12 text-sm sm:text-base text-gray-500 font-light leading-relaxed max-w-3xl mx-auto">
                    <p className="text-center">
                        Our garments are designed with specific intentions in mind. Here is how to understand our fit terminology to ensure you select the silhouette you desire.
                    </p>

                    <div>
                        <h2 className="text-sm tracking-[0.2em] uppercase text-black text-center mb-6 mt-16">Oversized Fit</h2>
                        <p className="text-center">
                            Designed to be deliberately large, voluminous, and loose. It falls away from the body to create a contemporary silhouette. If you prefer a more standard fit, we recommend sizing down one size.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-sm tracking-[0.2em] uppercase text-black text-center mb-6 mt-16">Relaxed Fit</h2>
                        <p className="text-center">
                            Comfortable and slightly loose without being overwhelmingly baggy. Perfect for everyday wear, allowing ease of movement. Take your normal size.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-sm tracking-[0.2em] uppercase text-black text-center mb-6 mt-16">Slim Fit</h2>
                        <p className="text-center">
                            Tailored to sit close to the body, tracing your natural lines. If you are between sizes or prefer a bit more room for layering, consider sizing up.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}