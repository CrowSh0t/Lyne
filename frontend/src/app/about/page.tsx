export default function AboutPage() {
    return (
        <div className="min-h-screen bg-white pt-32 pb-24 px-4 sm:px-6 font-sans text-black">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light text-center mb-16 tracking-wide">About LYNE</h1>

                <div className="space-y-12 text-sm sm:text-base text-gray-500 font-light leading-relaxed max-w-3xl mx-auto">
                    <p className="text-center">
                        Welcome to LYNE Concept Store. We are more than just a fashion brand; we are a curation of modern aesthetics, timeless design, and uncompromised quality.
                    </p>

                    <div>
                        <h2 className="text-sm tracking-[0.2em] uppercase text-black text-center mb-6 mt-16">Our Philosophy</h2>
                        <p className="text-center">
                            Founded with a vision to redefine everyday elegance, LYNE brings together pieces that are both functional and deeply expressive. Our collections are thoughtfully designed for individuals who appreciate the subtle art of dressing well without screaming for attention.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-sm tracking-[0.2em] uppercase text-black text-center mb-6 mt-16">Sustainability</h2>
                        <p className="text-center">
                            We believe in slow fashion. Every garment, accessory, and detail is crafted to last, prioritizing sustainable practices and ethical production. When you wear LYNE, you wear a commitment to a better, more stylish future.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}