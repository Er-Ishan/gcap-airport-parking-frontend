import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const GCAP_GREEN = "#3cbc84";
const SESSION_SECONDS = 300;

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
    const expiryHandled = useRef(false);

    const bookingData = (location.state || null) as PaymentState | null;

    const [timeLeft, setTimeLeft] = useState(SESSION_SECONDS);
    const [sessionExpired, setSessionExpired] = useState(false);
    const [loading, setLoading] = useState(false);
    const [payError, setPayError] = useState("");

    const [cardName, setCardName] = useState("");
    const [cardNumber, setCardNumber] = useState("");
    const [cardExpiry, setCardExpiry] = useState("");
    const [cardCvv, setCardCvv] = useState("");

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
        }
    }, [timeLeft, sessionExpired]);

    const formatTime = (sec: number) => {
        const m = Math.floor(sec / 60);
        const s = sec % 60;
        return `${m}:${s < 10 ? "0" : ""}${s}`;
    };

    const handleCardNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
        const digits = e.target.value.replace(/\D/g, "").slice(0, 16);
        setCardNumber(digits.replace(/(.{4})(?=.)/g, "$1 "));
    };

    const handleExpiry = (e: React.ChangeEvent<HTMLInputElement>) => {
        const digits = e.target.value.replace(/\D/g, "").slice(0, 4);
        setCardExpiry(digits.length >= 3 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits);
    };

    const handleCvv = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCardCvv(e.target.value.replace(/\D/g, "").slice(0, 4));
    };

    const handlePay = async (e: React.FormEvent) => {
        e.preventDefault();
        setPayError("");

        if (sessionExpired) {
            setPayError("Payment session expired. Please start over.");
            return;
        }

        const rawCard = cardNumber.replace(/\s/g, "");
        if (!cardName.trim()) { setPayError("Please enter the cardholder name."); return; }
        if (rawCard.length !== 16) { setPayError("Please enter a valid 16-digit card number."); return; }
        if (cardExpiry.length !== 5) { setPayError("Please enter a valid expiry date (MM/YY)."); return; }
        if (cardCvv.length < 3) { setPayError("Please enter a valid CVV."); return; }

        setLoading(true);
        await new Promise((r) => setTimeout(r, 1600));
        setLoading(false);

        navigate("/booking-confirmation", {
            state: { ...bookingData, status: "Active" },
        });
    };

    if (!bookingData?.bookingId) return null;

    const timerColor = timeLeft <= 60 ? "#ef4444" : timeLeft <= 120 ? "#f59e0b" : GCAP_GREEN;

    return (
        <section style={{ paddingTop: "0", paddingBottom: "160px", background: "#f7f9fc" }}>

            {/* Banner */}
            <div style={{ background: `linear-gradient(135deg, ${GCAP_GREEN} 0%, #2aa870 100%)`, padding: "36px 0 32px", marginBottom: "40px" }}>
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

                {/* Session expired alert */}
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

                    {/* ── Left: Booking Info ── */}
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

                    {/* ── Right: Card Payment Form ── */}
                    <div className="col-lg-5">
                        <div style={{ background: "#fff", borderRadius: "20px", border: `2px solid ${GCAP_GREEN}`, overflow: "hidden", boxShadow: "0 4px 24px rgba(60,188,132,0.12)", opacity: sessionExpired ? 0.6 : 1, pointerEvents: sessionExpired ? "none" : "auto" }}>
                            <div style={{ background: `linear-gradient(135deg, ${GCAP_GREEN} 0%, #2aa870 100%)`, padding: "18px 24px", textAlign: "center" }}>
                                <h5 style={{ color: "#fff", margin: 0, fontSize: "16px", fontWeight: 700 }}>
                                    <i className="fa-solid fa-lock me-2"></i>Secure Payment
                                </h5>
                            </div>

                            <div style={{ padding: "28px 28px 24px" }}>
                                {/* Mock card visual */}
                                <div style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)", borderRadius: "14px", padding: "20px 22px", marginBottom: "24px", color: "#fff", position: "relative", overflow: "hidden" }}>
                                    <div style={{ position: "absolute", top: "-20px", right: "-20px", width: "100px", height: "100px", borderRadius: "50%", background: "rgba(255,255,255,0.05)" }}></div>
                                    <div style={{ position: "absolute", bottom: "-30px", left: "-10px", width: "120px", height: "120px", borderRadius: "50%", background: "rgba(255,255,255,0.04)" }}></div>
                                    <div style={{ fontSize: "11px", opacity: 0.6, marginBottom: "12px", letterSpacing: "1px", textTransform: "uppercase" }}>Card Number</div>
                                    <div style={{ fontSize: "18px", fontWeight: 700, letterSpacing: "3px", marginBottom: "16px", fontFamily: "monospace" }}>
                                        {cardNumber || "•••• •••• •••• ••••"}
                                    </div>
                                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px" }}>
                                        <div>
                                            <div style={{ opacity: 0.6, marginBottom: "2px" }}>CARDHOLDER</div>
                                            <div style={{ fontWeight: 600, textTransform: "uppercase" }}>{cardName || "YOUR NAME"}</div>
                                        </div>
                                        <div style={{ textAlign: "right" }}>
                                            <div style={{ opacity: 0.6, marginBottom: "2px" }}>EXPIRES</div>
                                            <div style={{ fontWeight: 600 }}>{cardExpiry || "MM/YY"}</div>
                                        </div>
                                    </div>
                                </div>

                                <form onSubmit={handlePay}>
                                    <div className="mb-3">
                                        <label style={labelStyle}>Cardholder Name</label>
                                        <input
                                            type="text"
                                            value={cardName}
                                            onChange={(e) => setCardName(e.target.value)}
                                            placeholder="John Smith"
                                            style={inputStyle}
                                            autoComplete="cc-name"
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label style={labelStyle}>Card Number</label>
                                        <div style={{ position: "relative" }}>
                                            <input
                                                type="text"
                                                value={cardNumber}
                                                onChange={handleCardNumber}
                                                placeholder="1234 5678 9012 3456"
                                                style={{ ...inputStyle, paddingRight: "48px", fontFamily: "monospace", letterSpacing: "2px" }}
                                                autoComplete="cc-number"
                                                inputMode="numeric"
                                            />
                                            <i className="fa-brands fa-cc-visa" style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", color: "#aaa", fontSize: "18px" }}></i>
                                        </div>
                                    </div>
                                    <div className="row g-3 mb-4">
                                        <div className="col-6">
                                            <label style={labelStyle}>Expiry Date</label>
                                            <input
                                                type="text"
                                                value={cardExpiry}
                                                onChange={handleExpiry}
                                                placeholder="MM/YY"
                                                style={{ ...inputStyle, fontFamily: "monospace", letterSpacing: "2px" }}
                                                autoComplete="cc-exp"
                                                inputMode="numeric"
                                            />
                                        </div>
                                        <div className="col-6">
                                            <label style={labelStyle}>CVV</label>
                                            <input
                                                type="password"
                                                value={cardCvv}
                                                onChange={handleCvv}
                                                placeholder="•••"
                                                style={{ ...inputStyle, fontFamily: "monospace", letterSpacing: "4px" }}
                                                autoComplete="cc-csc"
                                                inputMode="numeric"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading || sessionExpired}
                                        style={{
                                            width: "100%",
                                            background: loading ? "#a8e0c8" : GCAP_GREEN,
                                            color: "#fff",
                                            border: "none",
                                            borderRadius: "12px",
                                            padding: "15px",
                                            fontWeight: 800,
                                            fontSize: "16px",
                                            cursor: loading ? "not-allowed" : "pointer",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            gap: "10px",
                                            transition: "background 0.2s",
                                        }}
                                    >
                                        {loading ? (
                                            <><i className="fa-solid fa-spinner fa-spin"></i> Processing Payment…</>
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

                                    {/* Timer bar */}
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

const inputStyle: React.CSSProperties = {
    width: "100%",
    border: "1.5px solid #e8ecf0",
    borderRadius: "10px",
    padding: "11px 14px",
    fontSize: "14px",
    fontWeight: 500,
    color: "#1a1a1a",
    background: "#fafafa",
    outline: "none",
    boxSizing: "border-box",
    height: "46px",
};

export default PaymentPage;
