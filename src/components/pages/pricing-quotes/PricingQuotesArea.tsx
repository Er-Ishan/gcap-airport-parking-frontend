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
    d.setDate(d.getDate() + 1);
    return `${d.toISOString().split("T")[0]} 10:00`;
})();

const DEFAULT_RETURN = (() => {
    const d = new Date();
    d.setDate(d.getDate() + 8);
    return `${d.toISOString().split("T")[0]} 10:00`;
})();

const FALLBACK_IMAGE = "/assets/img/banner/thumb.jpg";

const PricingQuotesArea: React.FC = () => {
    const navigate = useNavigate();

    const [airports, setAirports] = useState<AirportOption[]>([]);
    const [showSearchForm, setShowSearchForm] = useState(false);
    const [airport, setAirport] = useState("");
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
        fetchAirports().then((data) => {
            setAirports(data);
            if (!localStorage.getItem("selectedAirport") && data.length > 0) {
                setAirport(data[0].airport_name);
            }
        });
    }, []);

    useEffect(() => {
        let cancelled = false;

        const drop = getStoredDateTime("dropDate", DEFAULT_DROP);
        const ret = getStoredDateTime("returnDate", DEFAULT_RETURN);
        const selectedAirport = localStorage.getItem("selectedAirport") || "";
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
                        <style>{`
                            .pq-cards-grid {
                                display: grid;
                                grid-template-columns: repeat(4, 1fr);
                                gap: 20px;
                            }
                            @media (max-width: 1199px) {
                                .pq-cards-grid { grid-template-columns: repeat(3, 1fr); }
                            }
                            @media (max-width: 767px) {
                                .pq-cards-grid { grid-template-columns: repeat(2, 1fr); }
                            }
                            @media (max-width: 480px) {
                                .pq-cards-grid { grid-template-columns: 1fr; }
                            }
                        `}</style>
                        <p style={{ fontSize: "13px", color: "#888", marginBottom: "20px" }}>
                            <strong style={{ color: "#1a1a1a" }}>{sortedProducts.length} parking option{sortedProducts.length !== 1 ? "s" : ""}</strong> available near {airport}
                        </p>

                        <div className="pq-cards-grid">
                            {sortedProducts.map((plan) => {
                                const basePrice = Number(pricing[plan.id] || 0);
                                const finalPrice = applyPromoDiscount(basePrice, promoData);

                                return (
                                    <div key={plan.id}>
                                        <div
                                            style={{
                                                height: "100%",
                                                display: "flex",
                                                flexDirection: "column",
                                                background: "#fff",
                                                borderRadius: "20px",
                                                overflow: "hidden",
                                                border: "1px solid #e8e8e8",
                                                boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
                                                transition: "all 0.3s ease",
                                            }}
                                        >
                                            {/* Image + header */}
                                            <div style={{ padding: "15px", display: "flex", flexDirection: "column", gap: "10px" }}>
                                                <img
                                                    src={plan.image_data || FALLBACK_IMAGE}
                                                    alt={plan.product_name}
                                                    onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMAGE; }}
                                                    style={{
                                                        width: "100%",
                                                        height: "120px",
                                                        objectFit: "contain",
                                                        background: "#fff",
                                                        padding: "5px",
                                                        borderRadius: "12px",
                                                    }}
                                                />

                                                <div style={{ textAlign: "center" }}>
                                                    <h3 style={{ fontSize: "20px", fontWeight: 700, lineHeight: "26px", marginBottom: "8px" }}>
                                                        {plan.product_name}
                                                    </h3>

                                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", flexWrap: "wrap", marginTop: "8px" }}>
                                                        {plan.service_type && (
                                                            <div style={{ display: "flex", alignItems: "center", gap: "6px", background: "#eef6ff", color: "#0d6efd", padding: "6px 12px", borderRadius: "999px", fontSize: "12px", fontWeight: 600, minHeight: "32px" }}>
                                                                <span className="fas fa-car"></span>
                                                                <span>{plan.service_type}</span>
                                                            </div>
                                                        )}
                                                        {plan.nonflex && (
                                                            <div style={{ display: "flex", alignItems: "center", gap: "6px", background: plan.nonflex === "Refundable" ? "#eafaf1" : "#fff1f0", color: plan.nonflex === "Refundable" ? "#198754" : "#dc3545", padding: "6px 12px", borderRadius: "999px", fontSize: "12px", fontWeight: 700, minHeight: "32px" }}>
                                                                <span className={plan.nonflex === "Refundable" ? "fas fa-check-circle" : "fas fa-times-circle"}></span>
                                                                <span>{plan.nonflex}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Body */}
                                            <div style={{ padding: "0 20px 20px", flexGrow: 1, display: "flex", flexDirection: "column" }}>
                                                {/* Feature list */}
                                                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "12px", flexGrow: 1 }}>
                                                    {[plan.point_1, plan.point_2, plan.point_3, plan.point_4, plan.point_5, plan.point_6]
                                                        .filter(Boolean)
                                                        .map((feature, i) => (
                                                            <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: "10px", fontSize: "14px", lineHeight: "22px" }}>
                                                                <span className="fas fa-check" style={{ color: "#22c55e", marginTop: "3px" }}></span>
                                                                <p style={{ color: "#222", margin: 0, fontWeight: 500 }}>{feature}</p>
                                                            </li>
                                                        ))}
                                                </ul>

                                                {/* Price + actions */}
                                                <div style={{ marginTop: "16px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
                                                    {/* Price */}
                                                    <div>
                                                        {basePrice ? (
                                                            <>
                                                                {promoData && (
                                                                    <div style={{ fontSize: "13px", textDecoration: "line-through", color: "#999" }}>
                                                                        £{basePrice.toFixed(2)}
                                                                    </div>
                                                                )}
                                                                <div style={{ fontSize: "28px", fontWeight: 800, color: GCAP_GREEN, lineHeight: 1 }}>
                                                                    £{finalPrice.toFixed(2)}
                                                                </div>
                                                            </>
                                                        ) : (
                                                            <span style={{ fontSize: "14px", color: "#aaa" }}>Loading…</span>
                                                        )}
                                                    </div>

                                                    {/* Read more + Book Now */}
                                                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                                        <svg
                                                            stroke="currentColor"
                                                            fill="currentColor"
                                                            strokeWidth="0"
                                                            viewBox="0 0 512 512"
                                                            height="30"
                                                            width="30"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            style={{ color: GCAP_GREEN, cursor: "pointer", flexShrink: 0 }}
                                                            onClick={() => navigate(`/product-details/${plan.id}`, {
                                                                state: {
                                                                    product: plan,
                                                                    pricing: getFinalPrice(plan),
                                                                    dropDate: dropDateState,
                                                                    returnDate: returnDateState,
                                                                    airport,
                                                                },
                                                            })}
                                                        >
                                                            <title>Read more</title>
                                                            <path d="M256 8C119.043 8 8 119.083 8 256c0 136.997 111.043 248 248 248s248-111.003 248-248C504 119.083 392.957 8 256 8zm0 110c23.196 0 42 18.804 42 42s-18.804 42-42 42-42-18.804-42-42 18.804-42 42-42zm56 254c0 6.627-5.373 12-12 12h-88c-6.627 0-12-5.373-12-12v-24c0-6.627 5.373-12 12-12h12v-64h-12c-6.627 0-12-5.373-12-12v-24c0-6.627 5.373-12 12-12h64c6.627 0 12 5.373 12 12v100h12c6.627 0 12 5.373 12 12v24z"></path>
                                                        </svg>
                                                        <button
                                                            type="button"
                                                            disabled={!basePrice}
                                                            onClick={() => handleBookNow(plan)}
                                                            style={{
                                                                height: "48px",
                                                                minWidth: "130px",
                                                                border: "none",
                                                                borderRadius: "10px",
                                                                background: GCAP_GREEN,
                                                                color: "#fff",
                                                                fontWeight: 700,
                                                                fontSize: "15px",
                                                                cursor: basePrice ? "pointer" : "not-allowed",
                                                                opacity: basePrice ? 1 : 0.5,
                                                                display: "flex",
                                                                alignItems: "center",
                                                                justifyContent: "center",
                                                                gap: "8px",
                                                                padding: "0 20px",
                                                            }}
                                                        >
                                                            Book Now
                                                        </button>
                                                    </div>
                                                </div>
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
