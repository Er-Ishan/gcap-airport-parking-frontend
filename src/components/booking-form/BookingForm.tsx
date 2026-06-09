import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { BookingLocationState, Terminal } from "../../utils/parkingSearch";
import {
    fetchBookingFees,
    fetchProductById,
    fetchTerminalsByProduct,
    createBooking,
} from "../../services/parkingApi";

const BookingForm: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const bookingData = (location.state || {}) as BookingLocationState;

    const {
        productId,
        dropDate,
        returnDate,
        travelling_from,
        basePrice,
        discountAmount = 0,
        finalPrice,
    } = bookingData;

    const [product, setProduct] = useState<Record<string, unknown> | null>(null);
    const [price, setPrice] = useState<number | null>(null);
    const [showTravel, setShowTravel] = useState(true);
    const [showVehicle, setShowVehicle] = useState(true);
    const [departTerminals, setDepartTerminals] = useState<Terminal[]>([]);
    const [loading, setLoading] = useState(false);
    const [bookingFee, setBookingFee] = useState(0);
    const [formError, setFormError] = useState("");

    const [formData, setFormData] = useState({
        title: "",
        first_name: "",
        last_name: "",
        email: "",
        mobile: "",
        depart_terminal: "",
        depart_flight: "",
        return_terminal: "",
        return_flight: "",
        vehicle_make: "",
        vehicle_model: "",
        vehicle_colour: "",
        vehicle_registration: "",
        passengers: "1",
        terms_accepted: false,
    });

    useEffect(() => {
        if (!productId) navigate("/pricing-quotes", { replace: true });
    }, [productId, navigate]);

    useEffect(() => {
        fetchBookingFees().then(setBookingFee);
    }, []);

    useEffect(() => {
        if (!productId) return;
        fetchProductById(productId).then(setProduct);
        fetchTerminalsByProduct(productId).then((data) => {
            if (Array.isArray(data)) setDepartTerminals(data);
        });
    }, [productId]);

    useEffect(() => {
        setPrice(finalPrice !== undefined ? Number(finalPrice) : Number(basePrice ?? 0));
    }, [finalPrice, basePrice]);

    const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, type, value } = e.target;
        const checked = type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;
        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const addonsTotal = 0;

    const getDaysDiff = () => {
        const d1 = new Date(dropDate);
        const d2 = new Date(returnDate);
        return Math.ceil((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    };

    const totalPayable = (Number(price || 0) + Number(bookingFee || 0) + addonsTotal).toFixed(2);

    const handleSubmit = async () => {
        setFormError("");

        if (!formData.first_name || !formData.last_name || !formData.email || !formData.mobile) {
            setFormError("Please fill all required fields.");
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            setFormError("Please enter a valid email address.");
            return;
        }
        if (!formData.terms_accepted) {
            setFormError("Please accept Terms & Conditions.");
            return;
        }

        setLoading(true);

        const payload = {
            ...formData,
            product_name: product?.product_name,
            product_flexibility: product?.nonflex,
            travelling_from,
            service_provider: product?.service_provider,
            service: product?.service_type,
            addons_total: addonsTotal,
            drop_off_date: dropDate,
            return_date: returnDate,
            no_of_days: getDaysDiff(),
            quote_amount: price,
            discount: discountAmount || 0,
            booking_fee: bookingFee,
            total_payable: totalPayable,
            status: "Pending",
            source: "Website",
            website_name: "GCAP Airport Parking",
        };

        const data = await createBooking(payload);
        setLoading(false);

        if (data.success) {
            navigate("/payment", {
                state: { bookingId: data.booking_id, ...payload },
            });
        } else {
            setFormError(data.message || "Failed to save booking.");
        }
    };

    if (!productId) return null;

    return (
        <section className="bk-page">

            {/* Banner */}
            <div className="bk-banner">
                <div className="container text-center">
                    <h2 className="bk-banner-title">
                        Book&nbsp;<span style={{ opacity: 0.9 }}>{String(product?.product_name || "Parking")}</span>
                    </h2>
                    <p className="bk-banner-text">
                        All booking details will be sent to your email. Fields marked <strong>*</strong> are required.
                    </p>
                </div>
            </div>

            <div className="container">
                <div className="row g-4">

                    {/* ── Left: Form ── */}
                    <div className="col-lg-8">
                        <div className="bk-form-card">

                            {formError && (
                                <div className="alert alert-warning d-flex align-items-center gap-2 mb-4" style={{ borderRadius: "10px" }}>
                                    <i className="fa-solid fa-triangle-exclamation"></i>
                                    {formError}
                                </div>
                            )}

                            {/* Personal Info */}
                            <SectionHeading icon="fa-regular fa-user" label="Personal Information" />
                            <div className="row g-3 mb-4">
                                <div className="col-md-2">
                                    <FormLabel>Title *</FormLabel>
                                    <select name="title" className="form-select" onChange={handleInput} required>
                                        <option value="">Select</option>
                                        {["Mr.", "Mrs.", "Miss", "Ms.", "Dr."].map((t) => <option key={t}>{t}</option>)}
                                    </select>
                                </div>
                                <div className="col-md-5">
                                    <FormLabel>First Name *</FormLabel>
                                    <input name="first_name" className="form-control" onChange={handleInput} required placeholder="John" />
                                </div>
                                <div className="col-md-5">
                                    <FormLabel>Last Name *</FormLabel>
                                    <input name="last_name" className="form-control" onChange={handleInput} required placeholder="Smith" />
                                </div>
                                <div className="col-md-6">
                                    <FormLabel>Email *</FormLabel>
                                    <input name="email" type="email" autoComplete="email" className="form-control bk-input-tall" onChange={handleInput} required placeholder="john@example.com" />
                                </div>
                                <div className="col-md-6">
                                    <FormLabel>Mobile *</FormLabel>
                                    <input name="mobile" className="form-control bk-input-tall" onChange={handleInput} required placeholder="+44 7700 000000" />
                                </div>
                            </div>

                            {/* Travel Details */}
                            <SectionHeading icon="fa-solid fa-plane" label="Travel Details" />
                            <p className="bk-helper-text">Do you have your travel details?</p>
                            <RadioToggle value={showTravel} onChange={setShowTravel} />

                            {showTravel && (
                                <div className="row g-3 mb-4">
                                    <div className="col-md-6">
                                        <FormLabel>Depart Terminal</FormLabel>
                                        <select name="depart_terminal" className="form-select" onChange={handleInput}>
                                            <option value="">Select</option>
                                            <option value="Main Terminal">Main Terminal</option>
                                            {departTerminals.map((t) => <option key={t.terminal_id} value={t.terminal_name}>{t.terminal_name}</option>)}
                                        </select>
                                    </div>
                                    <div className="col-md-6">
                                        <FormLabel>Depart Flight</FormLabel>
                                        <input name="depart_flight" className="form-control" onChange={handleInput} placeholder="e.g. BA0123" />
                                    </div>
                                    <div className="col-md-6">
                                        <FormLabel>Return Terminal</FormLabel>
                                        <select name="return_terminal" className="form-select" onChange={handleInput}>
                                            <option value="">Select</option>
                                            <option value="Main Terminal">Main Terminal</option>
                                            {departTerminals.map((t) => <option key={t.terminal_id} value={t.terminal_name}>{t.terminal_name}</option>)}
                                        </select>
                                    </div>
                                    <div className="col-md-6">
                                        <FormLabel>Return Flight</FormLabel>
                                        <input name="return_flight" className="form-control" onChange={handleInput} placeholder="e.g. BA0124" />
                                    </div>
                                </div>
                            )}

                            {/* Vehicle Details */}
                            <SectionHeading icon="fa-solid fa-car" label="Vehicle Details" />
                            <p className="bk-helper-text">Do you have your vehicle details?</p>
                            <RadioToggle value={showVehicle} onChange={setShowVehicle} />

                            {showVehicle && (
                                <div className="row g-3 mb-4">
                                    {[
                                        { name: "vehicle_make", label: "Make", ph: "Ford" },
                                        { name: "vehicle_model", label: "Model", ph: "Focus" },
                                        { name: "vehicle_colour", label: "Colour", ph: "Blue" },
                                        { name: "vehicle_registration", label: "Registration *", ph: "AB12 CDE" },
                                    ].map(({ name, label, ph }) => (
                                        <div key={name} className="col-md-3">
                                            <FormLabel>{label}</FormLabel>
                                            <input
                                                name={name}
                                                className={`form-control${name === "vehicle_registration" ? " bk-registration-input" : ""}`}
                                                onChange={handleInput}
                                                placeholder={ph}
                                            />
                                        </div>
                                    ))}
                                    <div className="col-md-3">
                                        <FormLabel>Passengers</FormLabel>
                                        <select name="passengers" className="form-select" onChange={handleInput}>
                                            {["1", "2", "3", "4", "5"].map((n) => <option key={n}>{n}</option>)}
                                        </select>
                                    </div>
                                </div>
                            )}

                            {/* Terms */}
                            <div className="bk-terms-box">
                                <input
                                    name="terms_accepted"
                                    type="checkbox"
                                    id="terms_accepted"
                                    className="bk-terms-checkbox"
                                    onChange={handleInput}
                                    required
                                />
                                <label htmlFor="terms_accepted" className="bk-terms-label">
                                    I agree to the <a href="#">Terms &amp; Conditions</a> and <a href="#">Privacy Policy</a> *
                                </label>
                            </div>

                            {/* Submit */}
                            <button
                                type="button"
                                className="bk-submit-btn"
                                onClick={handleSubmit}
                                disabled={loading}
                            >
                                {loading
                                    ? <><i className="fa-solid fa-spinner fa-spin"></i> Processing…</>
                                    : <><i className="fa-solid fa-lock"></i> Book Your Parking Securely</>
                                }
                            </button>
                        </div>
                    </div>

                    {/* ── Right: Order Summary ── */}
                    <div className="col-lg-4">
                        <div className="bk-summary-card">
                            <div className="bk-summary-header">
                                <h5>{String(product?.product_name || "Parking")}</h5>
                            </div>

                            <div className="bk-summary-body">
                                {[
                                    { label: "Travelling From", value: travelling_from },
                                    { label: "Service", value: String(product?.service_type || "N/A") },
                                    { label: "Booking Type", value: String(product?.nonflex || "N/A") },
                                    { label: "Drop-off", value: dropDate },
                                    { label: "Return", value: returnDate },
                                ].map(({ label, value }) => (
                                    <div key={label} className="bk-summary-row">
                                        <span className="bk-summary-label">{label}</span>
                                        <strong className="bk-summary-value">{value}</strong>
                                    </div>
                                ))}

                                <div className="bk-summary-row">
                                    <span className="bk-summary-label">Quote</span>
                                    <strong>£{Number(basePrice || 0).toFixed(2)}</strong>
                                </div>

                                {discountAmount > 0 && (
                                    <div className="bk-summary-row">
                                        <span className="bk-summary-discount">Discount</span>
                                        <strong className="bk-summary-discount">-£{discountAmount.toFixed(2)}</strong>
                                    </div>
                                )}

                                <div className="bk-summary-row">
                                    <span className="bk-summary-label">Booking Fee</span>
                                    <strong>£{bookingFee.toFixed(2)}</strong>
                                </div>

                                {addonsTotal > 0 && (
                                    <div className="bk-summary-row">
                                        <span className="bk-summary-label">Add-ons</span>
                                        <strong>£{addonsTotal.toFixed(2)}</strong>
                                    </div>
                                )}

                                <div className="bk-summary-total-box">
                                    <span className="bk-summary-total-label">Total Payable</span>
                                    <span className="bk-summary-total-amount">£{totalPayable}</span>
                                </div>

                                <p className="bk-secure-note">
                                    <i className="fa-solid fa-shield-halved me-1"></i>
                                    Secure SSL encrypted payment
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

/* ── Small helper components ── */

const SectionHeading = ({ icon, label }: { icon: string; label: string }) => (
    <h4 className="bk-section-heading">
        <i className={icon}></i>
        {label}
    </h4>
);

const FormLabel = ({ children }: { children: React.ReactNode }) => (
    <label className="form-label fw-semibold bk-form-label">{children}</label>
);

const RadioToggle = ({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) => (
    <div className="d-flex gap-4 mb-3">
        {([true, false] as const).map((v) => (
            <label key={String(v)} className={`bk-radio-label${value === v ? " bk-radio-label--active" : ""}`}>
                <input type="radio" checked={value === v} onChange={() => onChange(v)} />
                {v ? "Yes" : "No"}
            </label>
        ))}
    </div>
);

export default BookingForm;
