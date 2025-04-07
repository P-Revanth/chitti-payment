import type { NextApiRequest, NextApiResponse } from 'next';
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') return res.status(405).end('Method Not Allowed');

    try {
        const order = razorpay.orders.create({
            amount: 50000,
            currency: 'INR',
            receipt: 'receipt_001',
            payment_capture: true,
            notes: {
                email: 'customer@example.com',
            },
        });

        // Build Razorpay payment link for hosted page
        const paymentLink = await razorpay.paymentLink.create({
            amount: 50000,
            currency: 'INR',
            description: 'Test Payment for Order',
            customer: {
                name: 'John Doe',
                email: 'customer@example.com',
                contact: '9999999999',
            },
            notify: {
                sms: true,
                email: true,
            },
            callback_url: 'http://localhost:3000/payment-success', // Update for prod
            callback_method: 'get',
        });

        res.status(200).json({ payment_url: paymentLink.short_url });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to create order' });
    }
}