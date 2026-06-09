import React from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";

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
            <section className="bk-no-booking">
                <div className="text-center">
                    <i className="fa-solid fa-triangle-exclamation"></i>
                    <h3 style={{ marginBottom: "12px" }}>No booking found</h3>
                    <p>It looks like you navigated here directly.</p>
                    <button className="tg-btn tg-btn-hover" onClick={() => navigate("/")}>Back to Home</button>
                </div>
            </section>
        );
    }

    const ref = String(bookingId).padStart(8, "0");

    return (
        <section className="bk-confirm-page">
            <div className="container bk-confirm-container">

                {/* Success banner */}
                <div className="bk-success-banner">
                    <div className="bk-success-icon-wrap">
                        <i className="fa-solid fa-check"></i>
                    </div>
                    <h1 className="bk-success-title">Booking Confirmed!</h1>
                    <p className="bk-success-text">
                        {firstName ? `Thank you, ${firstName}! ` : ""}Your parking has been reserved successfully.
                    </p>
                    <div className="bk-ref-badge">
                        <span className="bk-ref-label">Booking Reference</span>
                        <span className="bk-ref-code">GCAP-{ref}</span>
                    </div>
                </div>

                {/* Details card */}
                <div className="bk-detail-card">
                    <div className="bk-detail-card-header">
                        <i className="fa-solid fa-receipt"></i>
                        <h5>Booking Summary</h5>
                    </div>
                    <div className="bk-detail-card-body">
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
                                <div key={label} className="bk-detail-row">
                                    <span className="bk-detail-label">{label}</span>
                                    <strong className="bk-detail-value">{value}</strong>
                                </div>
                            ))}

                        {totalPayable && (
                            <div className="bk-detail-total">
                                <span style={{ fontWeight: 700 }}>Total Paid</span>
                                <strong>£{totalPayable}</strong>
                            </div>
                        )}
                    </div>
                </div>

                {/* Info box */}
                <div className="bk-info-box">
                    <i className="fa-solid fa-envelope"></i>
                    <p>
                        A confirmation email has been sent to <strong>{email || "your email address"}</strong> with your booking reference and full details. Please keep this for your records.
                    </p>
                </div>

                {/* Actions */}
                <div className="d-flex gap-3 flex-wrap justify-content-center">
                    <Link
                        to="/receipt"
                        state={{ bookingData: { ...state, bookingData: undefined } }}
                        className="bk-action-btn-outline"
                    >
                        <i className="fa-solid fa-receipt me-2"></i>View Receipt
                    </Link>
                    <Link
                        to="/booking-details"
                        state={{ bookingData: { ...state, bookingData: undefined } }}
                        className="bk-action-btn-outline"
                    >
                        <i className="fa-solid fa-file-lines me-2"></i>Booking Details
                    </Link>
                    <Link to="/" className="tg-btn tg-btn-hover" style={{ textDecoration: "none" }}>
                        <i className="fa-solid fa-house me-2"></i>Back to Home
                    </Link>
                </div>

            </div>
        </section>
    );
};

export default BookingConfirmation;
