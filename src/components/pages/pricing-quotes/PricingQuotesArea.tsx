import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import ParkingSearchEditForm from "../../parking/ParkingSearchEditForm";
import {
    formatDateDisplay,
    getStoredDateTime,
    splitDateTime,
    type ParkingProduct,
    type PromoData,
    type BookingLocationState,
} from "../../../utils/parkingSearch";
import {
    applyPromoDiscount,
    fetchAirports,
    searchParkingDeals,
    type AirportOption,
} from "../../../services/parkingApi";

const GCAP_GREEN = "#67a71e";

const DEFAULT_DROP = (() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return `${d.toISOString().split("T")[0]} 10:00`;
})();

const DEFAULT_RETURN = (() => {
    const d = new Date();
    d.setDate(d.getDate() + 9);
    return `${d.toISOString().split("T")[0]} 10:00`;
})();

const FALLBACK_IMAGE = "/assets/img/banner/thumb.jpg";

const PricingQuotesArea: React.FC = () => {
    const navigate = useNavigate();

    const [airports, setAirports] = useState<AirportOption[]>([]);
    const [showSearchForm, setShowSearchForm] = useState(false);
    const [airport, setAirport] = useState("Bristol");
    const [dropDateState, setDropDateState] = useState(DEFAULT_DROP);
    const [returnDateState, setReturnDateState] = useState(DEFAULT_RETURN);
    const [promoCode, setPromoCode] = useState("");
    const [promoData, setPromoData] = useState<PromoData | null>(null);
    const [promoError, setPromoError] = useState("");
    const [returnManuallySet, setReturnManuallySet] = useState(false);
    const [vehicleNo, setVehicleNo] = useState("1");

    const [products, setProducts] = useState<ParkingProduct[]>([]);
    const [pricing, setPricing] = useState<Record<number, number>>({});
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState("");

    const runSearch = useCallback(async (
        drop: string,
        ret: string,
        selectedAirport: string,
        promo: string
    ) => {
        setLoading(true);
        setLoadError("");
        const result = await searchParkingDeals(drop, ret, selectedAirport, promo);
        setProducts(result.products);
        setPricing(result.pricing);
        setPromoData(result.promoData);
        setPromoError(result.promoError);
        setLoadError(result.loadError);
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchAirports().then(setAirports);
    }, []);

    useEffect(() => {
        let cancelled = false;

        const drop = getStoredDateTime("dropDate", DEFAULT_DROP);
        const ret = getStoredDateTime("returnDate", DEFAULT_RETURN);
        const selectedAirport = localStorage.getItem("selectedAirport") || "Bristol";
        const storedPromo = localStorage.getItem("promoCode") || "";
        const storedVehicleNo = localStorage.getItem("vehicleNo") || "1";

        setDropDateState(drop);
        setReturnDateState(ret);
        setAirport(selectedAirport);
        setPromoCode(storedPromo);
        setVehicleNo(storedVehicleNo);

        (async () => {
            setLoading(true);
            setLoadError("");
            const result = await searchParkingDeals(drop, ret, selectedAirport, storedPromo);
            if (cancelled) return;
            setProducts(result.products);
            setPricing(result.pricing);
            setPromoData(result.promoData);
            setPromoError(result.promoError);
            setLoadError(result.loadError);
            setLoading(false);
        })();

        return () => { cancelled = true; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!dropDateState || !returnDateState) {
            setLoadError("Please select both drop-off and return dates.");
            return;
        }

        const dropParts = splitDateTime(dropDateState);
        const returnParts = splitDateTime(returnDateState);

        if (returnParts.date < dropParts.date) {
            setLoadError("Return date must be on or after drop-off date.");
            return;
        }

        localStorage.setItem("dropDate", dropDateState);
        localStorage.setItem("returnDate", returnDateState);
        localStorage.setItem("selectedAirport", airport);
        localStorage.setItem("vehicleNo", vehicleNo);
        promoCode.trim()
            ? localStorage.setItem("promoCode", promoCode.trim())
            : localStorage.removeItem("promoCode");

        setShowSearchForm(false);
        await runSearch(dropDateState, returnDateState, airport, promoCode.trim());
    };

    const getFinalPrice = (item: ParkingProduct): number => {
        const base = Number(pricing[item.id] || 0);
        if (!base) return Infinity;
        return applyPromoDiscount(base, promoData);
    };

    const sortedProducts = [...products].sort((a, b) => getFinalPrice(a) - getFinalPrice(b));

    const productFeatures = (item: ParkingProduct): string[] =>
        [item.point_1, item.point_2, item.point_3, item.point_4, item.point_5, item.point_6]
            .filter((p): p is string => Boolean(p));

    const handleBookNow = (item: ParkingProduct) => {
        const basePrice = Number(pricing[item.id] || 0);
        const finalPrice = applyPromoDiscount(basePrice, promoData);

        const state: BookingLocationState = {
            productId: item.id,
            dropDate: dropDateState,
            returnDate: returnDateState,
            travelling_from: airport,
            basePrice,
            discountAmount: basePrice - finalPrice,
            finalPrice: Math.max(0, finalPrice),
            promo: promoData,
            product_overview: item.product_overview,
            product_description: item.product_description,
            dropoff_procedure: item.dropoff_procedure,
            vehicleNo,
        };

        navigate("/booking-form", { state });
    };

    return (
        <section style={{ paddingTop: "60px", paddingBottom: "160px", background: "#f7f9fc" }}>

            {/* ── Page header ── */}
            <div className="container mb-30 text-center">
                <h5
                    className="tg-section-subtitle mb-15 wow fadeInUp"
                    data-wow-delay=".3s"
                    data-wow-duration=".9s"
                >
                    Live Parking Deals
                </h5>
                <h2
                    className="mb-10 wow fadeInUp"
                    data-wow-delay=".4s"
                    data-wow-duration=".9s"
                    style={{ fontSize: "36px", fontWeight: 800 }}
                >
                    <span style={{ color: GCAP_GREEN }}>{airport}</span> Airport Parking
                </h2>

                {dropDateState && returnDateState && (
                    <p style={{ fontSize: "15px", color: "#555", marginBottom: "14px" }}>
                        <i className="fa-regular fa-calendar" style={{ color: GCAP_GREEN, marginRight: "6px" }}></i>
                        <strong>{formatDateDisplay(dropDateState)}</strong>
                        {" "}{splitDateTime(dropDateState).time}
                        <span style={{ margin: "0 10px", color: "#ccc" }}>→</span>
                        <strong>{formatDateDisplay(returnDateState)}</strong>
                        {" "}{splitDateTime(returnDateState).time}
                    </p>
                )}

                {promoData && (
                    <p style={{ color: GCAP_GREEN, fontWeight: 700, fontSize: "13px", marginBottom: "10px" }}>
                        <i className="fa-solid fa-tag me-1"></i>
                        Promo applied: {promoData.discount_value}
                        {promoData.discount_type === "percentage" ? "%" : "£"} off
                    </p>
                )}
                {promoError && (
                    <p style={{ color: "#dc3545", fontSize: "13px", marginBottom: "10px" }}>{promoError}</p>
                )}

                <button
                    type="button"
                    className="bk-search-button"
                    style={{
                        padding: "10px 24px",
                        fontSize: "13px",
                        fontWeight: 700,
                        borderRadius: "8px",
                        border: "none",
                        cursor: "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "8px",
                    }}
                    onClick={() => setShowSearchForm((prev) => !prev)}
                >
                    <i className={`fa-solid ${showSearchForm ? "fa-xmark" : "fa-pen-to-square"}`}></i>
                    {showSearchForm ? "Hide Search" : "Edit Search"}
                </button>
            </div>

            {/* ── Collapsible search form ── */}
            {showSearchForm && (
                <ParkingSearchEditForm
                    airports={airports}
                    selectedAirport={airport}
                    dropDateState={dropDateState}
                    returnDateState={returnDateState}
                    promoCode={promoCode}
                    promoError={promoError}
                    promoData={promoData}
                    returnManuallySet={returnManuallySet}
                    vehicleNo={vehicleNo}
                    searching={loading}
                    onAirportChange={setAirport}
                    onDropDateStateChange={setDropDateState}
                    onReturnDateStateChange={setReturnDateState}
                    onPromoCodeChange={setPromoCode}
                    onReturnManuallySet={setReturnManuallySet}
                    onVehicleNoChange={setVehicleNo}
                    onSubmit={handleSearch}
                />
            )}

            {/* ── Results ── */}
            <div className="container">

                {/* Loading */}
                {loading && (
                    <div style={{ textAlign: "center", padding: "60px 0" }}>
                        <div
                            style={{
                                width: "48px",
                                height: "48px",
                                border: `4px solid #e8ecf0`,
                                borderTopColor: GCAP_GREEN,
                                borderRadius: "50%",
                                animation: "tg-spin 0.8s linear infinite",
                                margin: "0 auto 16px",
                            }}
                        ></div>
                        <style>{`@keyframes tg-spin { to { transform: rotate(360deg); } }`}</style>
                        <p style={{ color: "#888", fontWeight: 600 }}>Searching parking deals…</p>
                    </div>
                )}

                {/* Error */}
                {!loading && loadError && (
                    <div
                        style={{
                            background: "#fff8e1",
                            border: "1px solid #ffe082",
                            borderRadius: "10px",
                            padding: "16px 20px",
                            color: "#795548",
                            marginBottom: "24px",
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                        }}
                    >
                        <i className="fa-solid fa-triangle-exclamation" style={{ color: "#f59e0b" }}></i>
                        {loadError}
                    </div>
                )}

                {/* Empty */}
                {!loading && !loadError && sortedProducts.length === 0 && (
                    <div style={{ textAlign: "center", padding: "60px 20px" }}>
                        <i className="fa-solid fa-car-side" style={{ fontSize: "48px", color: "#dde3ea", marginBottom: "16px", display: "block" }}></i>
                        <p style={{ color: "#888" }}>No parking options found. Click <strong>Edit Search</strong> to try different dates.</p>
                    </div>
                )}

                {/* Product cards */}
                {!loading && sortedProducts.length > 0 && (
                    <>
                        <p style={{ fontSize: "13px", color: "#888", marginBottom: "20px" }}>
                            <strong style={{ color: "#1a1a1a" }}>{sortedProducts.length} parking option{sortedProducts.length !== 1 ? "s" : ""}</strong> available near {airport}
                        </p>

                        <div className="row g-4">
                            {sortedProducts.map((plan, idx) => {
                                const basePrice = Number(pricing[plan.id] || 0);
                                const finalPrice = applyPromoDiscount(basePrice, promoData);
                                const hasDiscount = promoData && basePrice > 0 && finalPrice < basePrice;
                                const features = productFeatures(plan);

                                return (
                                    <div
                                        key={plan.id}
                                        className="col-xl-4 col-lg-4 col-md-6 wow fadeInUp"
                                        data-wow-delay={`${0.1 + idx * 0.1}s`}
                                        data-wow-duration=".8s"
                                        style={{ marginBottom: "24px" }}
                                    >
                                        <div
                                            style={{
                                                background: "#fff",
                                                border: "1px solid #e8ecf0",
                                                borderRadius: "16px",
                                                overflow: "hidden",
                                                
                                                boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
                                                height: "100%",
                                                display: "flex",
                                                flexDirection: "column",
                                            }}
                                        >
                                            {/* Product image */}
                                            <div style={{ position: "relative", height: "160px", overflow: "hidden" }}>
                                                <img
                                                    src={plan.image_data || FALLBACK_IMAGE}
                                                    alt={plan.product_name}
                                                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                                    onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMAGE; }}
                                                />
                                                {plan.nonflex && (
                                                    <span
                                                        style={{
                                                            position: "absolute",
                                                            top: "12px",
                                                            right: "12px",
                                                            background: plan.nonflex === "Refundable" ? GCAP_GREEN : "#dc3545",
                                                            color: "#fff",
                                                            fontSize: "11px",
                                                            fontWeight: 700,
                                                            padding: "3px 10px",
                                                            borderRadius: "20px",
                                                        }}
                                                    >
                                                        {plan.nonflex}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Card body */}
                                            <div style={{ padding: "20px", flexGrow: 1, display: "flex", flexDirection: "column" }}>
                                                <h4 style={{ fontSize: "16px", fontWeight: 700, color: "#1a1a1a", marginBottom: "4px" }}>
                                                    {plan.product_name}
                                                </h4>
                                                {plan.service_type && (
                                                    <p style={{ fontSize: "13px", color: "#888", marginBottom: "12px" }}>
                                                        {plan.service_type}
                                                    </p>
                                                )}

                                                {/* Price */}
                                                <div style={{ marginBottom: "16px" }}>
                                                    {hasDiscount && (
                                                        <del style={{ fontSize: "13px", color: "#aaa", display: "block" }}>
                                                            £{basePrice.toFixed(2)}
                                                        </del>
                                                    )}
                                                    <span style={{ fontSize: "26px", fontWeight: 800, color: "#1a1a1a" }}>
                                                        {basePrice
                                                            ? `£${finalPrice.toFixed(2)}`
                                                            : <span style={{ fontSize: "14px", color: "#aaa" }}>Price loading…</span>
                                                        }
                                                    </span>
                                                    {hasDiscount && (
                                                        <span style={{ fontSize: "12px", color: GCAP_GREEN, fontWeight: 700, marginLeft: "8px" }}>
                                                            Save £{(basePrice - finalPrice).toFixed(2)}
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Features */}
                                                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 20px", flexGrow: 1 }}>
                                                    {(features.length > 0
                                                        ? features
                                                        : ["Secure airport parking", "Easy terminal access", "Online booking"]
                                                    ).map((feature, i) => (
                                                        <li
                                                            key={i}
                                                            style={{
                                                                fontSize: "13px",
                                                                color: "#555",
                                                                display: "flex",
                                                                alignItems: "flex-start",
                                                                gap: "8px",
                                                                marginBottom: "6px",
                                                            }}
                                                        >
                                                            <svg width="16" height="16" viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0, marginTop: "2px" }}>
                                                                <path d="M17 8.26858V9.00458C16.999 10.7297 16.4404 12.4083 15.4075 13.79C14.3745 15.1718 12.9226 16.1826 11.2683 16.6717C9.61394 17.1608 7.8458 17.1021 6.22757 16.5042C4.60934 15.9064 3.22772 14.8015 2.28877 13.3542C1.34981 11.907 0.903833 10.195 1.01734 8.47363C1.13085 6.75223 1.79777 5.11364 2.91862 3.80224C4.03948 2.49083 5.55423 1.57688 7.23695 1.1967C8.91967 0.816507 10.6802 0.990449 12.256 1.69258M17 2.60458L9 10.6126L6.6 8.21258" stroke="#67a71e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                                            </svg>
                                                            {feature}
                                                        </li>
                                                    ))}
                                                </ul>

                                                {/* CTA */}
                                                <button
                                                    type="button"
                                                    className="w-100"
                                                    disabled={!basePrice}
                                                    onClick={() => handleBookNow(plan)}
                                                    style={{
                                                        padding: "12px",
                                                        fontSize: "14px",
                                                        fontWeight: 700,
                                                        borderRadius: "8px",
                                                        border: "none",
                                                        background: "#67a71e",
                                                        color: "#fff",
                                                        cursor: basePrice ? "pointer" : "not-allowed",
                                                        opacity: basePrice ? 1 : 0.5,
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        gap: "8px",
                                                    }}
                                                >
                                                    <i className="fa-solid fa-lock" style={{ fontSize: "12px" }}></i>
                                                    Book Now
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}
            </div>
        </section>
    );
};

export default PricingQuotesArea;
