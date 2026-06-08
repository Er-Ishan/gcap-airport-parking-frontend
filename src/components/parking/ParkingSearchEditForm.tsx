import React, { useRef, useState, useEffect } from "react";
import Flatpickr from "react-flatpickr";
import { TIME_OPTIONS, addDaysToDateString, formatPrettyDate, type PromoData } from "../../utils/parkingSearch";

const GCAP_GREEN = "#3cbc84";

const AIRPORTS = [
    { value: "Bristol", label: "Bristol" },
    { value: "Heathrow", label: "Heathrow" },
    { value: "Gatwick", label: "Gatwick" },
    { value: "Manchester", label: "Manchester" },
    { value: "Stansted", label: "Stansted" },
];

interface Props {
    selectedAirport: string;
    dropDateState: string;
    returnDateState: string;
    promoCode: string;
    promoError: string;
    promoData: PromoData | null;
    returnManuallySet: boolean;
    searching?: boolean;
    onAirportChange: (airport: string) => void;
    onDropDateStateChange: (value: string) => void;
    onReturnDateStateChange: (value: string) => void;
    onPromoCodeChange: (code: string) => void;
    onReturnManuallySet: (value: boolean) => void;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const inputStyle: React.CSSProperties = {
    height: "46px",
    width: "100%",
    background: "#fff",
    border: "1px solid #dde3ea",
    borderRadius: "8px",
    padding: "0 14px",
    outline: "none",
    fontSize: "14px",
    color: "#333",
};

const labelStyle: React.CSSProperties = {
    fontSize: "12px",
    fontWeight: 700,
    color: "#555",
    marginBottom: "6px",
    display: "block",
    textTransform: "uppercase",
    letterSpacing: "0.4px",
};

const ParkingSearchEditForm: React.FC<Props> = ({
    selectedAirport,
    dropDateState,
    returnDateState,
    promoCode,
    promoError,
    promoData,
    returnManuallySet,
    searching = false,
    onAirportChange,
    onDropDateStateChange,
    onReturnDateStateChange,
    onPromoCodeChange,
    onReturnManuallySet,
    onSubmit,
}) => {
    const dropDatePart = dropDateState.split(" ")[0] || "";
    const dropTimePart = dropDateState.split(" ")[1] || "10:00";
    const returnDatePart = returnDateState.split(" ")[0] || "";
    const returnTimePart = returnDateState.split(" ")[1] || "10:00";

    const [dropPickerDate, setDropPickerDate] = useState<Date[]>(
        dropDatePart ? [new Date(dropDatePart)] : []
    );
    const [returnPickerDate, setReturnPickerDate] = useState<Date[]>(
        returnDatePart ? [new Date(returnDatePart)] : []
    );

    const returnFpRef = useRef<{ flatpickr?: { set: (opt: string, val: unknown) => void } } | null>(null);

    useEffect(() => {
        if (returnFpRef.current?.flatpickr && dropDatePart) {
            returnFpRef.current.flatpickr.set("minDate", new Date(dropDatePart));
        }
    }, [dropDatePart]);

    const handleDropDateChange = (dates: Date[]) => {
        if (!dates[0]) return;
        const iso = dates[0].toISOString().split("T")[0];
        setDropPickerDate(dates);
        onDropDateStateChange(`${iso} ${dropTimePart}`);
        if (!returnManuallySet) {
            const newReturn = addDaysToDateString(iso, 7);
            setReturnPickerDate([new Date(newReturn)]);
            onReturnDateStateChange(`${newReturn} ${returnTimePart}`);
        }
    };

    const handleReturnDateChange = (dates: Date[]) => {
        if (!dates[0]) return;
        const iso = dates[0].toISOString().split("T")[0];
        setReturnPickerDate(dates);
        onReturnManuallySet(true);
        onReturnDateStateChange(`${iso} ${returnTimePart}`);
    };

    return (
        <div className="container mb-30">
            <div
                style={{
                    background: "#fff",
                    borderRadius: "14px",
                    border: "1px solid #e8ecf0",
                    padding: "24px 28px",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                }}
            >
                <form onSubmit={onSubmit}>
                    <div className="row g-2 align-items-end flex-nowrap">
                        {/* Airport */}
                        <div className="col">
                            <label style={labelStyle}>
                                <i className="fa-regular fa-location-dot me-1" style={{ color: GCAP_GREEN }}></i>
                                Airport
                            </label>
                            <select
                                value={selectedAirport}
                                onChange={(e) => onAirportChange(e.target.value)}
                                style={inputStyle}
                            >
                                {AIRPORTS.map((a) => (
                                    <option key={a.value} value={a.value}>{a.label}</option>
                                ))}
                            </select>
                        </div>

                        {/* Drop-off date */}
                        <div className="col">
                            <label style={labelStyle}>
                                <i className="fa-regular fa-calendar me-1" style={{ color: GCAP_GREEN }}></i>
                                Drop-off date
                            </label>
                            <div style={{ position: "relative" }}>
                                <Flatpickr
                                    value={dropPickerDate}
                                    onChange={handleDropDateChange}
                                    options={{ dateFormat: "d/m/Y", minDate: "today" }}
                                    style={inputStyle}
                                    placeholder="dd/mm/yyyy"
                                />
                            </div>
                        </div>

                        {/* Drop-off time */}
                        <div className="col">
                            <label style={labelStyle}>
                                <i className="fa-regular fa-clock me-1" style={{ color: GCAP_GREEN }}></i>
                                Drop-off time
                            </label>
                            <select
                                value={dropTimePart}
                                onChange={(e) => onDropDateStateChange(`${dropDatePart} ${e.target.value}`)}
                                style={inputStyle}
                            >
                                {TIME_OPTIONS.map((t) => (
                                    <option key={t.value} value={t.value}>{t.label}</option>
                                ))}
                            </select>
                        </div>

                        {/* Return date */}
                        <div className="col">
                            <label style={labelStyle}>
                                <i className="fa-regular fa-calendar-check me-1" style={{ color: GCAP_GREEN }}></i>
                                Return date
                            </label>
                            <Flatpickr
                                ref={returnFpRef as React.Ref<Flatpickr>}
                                value={returnPickerDate}
                                onChange={handleReturnDateChange}
                                options={{
                                    dateFormat: "d/m/Y",
                                    minDate: dropDatePart ? new Date(dropDatePart) : "today",
                                }}
                                style={inputStyle}
                                placeholder="dd/mm/yyyy"
                            />
                        </div>

                        {/* Return time */}
                        <div className="col">
                            <label style={labelStyle}>
                                <i className="fa-regular fa-clock me-1" style={{ color: GCAP_GREEN }}></i>
                                Return time
                            </label>
                            <select
                                value={returnTimePart}
                                onChange={(e) => onReturnDateStateChange(`${returnDatePart} ${e.target.value}`)}
                                style={inputStyle}
                            >
                                {TIME_OPTIONS.map((t) => (
                                    <option key={t.value} value={t.value}>{t.label}</option>
                                ))}
                            </select>
                        </div>

                        {/* Promo code */}
                        <div className="col">
                            <label style={labelStyle}>
                                <i className="fa-solid fa-tag me-1" style={{ color: GCAP_GREEN }}></i>
                                Promo code
                            </label>
                            <input
                                type="text"
                                placeholder="Enter code"
                                value={promoCode}
                                onChange={(e) => onPromoCodeChange(e.target.value.toUpperCase())}
                                style={inputStyle}
                            />
                            {promoError && (
                                <small style={{ color: "#dc3545", display: "block", marginTop: "4px", fontSize: "11px" }}>
                                    {promoError}
                                </small>
                            )}
                            {promoData && (
                                <small style={{ color: GCAP_GREEN, display: "block", marginTop: "4px", fontSize: "11px", fontWeight: 700 }}>
                                    ✓ {promoData.discount_value}{promoData.discount_type === "percentage" ? "%" : "£"} off applied
                                </small>
                            )}
                        </div>

                        {/* Submit */}
                        <div className="col-auto">
                            <button
                                type="submit"
                                className="bk-search-button"
                                disabled={searching}
                                style={{
                                    padding: "12px 24px",
                                    fontSize: "14px",
                                    fontWeight: 700,
                                    borderRadius: "8px",
                                    border: "none",
                                    cursor: searching ? "not-allowed" : "pointer",
                                    whiteSpace: "nowrap",
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "8px",
                                    opacity: searching ? 0.75 : 1,
                                    width: "100%",
                                    justifyContent: "center",
                                }}
                            >
                                {searching
                                    ? <><i className="fa-solid fa-spinner fa-spin"></i> Searching…</>
                                    : <><i className="fa-solid fa-magnifying-glass"></i> Search</>
                                }
                            </button>
                        </div>
                    </div>

                    
                </form>
            </div>
        </div>
    );
};

export default ParkingSearchEditForm;
