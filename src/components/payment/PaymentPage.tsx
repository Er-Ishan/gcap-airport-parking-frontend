import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { completeBookingAfterPayment, notifyPaymentSessionExpired, apiFetch } from "../../services/parkingApi";

const GCAP_GREEN = "#67a71e";
const SESSION_SECONDS = 300;
const API = import.meta.env.VITE_API_URL as string;

interface PaymentState {
    bookingId: number;
    product_name?: string;
    drop_off_date?: string;
    return_date?: string;
    first_name?: string;
    last_name?: string;
    email?: string;
    mobile?: string;
    total_payable?: string | number;
    quote_amount?: number | string;
    discount?: number | string;
    booking_fee?: number | string;
    travelling_from?: string;
    [key: string]: unknown;
}

const PaymentPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const stripe = useStripe();
    const elements = useElements();
    const expiryHandled = useRef(false);

    const bookingData = (location.state || null) as PaymentState | null;

    const [clientSecret, setClientSecret] = useState("");
    const [timeLeft, setTimeLeft] = useState(SESSION_SECONDS);
    const [sessionExpired, setSessionExpired] = useState(false);
    const [loading, setLoading] = useState(false);
    const [payError, setPayError] = useState("");

    useEffect(() => {
        if (!bookingData?.bookingId) {
            navigate("/pricing-quotes", { replace: true });
        }
    }, [bookingData, navigate]);

    useEffect(() => {
        if (sessionExpired || timeLeft <= 0) return;
        const t = setTimeout(() => setTimeLeft((p) => p - 1), 1000);
        return () => clearTimeout(t);
    }, [timeLeft, sessionExpired]);

    useEffect(() => {
        if (timeLeft <= 0 && !sessionExpired && !expiryHandled.current) {
            expiryHandled.current = true;
            setSessionExpired(true);
            if (bookingData?.bookingId) {
                void notifyPaymentSessionExpired(bookingData.bookingId);
            }
        }
    }, [timeLeft, sessionExpired, bookingData]);

    // Create Stripe PaymentIntent on mount so the card form is ready
    useEffect(() => {
        if (!bookingData?.bookingId || sessionExpired) return;
        (async () => {
            try {
                const resp = await apiFetch(`${API}/api/stripe/create-payment-intent`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        amount: Math.round(Number(bookingData.total_payable) * 100),
                        booking_id: bookingData.bookingId,
                        payment_intent_id: null,
                    }),
                });
                const data = await resp.json();
                if (data.clientSecret) {
                    setClientSecret(data.clientSecret);
                } else {
                    setPayError(data.error || "Unable to initialise payment. Please refresh.");
                }
            } catch {
                setPayError("Unable to connect to payment service. Please check your connection.");
            }
        })();
    }, [bookingData, sessionExpired]);

    const formatTime = (sec: number) => {
        const m = Math.floor(sec / 60);
        const s = sec % 60;
        return `${m}:${s < 10 ? "0" : ""}${s}`;
    };

    const handlePay = async (e: React.FormEvent) => {
        e.preventDefault();
        setPayError("");

        if (sessionExpired) {
            setPayError("Payment session expired. Please start over.");
            return;
        }

        if (!stripe || !elements || !clientSecret) {
            setPayError("Payment is not ready. Please wait or refresh.");
            return;
        }

        if (!bookingData) return;

        setLoading(true);

        const cardElement = elements.getElement(CardElement);
        const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: cardElement!,
                billing_details: {
                    name: `${bookingData.first_name || ""} ${bookingData.last_name || ""}`.trim(),
                    email: bookingData.email || "",
                },
            },
        });

        if (error) {
            setPayError(error.message || "Payment failed. Please check your card details.");
            setLoading(false);
            return;
        }

        if (paymentIntent?.status === "succeeded") {
            const paymentMethodId =
                typeof paymentIntent.payment_method === "string"
                    ? paymentIntent.payment_method
                    : (paymentIntent.payment_method as { id: string } | null)?.id ?? null;

            const result = await completeBookingAfterPayment({
                booking_id: bookingData.bookingId,
                transaction_id: paymentIntent.id,
                payment_method_id: paymentMethodId,
            });

            setLoading(false);

            if (!result.success) {
                setPayError("Payment succeeded but booking update failed. Please contact support.");
                return;
            }

            navigate("/thank-you", {
                state: {
                    ...bookingData,
                    status: "Active",
                    ref_no: result.ref_no,
                    transaction_id: paymentIntent.id,
                },
            });
        } else {
            setLoading(false);
        }
    };

    if (!bookingData?.bookingId) return null;

    const timerColor = timeLeft <= 60 ? "#ef4444" : timeLeft <= 120 ? "#f59e0b" : GCAP_GREEN;

    return (
        <section style={{ paddingTop: "0", paddingBottom: "160px", background: "#f7f9fc" }}>

            {/* Banner */}
            <div style={{ background: `linear-gradient(135deg, ${GCAP_GREEN} 0%, #4e8515 100%)`, padding: "36px 0 32px", marginBottom: "40px" }}>
                <div className="container text-center">
                    <h2 style={{ color: "#fff", fontSize: "26px", fontWeight: 800, margin: "0 0 10px" }}>
                        Confirm &amp; Secure Your Payment
                    </h2>
                    <p style={{ color: "rgba(255,255,255,0.85)", margin: "0 0 14px", fontSize: "14px" }}>
                        Complete your purchase securely. Your booking is reserved while you pay.
                    </p>
                    {!sessionExpired ? (
                        <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(255,255,255,0.15)", borderRadius: "20px", padding: "8px 20px" }}>
                            <i className="fa-regular fa-clock" style={{ color: "#fff", fontSize: "14px" }}></i>
                            <span style={{ color: "#fff", fontWeight: 700, fontSize: "15px" }}>
                                Session expires in:{" "}
                                <span style={{ color: timeLeft <= 60 ? "#fde68a" : "#fff", letterSpacing: "1px" }}>
                                    {formatTime(timeLeft)}
                                </span>
                            </span>
                        </div>
                    ) : (
                        <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(239,68,68,0.25)", borderRadius: "20px", padding: "8px 20px" }}>
                            <i className="fa-solid fa-triangle-exclamation" style={{ color: "#fde68a" }}></i>
                            <span style={{ color: "#fde68a", fontWeight: 700, fontSize: "15px" }}>Payment session has expired</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="container">

                {sessionExpired && (
                    <div style={{ maxWidth: "660px", margin: "0 auto 32px", background: "#fff3cd", border: "1px solid #ffc107", borderRadius: "14px", padding: "24px", textAlign: "center" }}>
                        <i className="fa-solid fa-hourglass-end" style={{ fontSize: "28px", color: "#d97706", marginBottom: "12px", display: "block" }}></i>
                        <p className="fw-semibold mb-1">Your payment window has ended.</p>
                        <p className="small text-muted mb-3">
                            Your booking reference has been saved. Please start a new search to book again.
                        </p>
                        <button
                            type="button"
                            onClick={() => navigate("/pricing-quotes")}
                            style={{ background: GCAP_GREEN, color: "#fff", border: "none", borderRadius: "10px", padding: "10px 28px", fontWeight: 700, cursor: "pointer", fontSize: "14px" }}
                        >
                            <i className="fa-solid fa-rotate-left me-2"></i>Start Over
                        </button>
                    </div>
                )}

                {payError && !sessionExpired && (
                    <div className="alert alert-danger text-center" style={{ maxWidth: "660px", margin: "0 auto 20px", borderRadius: "10px" }}>
                        <i className="fa-solid fa-circle-exclamation me-2"></i>{payError}
                    </div>
                )}

                <div className="row g-4 justify-content-center align-items-start">

                    {/* Left: Booking Info */}
                    <div className="col-lg-5">
                        <div style={{ background: "#fff", borderRadius: "20px", border: "1px solid #e8ecf0", overflow: "hidden", boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}>
                            <div style={{ background: "#f8fafb", padding: "18px 24px", borderBottom: "1px solid #e8ecf0", display: "flex", alignItems: "center", gap: "8px" }}>
                                <i className="fa-solid fa-receipt" style={{ color: GCAP_GREEN }}></i>
                                <h5 style={{ margin: 0, fontSize: "15px", fontWeight: 700 }}>Booking Information</h5>
                            </div>
                            <div style={{ padding: "20px 24px" }}>
                                <table style={{ width: "100%", fontSize: "13px", borderCollapse: "collapse" }}>
                                    <tbody>
                                        {[
                                            { label: "Booking ID", value: `#${bookingData.bookingId}` },
                                            { label: "Product", value: bookingData.product_name },
                                            { label: "Airport", value: bookingData.travelling_from },
                                            { label: "Drop-off", value: bookingData.drop_off_date },
                                            { label: "Return", value: bookingData.return_date },
                                            { label: "Name", value: bookingData.first_name && bookingData.last_name ? `${bookingData.first_name} ${bookingData.last_name}` : undefined },
                                            { label: "Email", value: bookingData.email },
                                            { label: "Mobile", value: bookingData.mobile },
                                        ]
                                            .filter(({ value }) => !!value)
                                            .map(({ label, value }) => (
                                                <tr key={label} style={{ borderBottom: "1px solid #f0f4f8" }}>
                                                    <td style={{ padding: "9px 0", color: "#777", whiteSpace: "nowrap", paddingRight: "16px" }}>{label}</td>
                                                    <td style={{ padding: "9px 0", fontWeight: 600, color: "#1a1a1a", textAlign: "right" }}>{value as string}</td>
                                                </tr>
                                            ))}
                                        <tr>
                                            <td style={{ paddingTop: "14px", fontWeight: 700, fontSize: "14px" }}>Total Payable</td>
                                            <td style={{ paddingTop: "14px", fontWeight: 800, fontSize: "20px", color: GCAP_GREEN, textAlign: "right" }}>
                                                £{bookingData.total_payable}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Right: Stripe Card Form */}
                    <div className="col-lg-5">
                        <div style={{ background: "#fff", borderRadius: "20px", border: `2px solid ${GCAP_GREEN}`, overflow: "hidden", boxShadow: "0 4px 24px rgba(103, 167, 30, 0.12)", opacity: sessionExpired ? 0.6 : 1, pointerEvents: sessionExpired ? "none" : "auto" }}>
                            <div style={{ background: `linear-gradient(135deg, ${GCAP_GREEN} 0%, #4e8515 100%)`, padding: "18px 24px", textAlign: "center" }}>
                                <h5 style={{ color: "#fff", margin: 0, fontSize: "16px", fontWeight: 700 }}>
                                    <i className="fa-solid fa-lock me-2"></i>Secure Payment
                                </h5>
                            </div>

                            <div style={{ padding: "28px 28px 24px" }}>
                                {!stripe && (
                                    <div style={{ background: "#fff3cd", border: "1px solid #ffc107", borderRadius: "8px", padding: "10px 14px", marginBottom: "16px", fontSize: "13px", color: "#856404" }}>
                                        <i className="fa-solid fa-triangle-exclamation me-2"></i>
                                        Payment service is loading… If this persists, please refresh the page.
                                    </div>
                                )}

                                <form onSubmit={handlePay}>
                                    <div className="mb-4">
                                        <label style={labelStyle}>Card Details</label>
                                        <div style={{
                                            border: "1.5px solid #e8ecf0",
                                            borderRadius: "10px",
                                            padding: "13px 14px",
                                            background: "#fafafa",
                                            height: "46px",
                                            display: "flex",
                                            alignItems: "center",
                                        }}>
                                            <div style={{ width: "100%" }}>
                                                <CardElement
                                                    options={{
                                                        hidePostalCode: true,
                                                        style: {
                                                            base: {
                                                                fontSize: "15px",
                                                                color: "#1a1a1a",
                                                                fontFamily: "sans-serif",
                                                                lineHeight: "1.5",
                                                                "::placeholder": { color: "#aab7c4" },
                                                            },
                                                            invalid: { color: "#ef4444" },
                                                        },
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading || sessionExpired || !clientSecret || !stripe}
                                        style={{
                                            width: "100%",
                                            background: loading || !clientSecret ? "#a8e0c8" : GCAP_GREEN,
                                            color: "#fff",
                                            border: "none",
                                            borderRadius: "12px",
                                            padding: "15px",
                                            fontWeight: 800,
                                            fontSize: "16px",
                                            cursor: loading || !clientSecret ? "not-allowed" : "pointer",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            gap: "10px",
                                            transition: "background 0.2s",
                                        }}
                                    >
                                        {loading ? (
                                            <><i className="fa-solid fa-spinner fa-spin"></i> Processing Payment…</>
                                        ) : !clientSecret ? (
                                            <><i className="fa-solid fa-spinner fa-spin"></i> Loading Payment…</>
                                        ) : (
                                            <><i className="fa-solid fa-lock"></i> Pay £{bookingData.total_payable}</>
                                        )}
                                    </button>

                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "16px", marginTop: "16px" }}>
                                        <span style={{ fontSize: "11px", color: "#aaa", display: "flex", alignItems: "center", gap: "5px" }}>
                                            <i className="fa-solid fa-shield-halved" style={{ color: GCAP_GREEN }}></i>
                                            SSL Encrypted
                                        </span>
                                        <span style={{ fontSize: "11px", color: "#aaa", display: "flex", alignItems: "center", gap: "5px" }}>
                                            <i className="fa-brands fa-cc-visa" style={{ color: "#1a1f71" }}></i>
                                            <i className="fa-brands fa-cc-mastercard" style={{ color: "#eb001b" }}></i>
                                            Accepted
                                        </span>
                                        <span style={{ fontSize: "11px", color: "#aaa", display: "flex", alignItems: "center", gap: "5px" }}>
                                            <i className="fa-solid fa-lock" style={{ color: GCAP_GREEN }}></i>
                                            Secure
                                        </span>
                                    </div>

                                    {!sessionExpired && (
                                        <div style={{ marginTop: "14px" }}>
                                            <div style={{ background: "#f0f4f8", borderRadius: "4px", height: "4px", overflow: "hidden" }}>
                                                <div style={{
                                                    width: `${(timeLeft / SESSION_SECONDS) * 100}%`,
                                                    height: "100%",
                                                    background: timerColor,
                                                    transition: "width 1s linear, background 0.5s",
                                                    borderRadius: "4px",
                                                }} />
                                            </div>
                                            <p style={{ fontSize: "11px", color: "#aaa", textAlign: "center", marginTop: "6px", marginBottom: 0 }}>
                                                {formatTime(timeLeft)} remaining to complete payment
                                            </p>
                                        </div>
                                    )}
                                </form>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

const labelStyle: React.CSSProperties = {
    fontSize: "12px",
    fontWeight: 700,
    color: "#444",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    display: "block",
    marginBottom: "6px",
};

export default PaymentPage;
