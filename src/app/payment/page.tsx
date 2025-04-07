'use client';

import { usePathname, useRouter } from 'next/navigation';
import Script from 'next/script';
import { useState } from 'react';


export default function PaymentPage() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const pathname = usePathname();
    const baseUrl = pathname.replaceAll("/payment", "");
    const handlePayment = async () => {
        setLoading(true);
        const userId = "";
        try {

            const createOrderId = async () => {
                try {
                    console.log(userId);
                    const response = await fetch(
                        "https://asia-south1-chitti-ananta.cloudfunctions.net/createOrder",
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                userId: userId,
                                amount: 100,
                            }),
                        }
                    );

                    if (!response.ok) {
                        throw new Error("Network response was not ok");
                    }
                    const data = await response.json();
                    console.log(data);
                    return data["id"];
                } catch (error) {
                    console.error(
                        "There was a problem with your fetch operation:",
                        error
                    );
                }
            };
            try {
                const createOrderIdValue = await createOrderId();
                console.log(createOrderIdValue);
                const options = {
                    key: "rzp_live_dXsSgWNlpWQ07d",
                    amount: 100,
                    currency: "INR",
                    'name': 'Score With CHITTI.',
                    description: "Purchasing subscription to study with CHITTI.",
                    order_id: createOrderIdValue,
                    callback_url: `${baseUrl}/payment-successful`,
                    theme: {
                        color: "#3399cc",
                    },
                    retry: {
                        enabled: false,
                    },

                    timeout: 300,
                };
                if (typeof window !== undefined) {
                    const paymentObject = new (window as any).Razorpay(
                        options
                    );
                    paymentObject.on(
                        "payment.failed",
                        function (response: any) {
                            router.push("/payment-failed");
                            paymentObject.close();
                        }
                    );
                    // paymentObject.on(
                    //   "ondismiss",
                    //   function (response: any) {
                    //     router.push("/processing-ticket?status=failed");
                    //     paymentObject.close();
                    //   }
                    // );
                    paymentObject.open();
                }
            } catch (error) {
                console.log(error);
            }
        } catch (err) {
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
            <Script
                id="razorpay-checkout-js"
                src="https://checkout.razorpay.com/v1/checkout.js"
            />
            <h1 className="text-4xl font-bold mb-6">Payment Page</h1>
            <button
                onClick={handlePayment}
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition"
            >
                {loading ? 'Redirecting...' : 'Pay Now'}
            </button>
        </div>
    );
}