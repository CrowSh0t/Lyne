export default function DesignCraftPage() {
    return (
        <div className="min-h-screen bg-white pt-32 pb-24 px-4 sm:px-6 font-sans text-black">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light text-center mb-16 tracking-wide">Design and Craft</h1>

                <div className="space-y-12 text-sm sm:text-base text-gray-500 font-light leading-relaxed max-w-3xl mx-auto">
                    <p className="text-center">
                        At LYNE, every garment tells a story of meticulous craftsmanship and thoughtful design. We believe that true luxury lies in the details that often go unseen.
                    </p>

                    <div>
                        <h2 className="text-sm tracking-[0.2em] uppercase text-black text-center mb-6 mt-16">The Process</h2>
                        <p className="text-center">
                            Our design process begins in our studio, where silhouettes are sketched and tested to ensure the perfect drape and fit. We reject the rushed cycles of fast fashion in favor of a measured, deliberate approach to creation.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-sm tracking-[0.2em] uppercase text-black text-center mb-6 mt-16">Materials & Artisans</h2>
                        <p className="text-center">
                            We source our fabrics from ethical suppliers who share our commitment to sustainability. Our artisans combine traditional tailoring techniques with modern innovation to create pieces that not only look beautiful but are built to endure the test of time.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}