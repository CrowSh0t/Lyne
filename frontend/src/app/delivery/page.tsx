export default function DeliveryPage() {
    return (
        <div className="min-h-screen bg-white pt-32 pb-24 px-4 sm:px-6 font-sans text-black">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light text-center mb-16 tracking-wide">Delivery Information</h1>

                <div className="space-y-12 text-sm sm:text-base text-gray-500 font-light leading-relaxed max-w-3xl mx-auto">
                    <p className="text-center">
                        The following conditions apply:
                    </p>

                    <div>
                        <h2 className="text-sm tracking-[0.2em] uppercase text-black text-center mb-6 mt-16">Shipping conditions</h2>
                        <p className="text-center">
                            Delivery is made within Ukraine and to selected international countries. We partner with premium courier services to ensure your items arrive safely and in perfect condition.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-sm tracking-[0.2em] uppercase text-black text-center mb-8 mt-16">Shipping costs</h2>
                        <div className="overflow-x-auto mt-8">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-t border-b border-black text-black text-xs tracking-widest uppercase">
                                        <th className="py-4 px-4 font-medium">Shipping Type</th>
                                        <th className="py-4 px-4 font-medium">Shipping Costs</th>
                                        <th className="py-4 px-4 font-medium">Delivery Time</th>
                                    </tr>
                                </thead>
                                <tbody className="text-gray-600 text-sm">
                                    <tr className="border-b border-gray-100">
                                        <td className="py-5 px-4">Standard Domestic</td>
                                        <td className="py-5 px-4">Free (over 1500 ₴)</td>
                                        <td className="py-5 px-4">2-4 days</td>
                                    </tr>
                                    <tr className="border-b border-gray-100">
                                        <td className="py-5 px-4">Express Domestic</td>
                                        <td className="py-5 px-4">150 ₴ per order</td>
                                        <td className="py-5 px-4">Next working day</td>
                                    </tr>
                                    <tr className="border-b border-gray-100">
                                        <td className="py-5 px-4">International Shipping</td>
                                        <td className="py-5 px-4">Calculated at checkout</td>
                                        <td className="py-5 px-4">7-14 days</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    
                    <div>
                        <h2 className="text-sm tracking-[0.2em] uppercase text-black text-center mb-6 mt-16">Delivery times</h2>
                        <p className="text-center">
                            Unless otherwise stated in the respective offer, goods will be delivered within 2-4 days after conclusion of the contract. Please note that there is no delivery on Sundays and public holidays.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}