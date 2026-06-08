import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { BookingLocationState, Terminal } from "../../utils/parkingSearch";
import {
    fetchBookingFees,
    fetchProductById,
    fetchTerminalsByProduct,
    createBooking,
} from "../../services/parkingApi";

const GCAP_GREEN = "#3cbc84";

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
        const target = e.target;
        setFormData({
            ...formData,
            [target.name]:
                target.type === "checkbox" ? (target as HTMLInputElement).checked : target.value,
        });
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
        <section style={{ paddingTop: "60px", paddingBottom: "160px", background: "#f7f9fc" }}>

            {/* Banner */}
            <div style={{ background: `linear-gradient(135deg, ${GCAP_GREEN} 0%, #2aa870 100%)`, padding: "36px 0 32px", marginBottom: "40px" }}>
                <div className="container text-center">
                    <div style={{ display: "inline-flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                        <h2 style={{ color: "#fff", fontSize: "26px", fontWeight: 800, margin: 0 }}>
                            Book&nbsp;<span style={{ opacity: 0.9 }}>{String(product?.product_name || "Parking")}</span>
                        </h2>
                    </div>
                    <p style={{ color: "rgba(255,255,255,0.85)", margin: 0, fontSize: "14px" }}>
                        All booking details will be sent to your email. Fields marked <strong>*</strong> are required.
                    </p>
                </div>
            </div>

            <div className="container">
                <div className="row g-4">

                    {/* ── Left: Form ── */}
                    <div className="col-lg-8">
                        <div style={{ background: "#fff", borderRadius: "16px", border: "1px solid #e8ecf0", padding: "32px", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>

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
                                    <input name="email" type="email" className="form-control" onChange={handleInput} required placeholder="john@example.com" style={{ height: "48px" }} />
                                </div>
                                <div className="col-md-6">
                                    <FormLabel>Mobile *</FormLabel>
                                    <input name="mobile" className="form-control" onChange={handleInput} required placeholder="+44 7700 000000" style={{ height: "48px" }} />
                                </div>
                            </div>

                            {/* Travel Details */}
                            <SectionHeading icon="fa-solid fa-plane" label="Travel Details" />
                            <p style={{ fontSize: "13px", color: "#666", marginBottom: "12px" }}>Do you have your travel details?</p>
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
                            <p style={{ fontSize: "13px", color: "#666", marginBottom: "12px" }}>Do you have your vehicle details?</p>
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
                                            <input name={name} className="form-control" onChange={handleInput} placeholder={ph}
                                                style={name === "vehicle_registration" ? { textTransform: "uppercase" } : {}} />
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
                            <div style={{ background: "#fafafa", border: "1px solid #e8ecf0", borderRadius: "10px", padding: "14px 18px", marginBottom: "24px", display: "flex", alignItems: "center", gap: "12px" }}>
                                <input name="terms_accepted" type="checkbox" id="terms_accepted" onChange={handleInput} required
                                    style={{ accentColor: GCAP_GREEN, width: "16px", height: "16px", flexShrink: 0 }} />
                                <label htmlFor="terms_accepted" style={{ cursor: "pointer", margin: 0, fontSize: "13px", color: "#444" }}>
                                    I agree to the <a href="#" style={{ color: GCAP_GREEN }}>Terms &amp; Conditions</a> and <a href="#" style={{ color: GCAP_GREEN }}>Privacy Policy</a> *
                                </label>
                            </div>

                            {/* Submit */}
                            <button type="button" className="w-100" onClick={handleSubmit} disabled={loading}
                                style={{ padding: "14px", fontSize: "16px", fontWeight: 700, borderRadius: "10px", border: "none", cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", opacity: loading ? 0.75 : 1, background: "#3cbc84", color: "#fff" }}>
                                {loading
                                    ? <><i className="fa-solid fa-spinner fa-spin"></i> Processing…</>
                                    : <><i className="fa-solid fa-lock"></i> Book Your Parking Securely</>
                                }
                            </button>
                        </div>
                    </div>

                    {/* ── Right: Order Summary ── */}
                    <div className="col-lg-4">
                        <div style={{ position: "sticky", top: "100px", background: "#fff", borderRadius: "16px", border: `2px solid ${GCAP_GREEN}`, overflow: "hidden", boxShadow: "0 4px 20px rgba(60,188,132,0.12)" }}>
                            <div style={{ background: `linear-gradient(135deg, ${GCAP_GREEN} 0%, #2aa870 100%)`, padding: "18px 20px", textAlign: "center" }}>
                                <h5 style={{ color: "#fff", margin: 0, fontSize: "18px", fontWeight: 700 }}>
                                    {String(product?.product_name || "Parking")}
                                </h5>
                            </div>

                            <div style={{ padding: "20px" }}>
                                {[
                                    { label: "Travelling From", value: travelling_from },
                                    { label: "Service", value: String(product?.service_type || "N/A") },
                                    { label: "Booking Type", value: String(product?.nonflex || "N/A") },
                                    { label: "Drop-off", value: dropDate },
                                    { label: "Return", value: returnDate },
                                ].map(({ label, value }) => (
                                    <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: "1px solid #f0f4f8", fontSize: "13px" }}>
                                        <span style={{ color: "#777" }}>{label}</span>
                                        <strong style={{ color: "#1a1a1a", textAlign: "right", maxWidth: "55%" }}>{value}</strong>
                                    </div>
                                ))}

                                <div style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: "1px solid #f0f4f8", fontSize: "13px" }}>
                                    <span style={{ color: "#777" }}>Quote</span>
                                    <strong>£{Number(basePrice || 0).toFixed(2)}</strong>
                                </div>
                                {discountAmount > 0 && (
                                    <div style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: "1px solid #f0f4f8", fontSize: "13px" }}>
                                        <span style={{ color: GCAP_GREEN }}>Discount</span>
                                        <strong style={{ color: GCAP_GREEN }}>-£{discountAmount.toFixed(2)}</strong>
                                    </div>
                                )}
                                <div style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: "1px solid #f0f4f8", fontSize: "13px" }}>
                                    <span style={{ color: "#777" }}>Booking Fee</span>
                                    <strong>£{bookingFee.toFixed(2)}</strong>
                                </div>
                                {addonsTotal > 0 && (
                                    <div style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: "1px solid #f0f4f8", fontSize: "13px" }}>
                                        <span style={{ color: "#777" }}>Add-ons</span>
                                        <strong>£{addonsTotal.toFixed(2)}</strong>
                                    </div>
                                )}

                                <div style={{ marginTop: "16px", background: `linear-gradient(135deg, ${GCAP_GREEN} 0%, #2aa870 100%)`, borderRadius: "10px", padding: "14px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <span style={{ color: "#fff", fontWeight: 600, fontSize: "14px" }}>Total Payable</span>
                                    <span style={{ color: "#fff", fontWeight: 800, fontSize: "22px" }}>£{totalPayable}</span>
                                </div>

                                <p style={{ fontSize: "11px", color: "#aaa", textAlign: "center", marginTop: "10px", marginBottom: 0 }}>
                                    <i className="fa-solid fa-shield-halved me-1" style={{ color: GCAP_GREEN }}></i>
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

/* ── small helpers to avoid repetition ── */
const GCAP_GREEN_H = "#3cbc84";

const SectionHeading = ({ icon, label }: { icon: string; label: string }) => (
    <h4 style={{ fontSize: "16px", fontWeight: 700, color: "#1a1a1a", marginBottom: "14px", paddingBottom: "12px", borderBottom: "2px solid #f0f4f8", display: "flex", alignItems: "center", gap: "8px" }}>
        <i className={icon} style={{ color: GCAP_GREEN_H }}></i>
        {label}
    </h4>
);

const FormLabel = ({ children }: { children: React.ReactNode }) => (
    <label className="form-label fw-semibold" style={{ fontSize: "13px" }}>{children}</label>
);

const RadioToggle = ({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) => (
    <div className="d-flex gap-4 mb-3">
        {([true, false] as const).map((v) => (
            <label key={String(v)} style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "14px", fontWeight: value === v ? 700 : 400, color: value === v ? GCAP_GREEN_H : "#555" }}>
                <input type="radio" style={{ accentColor: GCAP_GREEN_H }} checked={value === v} onChange={() => onChange(v)} />
                {v ? "Yes" : "No"}
            </label>
        ))}
    </div>
);

export default BookingForm;
