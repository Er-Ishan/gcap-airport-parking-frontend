import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import type { ParkingProduct, BookingLocationState } from "../../../utils/parkingSearch";

const BRAND = "#67a71e";

const FALLBACK_IMAGE =
    "https://blog.getmyparking.com/wp-content/uploads/2018/07/airport-parking-1.jpg";

const CONTENT_BOX_HEIGHT = 420;

interface ProductDetailsState {
    product: ParkingProduct;
    pricing: number;
    dropDate: string;
    returnDate: string;
    airport: string;
}

type TabKey = "overview" | "dropoff" | "return";

const TABS: { key: TabKey; label: string }[] = [
    { key: "overview", label: "Overview" },
    { key: "dropoff", label: "Drop off Procedure" },
    { key: "return", label: "Return Procedure" },
];

const ProductDetailsPage: React.FC = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const [activeTabIndex, setActiveTabIndex] = useState(0);
    const [width, setWidth] = useState(window.innerWidth);

    useEffect(() => {
        const onResize = () => setWidth(window.innerWidth);
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, []);

    const isMobile = width < 768;
    const isTablet = width >= 768 && width < 1024;
    const isStacked = isMobile || isTablet;

    const activeTab = TABS[activeTabIndex].key;
    const goNext = () => setActiveTabIndex((i) => Math.min(i + 1, TABS.length - 1));
    const goPrev = () => setActiveTabIndex((i) => Math.max(i - 1, 0));

    const pageState = state as ProductDetailsState | null;

    if (!pageState?.product) {
        return (
            <div
                style={{
                    minHeight: "60vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                    gap: "16px",
                    padding: "20px",
                }}
            >
                <p style={{ fontSize: "18px", color: "#555", textAlign: "center" }}>No product data found.</p>
                <button
                    onClick={() => navigate("/pricing-quotes")}
                    style={{
                        padding: "12px 28px",
                        background: BRAND,
                        color: "#fff",
                        border: "none",
                        borderRadius: "10px",
                        fontWeight: 700,
                        fontSize: "15px",
                        cursor: "pointer",
                    }}
                >
                    View Parking Deals
                </button>
            </div>
        );
    }

    const { product, pricing, dropDate, returnDate, airport } = pageState;

    const features = [
        product.point_1,
        product.point_2,
        product.point_3,
        product.point_4,
        product.point_5,
        product.point_6,
    ].filter((p): p is string => Boolean(p));

    const handleBookNow = () => {
        const basePrice = Number(pricing || 0);
        const bookingState: BookingLocationState = {
            productId: product.id,
            dropDate,
            returnDate,
            travelling_from: airport,
            basePrice,
            discountAmount: 0,
            finalPrice: basePrice,
            product_overview: product.product_overview,
            product_description: product.product_description,
            dropoff_procedure: product.dropoff_procedure,
        };
        navigate("/booking-form", { state: bookingState });
    };

    const tabContent: Record<TabKey, { heading: string; html: string | undefined }> = {
        overview: { heading: "Overview", html: product.product_overview },
        dropoff: { heading: "Drop-off Procedure", html: product.dropoff_procedure },
        return: { heading: "Return Procedure", html: product.return_procedure },
    };

    return (
        <>
            {/* Page Hero Strip */}
            <div
                style={{
                    background: BRAND,
                    padding: "28px 16px 22px",
                    textAlign: "center",
                    marginBottom: "32px",
                }}
            >
                <h1 style={{ color: "#fff", fontSize: "clamp(20px, 4vw, 34px)", fontWeight: 700, margin: 0 }}>
                    {product.product_name}
                </h1>
                {product.service_type && (
                    <p style={{ color: "rgba(255,255,255,0.85)", margin: "6px 0 0", fontSize: "15px" }}>
                        {product.service_type}
                    </p>
                )}
            </div>

            {/* Main Layout */}
            <div
                style={{
                    maxWidth: "1200px",
                    margin: "0 auto",
                    padding: isMobile ? "0 12px 40px" : "0 20px 60px",
                    display: "flex",
                    flexDirection: isStacked ? "column" : "row",
                    gap: isMobile ? "20px" : "28px",
                    alignItems: "flex-start",
                }}
            >
                {/* ── LEFT PANEL ── */}
                <div style={{ flex: isStacked ? "none" : "1 1 560px", width: isStacked ? "100%" : undefined, minWidth: 0 }}>

                    {/* Slider tab bar */}
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
                        <button
                            onClick={goPrev}
                            disabled={activeTabIndex === 0}
                            style={{
                                flexShrink: 0,
                                width: "34px", height: "34px",
                                border: "none",
                                borderRadius: "50%",
                                background: activeTabIndex === 0 ? "#e8e8e8" : BRAND,
                                color: activeTabIndex === 0 ? "#bbb" : "#fff",
                                cursor: activeTabIndex === 0 ? "not-allowed" : "pointer",
                                fontSize: "18px", fontWeight: 700,
                                display: "flex", alignItems: "center", justifyContent: "center",
                                transition: "all 0.2s",
                            }}
                        >‹</button>

                        <div style={{ flex: 1, display: "flex", gap: "8px" }}>
                            {TABS.map(({ key, label }, idx) => (
                                <button
                                    key={key}
                                    onClick={() => setActiveTabIndex(idx)}
                                    style={{
                                        flex: "1 1 auto",
                                        padding: isMobile ? "9px 8px" : "11px 14px",
                                        border: `1.5px solid ${activeTab === key ? BRAND : "#e3e3e3"}`,
                                        borderRadius: "10px",
                                        background: activeTab === key ? BRAND : "#fff",
                                        color: activeTab === key ? "#fff" : BRAND,
                                        fontWeight: 600,
                                        fontSize: isMobile ? "11px" : "13px",
                                        cursor: "pointer",
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        transition: "all 0.2s ease",
                                        opacity: activeTab !== key ? 0.7 : 1,
                                    }}
                                >{label}</button>
                            ))}
                        </div>

                        <button
                            onClick={goNext}
                            disabled={activeTabIndex === TABS.length - 1}
                            style={{
                                flexShrink: 0,
                                width: "34px", height: "34px",
                                border: "none",
                                borderRadius: "50%",
                                background: activeTabIndex === TABS.length - 1 ? "#e8e8e8" : BRAND,
                                color: activeTabIndex === TABS.length - 1 ? "#bbb" : "#fff",
                                cursor: activeTabIndex === TABS.length - 1 ? "not-allowed" : "pointer",
                                fontSize: "18px", fontWeight: 700,
                                display: "flex", alignItems: "center", justifyContent: "center",
                                transition: "all 0.2s",
                            }}
                        >›</button>
                    </div>

                    {/* Dot indicators */}
                    <div style={{ display: "flex", justifyContent: "center", gap: "6px", marginBottom: "12px" }}>
                        {TABS.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setActiveTabIndex(idx)}
                                style={{
                                    width: activeTabIndex === idx ? "22px" : "8px",
                                    height: "8px",
                                    borderRadius: "999px",
                                    background: activeTabIndex === idx ? BRAND : "#d0d0d0",
                                    border: "none",
                                    cursor: "pointer",
                                    padding: 0,
                                    transition: "all 0.3s ease",
                                }}
                            />
                        ))}
                    </div>

                    {/* Content box — fixed height, scrollable */}
                    <div
                        style={{
                            height: `${CONTENT_BOX_HEIGHT}px`,
                            background: "#f8f9fa",
                            border: "1px solid #e8e8e8",
                            borderRadius: "14px",
                            overflow: "hidden",
                            display: "flex",
                            flexDirection: "column",
                        }}
                    >
                        <div
                            style={{
                                padding: "14px 20px 12px",
                                borderBottom: "1px solid #e8e8e8",
                                flexShrink: 0,
                            }}
                        >
                            <h5 style={{ fontWeight: 700, margin: 0, color: BRAND, fontSize: "15px" }}>
                                {tabContent[activeTab].heading}
                            </h5>
                        </div>

                        <div
                            style={{
                                flex: 1,
                                overflowY: "auto",
                                padding: "14px 20px 18px",
                                scrollbarWidth: "thin",
                                scrollbarColor: `${BRAND} #e8e8e8`,
                            }}
                        >
                            {tabContent[activeTab].html ? (
                                <div
                                    style={{ fontSize: "14px", lineHeight: "1.8", color: "#555" }}
                                    dangerouslySetInnerHTML={{ __html: tabContent[activeTab].html as string }}
                                />
                            ) : (
                                <p style={{ fontSize: "14px", color: "#999" }}>No information available.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* ── RIGHT PANEL — natural height, no stretch ── */}
                <div
                    style={{
                        width: isStacked ? "100%" : undefined,
                        flexShrink: 0,
                        flexBasis: isStacked ? undefined : "340px",
                    }}
                >
                    <div
                        style={{
                            background: "#fff",
                            border: "1px solid #e8e8e8",
                            borderRadius: "20px",
                            overflow: "hidden",
                            boxShadow: "0 4px 20px rgba(0,0,0,0.07)",
                        }}
                    >
                        {/* Image */}
                        <div style={{ padding: "20px", borderBottom: "1px solid #f0f0f0", textAlign: "center", background: "#fafafa" }}>
                            <img
                                src={product.image_data || FALLBACK_IMAGE}
                                alt={product.product_name}
                                style={{ maxHeight: isMobile ? "100px" : "130px", maxWidth: "100%", objectFit: "contain" }}
                            />
                        </div>

                        <div style={{ padding: "20px 20px 24px" }}>

                            {/* Badges */}
                            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "center", marginBottom: "16px" }}>
                                {product.service_type && (
                                    <span style={{ background: "rgba(103,167,30,0.08)", color: BRAND, padding: "5px 12px", borderRadius: "999px", fontSize: "12px", fontWeight: 600 }}>
                                        <i className="fas fa-car" style={{ marginRight: "5px" }} />
                                        {product.service_type}
                                    </span>
                                )}
                                {product.nonflex && (
                                    <span
                                        style={{
                                            background: product.nonflex === "Refundable" ? "rgba(103,167,30,0.08)" : "#fff1f0",
                                            color: product.nonflex === "Refundable" ? BRAND : "#dc3545",
                                            padding: "5px 12px", borderRadius: "999px", fontSize: "12px", fontWeight: 600,
                                        }}
                                    >{product.nonflex}</span>
                                )}
                            </div>

                            {/* Features */}
                            {features.length > 0 && (
                                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 16px", display: "flex", flexDirection: "column", gap: "8px" }}>
                                    {features.map((feat, i) => (
                                        <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: "8px", fontSize: "13px", lineHeight: "20px", color: "#333" }}>
                                            <i className="fas fa-check-circle" style={{ color: BRAND, flexShrink: 0, marginTop: "2px", fontSize: "16px" }} />
                                            {feat}
                                        </li>
                                    ))}
                                    {product.status && (
                                        <li style={{ display: "flex", alignItems: "flex-start", gap: "8px", fontSize: "13px", lineHeight: "20px" }}>
                                            {product.status === "Active"
                                                ? <i className="fas fa-check-circle" style={{ color: BRAND, flexShrink: 0, marginTop: "2px", fontSize: "16px" }} />
                                                : <i className="fas fa-times-circle" style={{ color: "#dc3545", flexShrink: 0, marginTop: "2px", fontSize: "16px" }} />
                                            }
                                            <span>
                                                <strong>Status:</strong>{" "}
                                                <span style={{ fontWeight: 600, color: product.status === "Active" ? BRAND : "#dc3545" }}>
                                                    {product.status}
                                                </span>
                                            </span>
                                        </li>
                                    )}
                                </ul>
                            )}

                            {/* Price */}
                            <div style={{ fontSize: "clamp(26px, 5vw, 34px)", fontWeight: 800, color: BRAND, textAlign: "center", marginBottom: "14px", lineHeight: 1 }}>
                                £{Number(pricing || 0).toFixed(2)}
                            </div>

                            {/* Book Now */}
                            <button
                                onClick={handleBookNow}
                                style={{ width: "100%", padding: "14px", background: BRAND, color: "#fff", border: "none", borderRadius: "10px", fontWeight: 700, fontSize: "16px", cursor: "pointer", marginBottom: "10px", transition: "opacity 0.2s" }}
                            >
                                Book Now
                            </button>

                            {/* Back */}
                            <button
                                onClick={() => navigate(-1)}
                                style={{ width: "100%", padding: "13px", background: "transparent", color: BRAND, border: `2px solid ${BRAND}`, borderRadius: "10px", fontWeight: 600, fontSize: "15px", cursor: "pointer", transition: "all 0.2s" }}
                            >
                                Back
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProductDetailsPage;
