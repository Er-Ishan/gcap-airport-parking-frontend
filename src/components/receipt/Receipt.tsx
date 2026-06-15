import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { BookingReceiptData } from "../../utils/parkingSearch";
import {
    downloadPdfFromElement,
    formatBookingDate,
    scheduleReceiptSave,
} from "../../utils/bookingPdf";
import {
    fetchCompanyInfo,
    fetchCancellationCharge,
    sendReceiptEmail,
    type CompanyInfo,
} from "../../services/parkingApi";

const Receipt: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const receiptRef = useRef<HTMLDivElement>(null);

    const bookingData = location.state?.bookingData as BookingReceiptData | null;
    const addons = bookingData?.addons ?? {};
    const currentDate = formatBookingDate(new Date());

    const [company, setCompany] = useState<CompanyInfo | null>(null);
    const [cancellationPrice, setCancellationPrice] = useState<string>("0.00");
    const [emailStatus, setEmailStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
    const [emailMessage, setEmailMessage] = useState("");

    useEffect(() => {
        if (!bookingData) {
            navigate("/thank-you", { replace: true });
            return;
        }
        fetchCompanyInfo().then(setCompany);
        fetchCancellationCharge().then((charge) => {
            if (charge?.is_enabled && charge.price) {
                setCancellationPrice(Number(charge.price).toFixed(2));
            }
        });
    }, [bookingData, navigate]);

    useEffect(() => {
        return scheduleReceiptSave(bookingData, receiptRef);
    }, [bookingData]);

    if (!bookingData) return null;

    const companyName = company?.name ?? "GCAP Airport Parking";
    const supportEmail = company?.support_email_address ?? "support@gcapairportparking.co.uk";
    const refPrefix = company?.ref_prefix ?? "GCAP";

    const handleDownload = () => {
        if (receiptRef.current) {
            downloadPdfFromElement(
                receiptRef.current,
                `receipt_${bookingData.booking_id}.pdf`
            );
        }
    };

    const handleEmailReceipt = async () => {
        setEmailStatus("sending");
        setEmailMessage("");
        const result = await sendReceiptEmail(Number(bookingData.booking_id));
        setEmailStatus(result.ok ? "success" : "error");
        setEmailMessage(result.message);
    };

    const ref = String(bookingData.booking_id).padStart(8, "0");

    return (
        <section className="bk-receipt-section">

            {/* ── Printable receipt document ── */}
            <div ref={receiptRef} className="bk-receipt-wrapper container">

                {/* Header row: logo + receipt ID box */}
                <div className="bk-receipt-top">
                    <div className="bk-receipt-logo-col">
                        <img src="/assets/img/logo/logo-green.png" alt={companyName} />
                        <p>
                            {companyName}<br />
                            {supportEmail}
                        </p>
                    </div>

                    <div className="bk-receipt-id-box">
                        <div className="bk-receipt-id-bar">
                            Receipt #{refPrefix}-{ref}
                        </div>
                        <div className="bk-receipt-id-body">
                            <p>
                                <strong>Transaction Date:</strong><br />
                                {currentDate}
                            </p>
                            {bookingData.transaction_id && (
                                <p>
                                    <strong>Transaction ID:</strong><br />
                                    <code>{bookingData.transaction_id}</code>
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Bill To */}
                <div style={{ marginBottom: "28px" }}>
                    <h3 className="bk-receipt-section-title">Bill To</h3>
                    <p className="bk-receipt-bill-text">
                        <strong>{bookingData.first_name} {bookingData.last_name}</strong><br />
                        {bookingData.email}<br />
                        {bookingData.mobile}<br />
                        {bookingData.vehicle_make && `${bookingData.vehicle_make} `}
                        {bookingData.vehicle_registration || ""}
                    </p>
                </div>

                {/* Price breakdown */}
                <div style={{ marginBottom: "28px" }}>
                    <h3 className="bk-receipt-section-title">Payment Summary</h3>
                    <table className="bk-receipt-price-table">
                        <tbody>
                            <tr>
                                <td>Subtotal</td>
                                <td>£{Number(bookingData.quote_amount ?? 0).toFixed(2)}</td>
                            </tr>
                            {Number(bookingData.discount) > 0 && (
                                <tr className="bk-discount">
                                    <td>Discount</td>
                                    <td>−£{Number(bookingData.discount).toFixed(2)}</td>
                                </tr>
                            )}
                            {Number(bookingData.booking_fee) > 0 && (
                                <tr>
                                    <td>Booking Fee</td>
                                    <td>£{Number(bookingData.booking_fee).toFixed(2)}</td>
                                </tr>
                            )}
                            {addons.cancellation_cover && (
                                <tr>
                                    <td>Cancellation Cover</td>
                                    <td>£{cancellationPrice}</td>
                                </tr>
                            )}
                            <tr className="bk-total-row">
                                <td>Total Paid</td>
                                <td>£{Number(bookingData.total_payable ?? 0).toFixed(2)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Booking details table */}
                <div>
                    <h3 className="bk-receipt-section-title">Booking Details</h3>
                    <table className="bk-receipt-main-table">
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Airport</th>
                                <th>Drop-off</th>
                                <th>Return</th>
                                <th>Days</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{bookingData.product_name}</td>
                                <td>{bookingData.travelling_from}</td>
                                <td>{formatBookingDate(bookingData.drop_off_date)}</td>
                                <td>{formatBookingDate(bookingData.return_date)}</td>
                                <td style={{ textAlign: "center" }}>{bookingData.no_of_days}</td>
                                <td style={{ fontWeight: 700 }}>£{Number(bookingData.total_payable ?? 0).toFixed(2)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <p className="bk-receipt-thank-you">
                    Thank you for choosing {companyName}. We look forward to seeing you!
                </p>
            </div>

            {/* ── Action buttons (not printed) ── */}
            <div className="bk-receipt-actions no-print">
                <button
                    type="button"
                    className="tg-btn tg-btn-hover"
                    onClick={handleDownload}
                >
                    <i className="fa-solid fa-download me-2"></i>
                    Download Receipt (PDF)
                </button>
                <button
                    type="button"
                    className="tg-btn"
                    disabled={emailStatus === "sending" || emailStatus === "success"}
                    onClick={handleEmailReceipt}
                    style={{ background: "var(--tg-theme-secondary)", color: "#fff", border: "none", cursor: emailStatus === "sending" ? "wait" : "pointer", opacity: emailStatus === "success" ? 0.75 : 1 }}
                >
                    {emailStatus === "sending" ? (
                        <><i className="fa-solid fa-spinner fa-spin me-2"></i>Sending…</>
                    ) : emailStatus === "success" ? (
                        <><i className="fa-solid fa-check me-2"></i>Receipt Sent</>
                    ) : (
                        <><i className="fa-solid fa-envelope me-2"></i>Email Receipt</>
                    )}
                </button>
            </div>
            {emailMessage && (
                <p className={`no-print text-center mt-2 ${emailStatus === "success" ? "text-success" : "text-danger"}`} style={{ fontSize: "13px" }}>
                    {emailMessage}
                </p>
            )}

        </section>
    );
};

export default Receipt;
