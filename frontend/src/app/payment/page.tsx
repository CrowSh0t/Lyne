'use client'
import { Phone, Truck, CreditCard, ShieldCheck } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { components } from "@/src/types/schema";
import { useLoading } from "../context/LoadingContext";
import { createPaymentIntent, confirmStripeOrder, deleteCart, getCartItems } from "../api/fetchApi/admin";
import { useRouter } from 'next/navigation';
import SmallProductCard from "@/components/SmallProductCard";
import { loadStripe, Stripe, StripeElements, StripePaymentElement } from '@stripe/stripe-js';


const STRIPE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? '';

const steps = [
  { id: 1, label: 'Ordering Data' },
  { id: 2, label: 'Delivery' },
  { id: 3, label: 'Payment' },
];

type CartDto = components["schemas"]["CartItem"]
type OrderDto = components["schemas"]["OrderDto"]

// --- 1. СТЕПЕР ---
export const CheckoutStepper = ({ currentStep }: { currentStep: number }) => {
  const progressWidth = ((currentStep - 1) / (steps.length - 1)) * 100;

  return (
    <div className="w-full p-16 flex justify-center ">
      <div className="relative flex items-center justify-between w-full max-w-3xl px-5">
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 -translate-y-1/2 z-0" />
        <div
          className="absolute top-5 left-0 h-0.5 bg-black -translate-y-1/2 z-0 transition-all duration-500 ease-in-out"
          style={{ width: `${progressWidth}%` }}
        />
        {steps.map((step) => {
          const isActive = step.id <= currentStep;
          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 ease-in-out ${isActive ? 'bg-black border-black' : 'bg-white border-gray-200'}`}
              >
                <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <div className={`mt-2.5 text-sm transition-colors duration-300 ${isActive ? 'text-black font-medium' : 'text-gray-500'}`}>
                {step.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

interface StepProps {
  onNextStep: () => void;
  onPrevStep?: () => void;
}

const STORAGE_KEY = 'userDeliveryInform';

// --- 2. КРОК 1: Форма даних ---
export const OrderingDataForm = ({ onNextStep, onPrevStep }: StepProps) => {
  const [formData, setFormData] = useState(() => {
    if (typeof window === 'undefined') return {
      firstName: '', lastName: '', country: '', city: '',
      address: '', postalCode: '', phone: '', email: '', comments: '',
    };
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {
      firstName: '', lastName: '', country: '', city: '',
      address: '', postalCode: '', phone: '', email: '', comments: '',
    };
  });

  const [cart, setCart] = useState<CartDto[]>([]);
  const { setLoading } = useLoading();

  useEffect(() => {
    setLoading(true);
    Promise.all([getCartItems()]).then(([cartdata]: [CartDto[]]) => {
      setCart(cartdata);
    }).finally(() => setLoading(false));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: typeof formData) => {
      const updated = { ...prev, [name]: value };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
    onNextStep();
  };

  const inputBaseStyle = 'w-full bg-gray-50 rounded-lg px-4 py-3.5 text-base text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-black focus:border-black transition duration-150';
  const totalItems = cart.reduce((sum, item) => sum + (item.quantity ?? 1), 0);
  const totalAmount = cart.reduce(
    (sum, item) => sum + (item.product?.price ?? 0) * (item.quantity ?? 1),
    0
  );

  return (
    <div className="flex flex-row">
      <div className="flex mr-auto p-4">
        <form onSubmit={handleSubmit} className="space-y-6">
          <h2 className="text-2xl font-semibold text-center text-gray-950 mb-8">Fill the fields</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First name" className={inputBaseStyle} />
            <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last name" className={inputBaseStyle} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input type="text" name="country" value={formData.country} onChange={handleChange} placeholder="Country" className={inputBaseStyle} />
            <input type="text" name="city" value={formData.city} onChange={handleChange} placeholder="City" className={inputBaseStyle} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Address" className={inputBaseStyle} />
            </div>
            <input type="text" name="postalCode" value={formData.postalCode} onChange={handleChange} placeholder="Postal code" className={inputBaseStyle} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Phone className="w-5 h-5 text-gray-400" />
              </div>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" className={`${inputBaseStyle} pl-12`} />
            </div>
            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" className={inputBaseStyle} />
          </div>
          <textarea name="comments" value={formData.comments} onChange={handleChange} placeholder="Comments" className={`${inputBaseStyle} resize-none`} />
          <div className="pt-6">
            <button type="submit" className="w-full bg-black text-white px-8 py-4 text-base font-medium hover:bg-gray-800 transition">
              Confirm & Continue to Delivery
            </button>
          </div>
        </form>
      </div>
      <div className="flex w-1/2 ml-auto flex-col pl-4" style={{ background: 'linear-gradient(135deg, #95AEBC, #BAA3A9, #FECBBB)' }}>
        <h1 className="text-3xl">Order Composition</h1>
        <div className="p-2 overflow-y-auto flex flex-row">
          {cart.map((c) => c.product && (
            <div key={c.productId} className="px-2">
              <SmallProductCard product={c.product} brandName={c.product.brand?.name ?? ''} />
            </div>
          ))}
        </div>
        <div className="p-6">
          <h1 className="py-4">Total {totalAmount} UAH</h1>
          <h1>Order amount: {totalAmount} UAH</h1>
          <br />
          <h1>Shipping cost: Free</h1>
          <br />
          <h1>Discount: 0 %</h1>
          <br />
          <hr />
          <h1 className="py-4">Subtotal: {totalItems} items</h1>
        </div>
      </div>
    </div>
  );
};

// --- 3. КРОК 2: Вибір доставки ---
export const DeliveryForm = ({ onNextStep, onPrevStep }: StepProps) => {
  const deliveryOptions = [
    { id: 'nova_poshta', title: 'Nova Poshta Courier', price: '123.00 UAH', cost: 123 },
    { id: 'pickup', title: 'Self Pickup from Store', price: 'Free', cost: 0 },
  ];
  const [deliveryMethod, setDeliveryMethod] = useState('nova_poshta');
  const [cart, setCart] = useState<CartDto[]>([]);
  const [order, setOrder] = useState<OrderDto>();
  const selectedDelivery = deliveryOptions.find((item) => item.id === deliveryMethod);
  const shippingCost = selectedDelivery?.cost ?? 0;
  const { setLoading } = useLoading();

  useEffect(() => {
    setLoading(true);
    getCartItems().then((cartdata) => setCart(cartdata)).finally(() => setLoading(false));
  }, []);

  const totalAmount = cart.reduce((sum, item) => sum + (item.product?.price ?? 0) * (item.quantity ?? 1), 0);

  return (
    <div className="space-y-6 items-center justify-center flex flex-row">
      <div className="flex flex-col w-1/2 px-6">
        <h2 className="text-2xl font-semibold text-center text-gray-950 mb-8">Select Delivery Method</h2>
        <div className="space-y-4">
          {deliveryOptions.map((item) => (
            <label
              key={item.id}
              onClick={() => setDeliveryMethod(item.id)}
              className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition ${deliveryMethod === item.id ? 'border-black bg-gray-50' : 'border-gray-200'}`}
            >
              <div className="flex items-center gap-3">
                <Truck className="w-5 h-5 text-gray-600" />
                <span className="font-medium text-gray-900">{item.title}</span>
              </div>
              <span className="text-gray-500">{item.price}</span>
            </label>
          ))}
        </div>
        <div className="pt-6 flex gap-4">
          <button type="button" onClick={onPrevStep} className="w-1/3 border border-gray-300 text-gray-700 py-4 font-medium hover:bg-gray-50 transition">Back</button>
          <button type="button" onClick={onNextStep} className="w-2/3 bg-black text-white py-4 font-medium hover:bg-gray-800 transition">Continue to Payment</button>
        </div>
      </div>
      <div className="flex w-1/2 ml-auto flex-col pl-4" style={{ background: 'linear-gradient(135deg, #95AEBC, #BAA3A9, #FECBBB)' }}>
        <h1 className="text-3xl">Order Composition</h1>
        <div className="p-2 overflow-y-auto flex flex-row">
          {cart.map((c) => c.product && (
            <div key={c.productId} className="px-2">
              <SmallProductCard product={c.product} brandName={c.product.brand?.name ?? ''} />
            </div>
          ))}
        </div>
        <div className="p-6">
          <h1 className="py-4">Total {totalAmount + shippingCost} UAH</h1>
          <h1>Order amount: {order?.amount ?? 0} UAH</h1>
          <br />
          <h1>Shipping cost: {shippingCost > 0 ? `${shippingCost} UAH` : 'Free'}</h1>
          <br />
          <h1>Discount: 0 %</h1>
          <br />
          <hr />
          <h1 className="py-4">Subtotal: {cart.length ?? 0} items</h1>
        </div>
      </div>
    </div>
  );
};

// --- 4. КРОК 3: Оплата зі Stripe ---
export const PaymentForm = ({ onPrevStep }: StepProps) => {
  const router = useRouter();
  const { setLoading } = useLoading();

  const [cart, setCart] = useState<CartDto[]>([]);
  const [showCardModal, setShowCardModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stripeError, setStripeError] = useState<string | null>(null);
  const [isStripeReady, setIsStripeReady] = useState(false);

  // Stripe refs — ініціалізуємо один раз при відкритті модалки
  const stripeRef = useRef<Stripe | null>(null);
  const elementsRef = useRef<StripeElements | null>(null);
  const cartRef = useRef<CartDto[]>([]);

  useEffect(() => {
    setLoading(true);
    Promise.all([getCartItems()]).then(([cartdata]: [CartDto[]]) => {
      setCart(cartdata);
      cartRef.current = cartdata;
    }).finally(() => setLoading(false));
  }, []);



  useEffect(() => {
    if (!showCardModal) return;

    let paymentElement: StripePaymentElement | null = null;

    const initStripe = async () => {
      setStripeError(null);
      setIsStripeReady(false);

      try {
        const stripe = await loadStripe(STRIPE_PUBLISHABLE_KEY);
        if (!stripe) throw new Error('Failed to load Stripe');
        stripeRef.current = stripe;

        const { clientSecret } = await createPaymentIntent({
          items: cartRef.current.map((item) => ({
            productId: item.productId,
            quantity: item.quantity ?? 1,
          })),
        });

        const elements = stripe.elements({ clientSecret });
        elementsRef.current = elements;

        // створюємо в локальну const — її тип точно ненульовий
        const el = elements.create('payment', {
          layout: 'tabs',
        });
        el.mount('#stripe-card-element');
        el.on('ready', () => setIsStripeReady(true));

        paymentElement = el;
      } catch (err: any) {
        setStripeError(err.message ?? 'Помилка ініціалізації Stripe');
      }
    };

    initStripe();

    return () => {
      paymentElement?.unmount();
      elementsRef.current = null;
    };
  }, [showCardModal]);

  const handlePayment = () => {
    setShowCardModal(true);
  };

  const handleConfirmCard = async () => {
    if (isSubmitting || !stripeRef.current || !elementsRef.current) return;

    setIsSubmitting(true);
    setStripeError(null);

    try {
      // Валідація форми Stripe
      const { error: submitError } = await elementsRef.current.submit();
      if (submitError) {
        setStripeError(submitError.message ?? 'Помилка форми');
        return;
      }

      // Підтверджуємо оплату
      const { error: confirmError, paymentIntent } = await stripeRef.current.confirmPayment({
        elements: elementsRef.current,
        confirmParams: {
          return_url: `${window.location.origin}/myAccount`,
        },
        redirect: 'if_required',
      });

      if (confirmError) {
        setStripeError(confirmError.message ?? 'Помилка оплати');
        return;
      }

      if (paymentIntent?.status === 'succeeded') {
        // Зберігаємо замовлення в БД
        await confirmStripeOrder(paymentIntent.id, {
          items: cartRef.current.map((item) => ({
            productId: item.productId,
            quantity: item.quantity ?? 1,
          })),
        });
        await deleteCart();
        setShowCardModal(false);
        router.push('/myAccount');
      }
    } catch (err: any) {
      setStripeError(err.message ?? 'Невідома помилка');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 text-center max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold text-gray-950 mb-8">Payment Details</h2>

      <div className="p-6 bg-gray-50 rounded-2xl flex flex-col items-center gap-3">
        <CreditCard className="w-10 h-10 text-gray-700" />
        <p className="text-sm text-gray-500">Pay securely with Credit Card or Apple Pay</p>
      </div>

      <div className="pt-6 flex gap-4">
        <button
          type="button"
          onClick={onPrevStep}
          className="w-1/3 border border-gray-300 text-gray-700 py-4 font-medium hover:bg-gray-50 transition"
        >
          Back
        </button>
        <button
          type="button"
          onClick={handlePayment}
          className="w-2/3 bg-black text-white py-4 font-medium hover:bg-gray-800 transition"
        >
          Complete Order
        </button>
      </div>

      {/* Модалка з реальним Stripe Element */}
      {showCardModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-md relative shadow-2xl border border-gray-100">
            <button
              onClick={() => setShowCardModal(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition"
            >
              ✕
            </button>

            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Enter Card Details</h2>
              <p className="text-xs text-gray-500 mt-1 flex items-center justify-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Encrypted 256-bit SSL connection
              </p>
            </div>

            <div className="flex items-center justify-center mb-4">
              <img src="images/cart/CartsForPayment.svg" alt="payment cards" />
            </div>

            <div className="space-y-4">
              {/* Stripe Payment Element монтується сюди */}
              <div
                id="stripe-card-element"
                className="min-h-[120px] rounded-xl"
              />

              {/* Стан завантаження Stripe */}
              {!isStripeReady && !stripeError && (
                <div className="text-center text-sm text-gray-400 py-2">
                  Loading secure payment form...
                </div>
              )}

              {/* Повідомлення про помилку */}
              {stripeError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm text-left">
                  {stripeError}
                </div>
              )}

              <p className="text-[11px] text-gray-400 text-center leading-relaxed pt-1">
                You may need to confirm this transaction via 3D-Secure in your banking app.
              </p>

              <button
                onClick={handleConfirmCard}
                disabled={isSubmitting || !isStripeReady}
                className="w-full bg-black hover:bg-gray-800 text-white py-4 rounded-xl font-medium
                           text-sm transition shadow-lg shadow-black/10 active:scale-[0.99]
                           disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Processing...' : 'Confirm and Pay'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- ГОЛОВНИЙ КОМПОНЕНТ СТОРІНКИ ---
export default function PaymentPage() {
  const [currentStep, setCurrentStep] = useState(1);

  const handleNextStep = () => setCurrentStep((prev) => Math.min(prev + 1, steps.length));
  const handlePrevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  return (
    <div className="min-h-screen bg-white">
      <CheckoutStepper currentStep={currentStep} />
      <div className="w-full flex justify-center items-center py-6 px-4">
        <div className="w-full bg-white rounded-3xl px-10 py-8">
          {currentStep === 1 && <OrderingDataForm onNextStep={handleNextStep} />}
          {currentStep === 2 && <DeliveryForm onNextStep={handleNextStep} onPrevStep={handlePrevStep} />}
          {currentStep === 3 && <PaymentForm onNextStep={handleNextStep} onPrevStep={handlePrevStep} />}
        </div>
      </div>
    </div>
  );
}