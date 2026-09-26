export default function ProductCarePage() {
    return (
        <div className="min-h-screen bg-white pt-32 pb-24 px-4 sm:px-6 font-sans text-black">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light text-center mb-16 tracking-wide">Product Care</h1>

                <div className="space-y-12 text-sm sm:text-base text-gray-500 font-light leading-relaxed max-w-3xl mx-auto">
                    <p className="text-center">
                        Taking proper care of your LYNE garments ensures they remain beautiful for years to come and reduces your environmental footprint.
                    </p>

                    <div>
                        <h2 className="text-sm tracking-[0.2em] uppercase text-black text-center mb-6 mt-16">Cotton & Linen</h2>
                        <p className="text-center">
                            Machine wash cold on a gentle cycle with similar colors. Air dry flat to prevent shrinkage and preserve the shape. Iron on medium heat while slightly damp.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-sm tracking-[0.2em] uppercase text-black text-center mb-6 mt-16">Silk & Delicate Fabrics</h2>
                        <p className="text-center">
                            We recommend professional dry cleaning or careful hand washing in cold water with a mild, silk-friendly detergent. Do not wring or twist. Lay flat on a towel to dry.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-sm tracking-[0.2em] uppercase text-black text-center mb-6 mt-16">Leather & Suede</h2>
                        <p className="text-center">
                            Keep away from direct heat and moisture. Use a soft, damp cloth for cleaning smooth leather. For suede, use a specialized suede brush. Apply a leather conditioner periodically to prevent drying.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}