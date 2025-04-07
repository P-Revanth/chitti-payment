export default function PaymentFailed() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-green-100">
            <h1 className="text-3xl font-bold text-green-800">Payment Failed</h1>
            <p className="text-lg mt-4 text-black">Please try again.</p>
        </div>
    );
}