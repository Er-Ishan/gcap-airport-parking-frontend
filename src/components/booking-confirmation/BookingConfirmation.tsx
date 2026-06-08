import React from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";

const GCAP_GREEN = "#3cbc84";

const BookingConfirmation: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const state = (location.state || {}) as Record<string, unknown>;

    const bookingId = state.bookingId as number | undefined;
    const firstName = state.first_name as string | undefined;
    const lastName = state.last_name as string | undefined;
    const email = state.email as string | undefined;
    const productName = state.product_name as string | undefined;
    const dropDate = state.drop_off_date as string | undefined;
    const returnDate = state.return_date as string | undefined;
    const totalPayable = state.total_payable as string | undefined;
    const travellingFrom = state.travelling_from as string | undefined;

    if (!bookingId) {
        return (
            <section style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div className="text-center">
                    <i className="fa-solid fa-triangle-exclamation" style={{ fontSize: "48px", color: "#f59e0b", marginBottom: "16px", display: "block" }}></i>
                    <h3 style={{ marginBottom: "12px" }}>No booking found</h3>
                    <p style={{ color: "#666", marginBottom: "20px" }}>It looks like you navigated here directly.</p>
                    <button className="bk-search-button" onClick={() => navigate("/")}>Back to Home</button>
                </div>
            </section>
        );
    }

    const ref = String(bookingId).padStart(8, "0");

    return (
        <section style={{ paddingTop: "60px", paddingBottom: "160px", background: "#f7f9fc", minHeight: "70vh" }}>
            <div className="container" style={{ maxWidth: "680px" }}>

                {/* Success banner */}
                <div style={{ background: `linear-gradient(135deg, ${GCAP_GREEN} 0%, #2aa870 100%)`, borderRadius: "18px", padding: "44px 32px 36px", textAlign: "center", marginBottom: "28px", boxShadow: "0 8px 32px rgba(60,188,132,0.25)" }}>
                    <div style={{ width: "72px", height: "72px", borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px" }}>
                        <i className="fa-solid fa-check" style={{ fontSize: "34px", color: "#fff" }}></i>
                    </div>
                    <h1 style={{ color: "#fff", fontSize: "26px", fontWeight: 800, margin: "0 0 8px" }}>
                        Booking Confirmed!
                    </h1>
                    <p style={{ color: "rgba(255,255,255,0.85)", margin: "0 0 18px", fontSize: "15px" }}>
                        {firstName ? `Thank you, ${firstName}! ` : ""}Your parking has been reserved successfully.
                    </p>
                    <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: "10px", display: "inline-block", padding: "10px 28px" }}>
                        <span style={{ color: "rgba(255,255,255,0.75)", fontSize: "12px", letterSpacing: "1px", textTransform: "uppercase", display: "block", marginBottom: "2px" }}>Booking Reference</span>
                        <span style={{ color: "#fff", fontSize: "24px", fontWeight: 800, letterSpacing: "3px" }}>GCAP-{ref}</span>
                    </div>
                </div>

                {/* Details card */}
                <div style={{ background: "#fff", borderRadius: "16px", border: "1px solid #e8ecf0", overflow: "hidden", marginBottom: "24px", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
                    <div style={{ background: "#f8fafb", padding: "16px 24px", borderBottom: "1px solid #e8ecf0", display: "flex", alignItems: "center", gap: "8px" }}>
                        <i className="fa-solid fa-receipt" style={{ color: GCAP_GREEN }}></i>
                        <h5 style={{ margin: 0, fontSize: "15px", fontWeight: 700 }}>Booking Summary</h5>
                    </div>
                    <div style={{ padding: "20px 24px" }}>
                        {[
                            { label: "Product", value: productName },
                            { label: "Airport", value: travellingFrom },
                            { label: "Drop-off Date", value: dropDate },
                            { label: "Return Date", value: returnDate },
                            { label: "Guest Name", value: firstName && lastName ? `${firstName} ${lastName}` : undefined },
                            { label: "Email", value: email },
                        ]
                            .filter(({ value }) => !!value)
                            .map(({ label, value }) => (
                                <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "9px 0", borderBottom: "1px solid #f0f4f8", fontSize: "14px" }}>
                                    <span style={{ color: "#777" }}>{label}</span>
                                    <strong style={{ color: "#1a1a1a", textAlign: "right", maxWidth: "60%" }}>{value}</strong>
                                </div>
                            ))}

                        {totalPayable && (
                            <div style={{ display: "flex", justifyContent: "space-between", padding: "14px 0 0", fontSize: "15px" }}>
                                <span style={{ fontWeight: 700 }}>Total Paid</span>
                                <strong style={{ color: GCAP_GREEN, fontSize: "18px" }}>£{totalPayable}</strong>
                            </div>
                        )}
                    </div>
                </div>

                {/* Info box */}
                <div style={{ background: "#fffbeb", border: "1px solid #f59e0b", borderRadius: "12px", padding: "16px 20px", marginBottom: "28px", display: "flex", gap: "12px", alignItems: "flex-start" }}>
                    <i className="fa-solid fa-envelope" style={{ color: "#f59e0b", fontSize: "18px", marginTop: "2px", flexShrink: 0 }}></i>
                    <p style={{ margin: 0, fontSize: "13px", color: "#92400e", lineHeight: 1.6 }}>
                        A confirmation email has been sent to <strong>{email || "your email address"}</strong> with your booking reference and full details. Please keep this for your records.
                    </p>
                </div>

                {/* Actions */}
                <div className="d-flex gap-3 flex-wrap justify-content-center">
                    <Link to="/" style={{ textDecoration: "none" }}>
                        <button className="bk-search-button" style={{ padding: "12px 28px", borderRadius: "10px", fontWeight: 700, border: "none", cursor: "pointer", fontSize: "14px" }}>
                            <i className="fa-solid fa-house me-2"></i>Back to Home
                        </button>
                    </Link>
                    <Link to="/pricing-quotes" style={{ textDecoration: "none" }}>
                        <button style={{ padding: "12px 28px", borderRadius: "10px", fontWeight: 700, border: `2px solid ${GCAP_GREEN}`, background: "#fff", color: GCAP_GREEN, cursor: "pointer", fontSize: "14px" }}>
                            <i className="fa-solid fa-car me-2"></i>Book Another
                        </button>
                    </Link>
                </div>

            </div>
        </section>
    );
};

export default BookingConfirmation;
