export default function PaymentsPage() {
    return (
        <div className="min-h-screen bg-white pt-32 pb-24 px-4 sm:px-6 font-sans text-black">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light text-center mb-16 tracking-wide">Payments</h1>

                <div className="space-y-12 text-sm sm:text-base text-gray-500 font-light leading-relaxed max-w-3xl mx-auto">
                    <div>
                        <h2 className="text-sm tracking-[0.2em] uppercase text-black text-center mb-6 mt-12">Accepted payment methods</h2>
                        <div className="flex flex-col items-center space-y-2">
                            <p>- Payment by credit card (Visa, Mastercard)</p>
                            <p>- Payment via Apple Pay / Google Pay</p>
                            <p>- Cash on delivery (Nova Poshta)</p>
                        </div>
                    </div>

                    <div>
                        <h2 className="text-sm tracking-[0.2em] uppercase text-black text-center mb-6 mt-16">Further details on payment</h2>
                        <p className="text-center">
                            The order amount is deposited on your card as a payment reservation and booked after the order has been dispatched. In the event of cancellation, the amount will be released immediately. Refunds from returns will be made to the credit card used to pay for the original order.
                        </p>
                    </div>

                    <div className="pt-12 text-center border-t border-gray-100 mt-16">
                        <p>If you have any further questions, please do not hesitate to contact us:</p>
                        <p className="mt-4 text-black font-medium">E-mail: support@lyne.com</p>
                        <p className="text-black font-medium">Phone: 0 (800) 313 234</p>
                    </div>
                </div>
            </div>
        </div>
    );
}