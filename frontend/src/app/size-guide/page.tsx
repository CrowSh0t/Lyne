export default function SizeGuidePage() {
    return (
        <div className="min-h-screen bg-white pt-32 pb-24 px-4 sm:px-6 font-sans text-black">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light text-center mb-16 tracking-wide">Size Guide</h1>

                <div className="space-y-12 text-sm sm:text-base text-gray-500 font-light leading-relaxed max-w-3xl mx-auto">
                    <p className="text-center">
                        Use the chart below to find your perfect fit. All measurements are in centimeters (cm) and refer to body dimensions, not garment dimensions.
                    </p>

                    <div className="overflow-x-auto mt-16">
                        <table className="w-full text-center border-collapse">
                            <thead>
                                <tr className="border-t border-b border-black text-black text-xs tracking-widest uppercase">
                                    <th className="py-4 px-4 font-medium">Size</th>
                                    <th className="py-4 px-4 font-medium">Bust</th>
                                    <th className="py-4 px-4 font-medium">Waist</th>
                                    <th className="py-4 px-4 font-medium">Hips</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-600 text-sm">
                                <tr className="border-b border-gray-100">
                                    <td className="py-5 px-4 font-medium text-black">XS (34)</td>
                                    <td className="py-5 px-4">82 - 86</td>
                                    <td className="py-5 px-4">62 - 66</td>
                                    <td className="py-5 px-4">88 - 92</td>
                                </tr>
                                <tr className="border-b border-gray-100">
                                    <td className="py-5 px-4 font-medium text-black">S (36)</td>
                                    <td className="py-5 px-4">86 - 90</td>
                                    <td className="py-5 px-4">66 - 70</td>
                                    <td className="py-5 px-4">92 - 96</td>
                                </tr>
                                <tr className="border-b border-gray-100">
                                    <td className="py-5 px-4 font-medium text-black">M (38)</td>
                                    <td className="py-5 px-4">90 - 94</td>
                                    <td className="py-5 px-4">70 - 74</td>
                                    <td className="py-5 px-4">96 - 100</td>
                                </tr>
                                <tr className="border-b border-gray-100">
                                    <td className="py-5 px-4 font-medium text-black">L (40)</td>
                                    <td className="py-5 px-4">94 - 98</td>
                                    <td className="py-5 px-4">74 - 78</td>
                                    <td className="py-5 px-4">100 - 104</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}