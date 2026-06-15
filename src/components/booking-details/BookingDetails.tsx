import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { BookingReceiptData } from "../../utils/parkingSearch";
import {
    downloadPdfFromElement,
    formatBookingDate,
    scheduleReceiptSave,
} from "../../utils/bookingPdf";
import { fetchCompanyInfo, sendReceiptEmail, type CompanyInfo } from "../../services/parkingApi";

const BookingDetails: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const detailsRef = useRef<HTMLDivElement>(null);

    const bookingData = location.state?.bookingData as BookingReceiptData | null;
    const currentDate = formatBookingDate(new Date());

    const [company, setCompany] = useState<CompanyInfo | null>(null);
    const [emailStatus, setEmailStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
    const [emailMessage, setEmailMessage] = useState("");

    useEffect(() => {
        if (!bookingData) {
            navigate("/thank-you", { replace: true });
            return;
        }
        fetchCompanyInfo().then(setCompany);
    }, [bookingData, navigate]);

    useEffect(() => {
        return scheduleReceiptSave(bookingData, detailsRef);
    }, [bookingData]);

    if (!bookingData) return null;

    const companyName = company?.name ?? "GCAP Airport Parking";
    const refPrefix = company?.ref_prefix ?? "GCAP";

    const handleDownload = () => {
        if (detailsRef.current) {
            downloadPdfFromElement(
                detailsRef.current,
                `booking_details_${bookingData.booking_id}.pdf`
            );
        }
    };

    const handleEmailBookingDetails = async () => {
        setEmailStatus("sending");
        setEmailMessage("");
        const result = await sendReceiptEmail(Number(bookingData.booking_id));
        setEmailStatus(result.ok ? "success" : "error");
        setEmailMessage(result.message);
    };

    const ref = String(bookingData.booking_id).padStart(8, "0");

    return (
        <section className="bk-receipt-section">

            {/* ── Printable booking document ── */}
            <div ref={detailsRef} className="bk-details-wrapper container">

                {/* Header */}
                <div className="bk-details-header">
                    <div className="bk-details-logo">
                        <img src="/assets/img/logo/logo-green.png" alt={companyName} />
                        <p>{companyName}</p>
                    </div>
                    <div className="bk-details-ref">
                        <h3>BOOKING DETAILS</h3>
                        <p>Date: {currentDate}</p>
                        <p>Ref: {refPrefix}-{ref}</p>
                    </div>
                </div>

                {/* Customer Details */}
                <div className="bk-details-table-wrapper">
                    <table className="bk-details-table">
                        <tbody>
                            <tr className="bk-details-section-row">
                                <td colSpan={5}>Customer Details</td>
                            </tr>
                            <tr>
                                <th>Title</th>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Email</th>
                                <th>Mobile</th>
                            </tr>
                            <tr>
                                <td>{bookingData.title || "—"}</td>
                                <td>{bookingData.first_name}</td>
                                <td>{bookingData.last_name}</td>
                                <td>{bookingData.email}</td>
                                <td>{bookingData.mobile}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Vehicle Details */}
                <div className="bk-details-table-wrapper">
                    <table className="bk-details-table">
                        <tbody>
                            <tr className="bk-details-section-row">
                                <td colSpan={5}>Vehicle Details</td>
                            </tr>
                            <tr>
                                <th>Registration</th>
                                <th>Make</th>
                                <th>Model</th>
                                <th>Colour</th>
                                <th>Passengers</th>
                            </tr>
                            <tr>
                                <td>{bookingData.vehicle_registration || "—"}</td>
                                <td>{bookingData.vehicle_make || "—"}</td>
                                <td>{bookingData.vehicle_model || "—"}</td>
                                <td>{bookingData.vehicle_colour || "—"}</td>
                                <td>{bookingData.vehicle_no || "—"}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Flight Details */}
                <div className="bk-details-table-wrapper">
                    <table className="bk-details-table">
                        <tbody>
                            <tr className="bk-details-section-row">
                                <td colSpan={2}>Flight Details</td>
                            </tr>
                            <tr>
                                <td>Depart Flight</td>
                                <td style={{ textAlign: "right" }}>{bookingData.depart_flight || "—"}</td>
                            </tr>
                            <tr>
                                <td>Depart Terminal</td>
                                <td style={{ textAlign: "right" }}>{bookingData.depart_terminal || "—"}</td>
                            </tr>
                            <tr>
                                <td>Return Flight</td>
                                <td style={{ textAlign: "right" }}>{bookingData.return_flight || "—"}</td>
                            </tr>
                            <tr>
                                <td>Return Terminal</td>
                                <td style={{ textAlign: "right" }}>{bookingData.return_terminal || "—"}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Booking & Payment Details */}
                <div className="bk-details-table-wrapper">
                    <table className="bk-details-table">
                        <tbody>
                            <tr className="bk-details-section-row">
                                <td colSpan={2}>Booking &amp; Payment Details</td>
                            </tr>
                            <tr>
                                <td>Travelling From</td>
                                <td style={{ textAlign: "right" }}>{bookingData.travelling_from}</td>
                            </tr>
                            <tr>
                                <td>Service</td>
                                <td style={{ textAlign: "right" }}>{bookingData.service || "—"}</td>
                            </tr>
                            <tr>
                                <td>Product</td>
                                <td style={{ textAlign: "right" }}>{bookingData.product_name}</td>
                            </tr>
                            <tr>
                                <td>Drop-off Date</td>
                                <td style={{ textAlign: "right" }}>{formatBookingDate(bookingData.drop_off_date)}</td>
                            </tr>
                            <tr>
                                <td>Return Date</td>
                                <td style={{ textAlign: "right" }}>{formatBookingDate(bookingData.return_date)}</td>
                            </tr>
                            <tr>
                                <td>Duration</td>
                                <td style={{ textAlign: "right" }}>{bookingData.no_of_days} day{bookingData.no_of_days !== 1 ? "s" : ""}</td>
                            </tr>
                            {Number(bookingData.discount) > 0 && (
                                <tr style={{ color: "#16a34a" }}>
                                    <td>Discount</td>
                                    <td style={{ textAlign: "right" }}>−£{Number(bookingData.discount).toFixed(2)}</td>
                                </tr>
                            )}
                            {Number(bookingData.booking_fee) > 0 && (
                                <tr>
                                    <td>Booking Fee</td>
                                    <td style={{ textAlign: "right" }}>£{Number(bookingData.booking_fee).toFixed(2)}</td>
                                </tr>
                            )}
                            <tr>
                                <td className="bk-total-cell">Total Paid</td>
                                <td style={{ textAlign: "right" }} className="bk-total-cell">
                                    £{Number(bookingData.total_payable ?? 0).toFixed(2)}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <p className="bk-details-footer-note">
                    Thank you for booking with {companyName}. Please keep this document for your records.
                </p>
            </div>

            {/* ── Action buttons (not printed) ── */}
            <div className="bk-details-actions no-print">
                <button
                    type="button"
                    className="tg-btn tg-btn-hover"
                    onClick={handleDownload}
                >
                    <i className="fa-solid fa-download me-2"></i>
                    Download Booking PDF
                </button>
                <button
                    type="button"
                    className="tg-btn"
                    disabled={emailStatus === "sending" || emailStatus === "success"}
                    onClick={handleEmailBookingDetails}
                    style={{ background: "var(--tg-theme-secondary)", color: "#fff", border: "none", cursor: emailStatus === "sending" ? "wait" : "pointer", opacity: emailStatus === "success" ? 0.75 : 1 }}
                >
                    {emailStatus === "sending" ? (
                        <><i className="fa-solid fa-spinner fa-spin me-2"></i>Sending…</>
                    ) : emailStatus === "success" ? (
                        <><i className="fa-solid fa-check me-2"></i>Details Sent</>
                    ) : (
                        <><i className="fa-solid fa-envelope me-2"></i>Email Booking Details</>
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

export default BookingDetails;
