import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Flatpickr from "react-flatpickr";
import { fetchAirports, type AirportOption } from "../../../services/parkingApi";

const generateTimeOptions = () => {
  const times: string[] = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let min = 0; min < 60; min += 15) {
      times.push(
        `${String(hour).padStart(2, "0")}:${String(min).padStart(2, "0")}`,
      );
    }
  }
  return times;
};

const timeOptions = generateTimeOptions();

const GCAP_GREEN = "#67a71e";

const Chevron = () => (
  <svg
    width="12"
    height="8"
    viewBox="0 0 14 8"
    fill="none"
    style={{ flexShrink: 0, marginLeft: "6px" }}
  >
    <path
      d="M1.667 1L7 6.333 12.333 1"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const BannerFormOne = () => {
  const navigate = useNavigate();
  const [airports, setAirports] = useState<AirportOption[]>([]);
  const [airportOpen, setAirportOpen] = useState(false);
  const [selectedAirport, setSelectedAirport] = useState<AirportOption | null>(null);

  useEffect(() => {
    fetchAirports().then((data) => {
      setAirports(data);
      if (data.length > 0) setSelectedAirport(data[0]);
    });
  }, []);
  const [checkInDate, setCheckInDate] = useState<Date | Date[]>(new Date());
  const [checkOutDate, setCheckOutDate] = useState<Date | Date[]>(new Date());
  const [dropoffTime, setDropoffTime] = useState("09:00");
  const [dropoffOpen, setDropoffOpen] = useState(false);
  const [returnTime, setReturnTime] = useState("17:00");
  const [returnOpen, setReturnOpen] = useState(false);
  const [promoCode, setPromoCode] = useState("");

  const [vehicleNo, setVehicleNo] = useState("");
  const [vehicleOpen, setVehicleOpen] = useState(false);
  const vehicleRef = useRef<HTMLDivElement>(null);

  const airportRef = useRef<HTMLDivElement>(null);
  const dropoffRef = useRef<HTMLDivElement>(null);
  const returnRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (airportRef.current && !airportRef.current.contains(target))
        setAirportOpen(false);
      if (dropoffRef.current && !dropoffRef.current.contains(target))
        setDropoffOpen(false);
      if (returnRef.current && !returnRef.current.contains(target))
        setReturnOpen(false);
      if (vehicleRef.current && !vehicleRef.current.contains(target))
        setVehicleOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toDateStr = (d: Date | Date[]): string => {
    const date = Array.isArray(d) ? d[0] : d;
    return date instanceof Date ? date.toISOString().split("T")[0] : "";
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    localStorage.setItem("selectedAirport", selectedAirport?.airport_name ?? "");
    localStorage.setItem(
      "dropDate",
      `${toDateStr(checkInDate)} ${dropoffTime}`,
    );
    localStorage.setItem(
      "returnDate",
      `${toDateStr(checkOutDate)} ${returnTime}`,
    );
    localStorage.setItem("vehicleNo", vehicleNo);
    if (promoCode.trim()) localStorage.setItem("promoCode", promoCode.trim());
    else localStorage.removeItem("promoCode");
    navigate("/pricing-quotes");
  };

  const fieldStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    padding: "0 22px",
    flex: "1 1 0",
    minWidth: "120px",
    boxSizing: "border-box",
    minHeight: "72px",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: "12px",
    color: "#1a1a1a",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.6px",
    marginBottom: "5px",
    whiteSpace: "nowrap",
    lineHeight: 1,
    display: "block",
  };

  const valueStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    fontSize: "14px",
    fontWeight: 600,
    color: "#aaa",
    cursor: "pointer",
    background: "none",
    border: "none",
    padding: 0,
    margin: 0,
    whiteSpace: "nowrap",
    lineHeight: 1,
    height: "20px",
  };

  const dropdownStyle: React.CSSProperties = {
    position: "absolute",
    top: "calc(100% + 8px)",
    left: 0,
    background: "#fff",
    border: "1px solid #e8ecf0",
    borderRadius: "10px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
    zIndex: 999,
    minWidth: "160px",
    maxHeight: "220px",
    overflowY: "auto",
    padding: "6px 0",
  };

  return (
    <form onSubmit={handleSubmit}>
      <style>{`

/* Remove Flatpickr border */
.flatpickr-input {
  border: none !important;
  outline: none !important;
  box-shadow: none !important;
  background: transparent !important;
  padding: 0 !important;
}
.flatpickr-input:focus {
  border: none !important;
  outline: none !important;
  box-shadow: none !important;
}
.flatpickr-input[type="text"] {
  -webkit-appearance: none;
  appearance: none;
}
.promo-input::placeholder {
  color: #aaa !important;
}

/* =========================
   DESKTOP (1025px+)
========================= */
.banner-form-wrapper {
  display: flex;
  align-items: stretch;
  gap: 12px;
  padding: 0 10px;
}
.banner-form-field {
  flex: 1 1 130px;
  min-width: 0;
}
.banner-form-submit {
  flex-shrink: 0;
  min-width: 150px !important;
}

/* =========================
   LAPTOP 769–1024px
========================= */
@media (max-width: 1024px) and (min-width: 769px) {
  .banner-form-wrapper {
    display: grid !important;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    padding: 20px;
    height: auto !important;
  }
  .banner-form-field {
    width: 100% !important;
    min-width: 0 !important;
    border-right: none !important;
    height: auto !important;
  }
  .promo-field {
    grid-column: span 2;
  }
  .banner-form-submit {
    grid-column: span 1;
    width: 100% !important;
    min-width: 0 !important;
    height: 56px;
    align-self: end;
    border-radius: 8px !important;
  }
  .banner-form-field--first {
    border-radius: 8px !important;
  }
}

/* =========================
   TABLET 481–768px
========================= */
@media (max-width: 768px) and (min-width: 481px) {
  .banner-form-wrapper {
    display: grid !important;
    grid-template-columns: 1fr 1fr;
    gap: 0 !important;
    padding: 0 !important;
    height: auto !important;
  }
  .banner-form-field {
    width: 100% !important;
    min-width: 0 !important;
    border-right: none !important;
    border-bottom: 1px solid #f2f2f2 !important;
    min-height: 68px !important;
    padding: 0 16px !important;
    box-sizing: border-box;
  }
  .banner-form-wrapper > .banner-form-field:nth-child(odd):not(.banner-form-field--first) {
    border-right: 1px solid #f2f2f2 !important;
  }
  .banner-form-field--first {
    grid-column: span 2;
    border-radius: 14px 14px 0 0 !important;
    border-right: none !important;
  }
  .promo-field {
    grid-column: span 1;
  }
  .banner-form-submit {
    grid-column: span 2;
    width: 100% !important;
    min-width: 0 !important;
    height: 52px;
    border-radius: 0 0 14px 14px !important;
    margin: 0;
  }
}

/* =========================
   MOBILE ≤480px
========================= */
@media (max-width: 480px) {
  .banner-form-wrapper {
    display: grid !important;
    grid-template-columns: 1fr 1fr;
    gap: 0 !important;
    padding: 0 !important;
    height: auto !important;
  }
  .banner-form-field {
    width: 100% !important;
    min-width: 0 !important;
    flex: unset !important;
    border-right: none !important;
    border-bottom: 1px solid #f2f2f2 !important;
    min-height: 62px !important;
    padding: 0 14px !important;
    box-sizing: border-box;
  }
  .banner-form-wrapper > .banner-form-field:nth-child(2),
  .banner-form-wrapper > .banner-form-field:nth-child(4),
  .banner-form-wrapper > .banner-form-field:nth-child(6) {
    border-right: 1px solid #f2f2f2 !important;
  }
  .banner-form-field--first {
    grid-column: span 2;
    border-radius: 14px 14px 0 0 !important;
    border-right: none !important;
  }
  .banner-form-submit {
    grid-column: span 2;
    width: 100% !important;
    min-width: 0 !important;
    height: 52px;
    border-radius: 0 0 14px 14px !important;
    margin: 0;
    justify-content: center !important;
  }
}
            `}</style>
      <div
        className="banner-form-wrapper"
        style={{
          background: "#fff",
          borderRadius: "14px",
          boxShadow: "0 8px 40px rgba(0,0,0,0.15)",
          overflow: "visible",
          position: "relative",
        }}
      >
        {/* Airport */}
        <div
          ref={airportRef}
          className="banner-form-field banner-form-field--first"
          style={{
            ...fieldStyle,
            position: "relative",
            borderRadius: "14px 0 0 14px",
          }}
        >
          <span style={labelStyle}>Airport:</span>
          <button
            type="button"
            style={valueStyle}
            onClick={() => setAirportOpen((p) => !p)}
          >
            <i
              className="fa-regular fa-location-dot"
              style={{
                color: GCAP_GREEN,
                marginRight: "6px",
                fontSize: "13px",
              }}
            ></i>
            {selectedAirport?.airport_name ?? "Select Airport"}
            <Chevron />
          </button>
          {airportOpen && (
            <div style={dropdownStyle}>
              {airports.map((a) => (
                <div
                  key={a.airport_id}
                  onClick={() => {
                    setSelectedAirport(a);
                    setAirportOpen(false);
                  }}
                  style={{
                    padding: "9px 16px",
                    cursor: "pointer",
                    fontSize: "13px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "#f5f5f5")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  <i
                    className="fa-regular fa-location-dot"
                    style={{ color: GCAP_GREEN }}
                  ></i>
                  {a.airport_name}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Drop Off Date */}
        <div
          className="banner-form-field"
          style={{ ...fieldStyle, position: "relative" }}
        >
          <span style={labelStyle}>Drop Off Date:</span>
          <div style={{ ...valueStyle, position: "relative" }}>
            <Flatpickr
              value={checkInDate}
              onChange={(dates) => setCheckInDate(dates)}
              options={{ dateFormat: "d/m/Y", minDate: "today" }}
              style={{
                border: "none !important",
                outline: "none",
                fontSize: "14px",
                fontWeight: 600,
                color: "#aaa",
                background: "transparent",
                width: "90px",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                padding: 0,
                height: "28px",
                lineHeight: 1,
              }}
            />
            <Chevron />
          </div>
        </div>

        {/* Drop Off Time */}
        <div
          ref={dropoffRef}
          className="banner-form-field"
          style={{ ...fieldStyle, position: "relative" }}
        >
          <span style={labelStyle}>Drop Off Time:</span>
          <button
            type="button"
            style={valueStyle}
            onClick={() => setDropoffOpen((p) => !p)}
          >
            {dropoffTime}
            <Chevron />
          </button>
          {dropoffOpen && (
            <div style={dropdownStyle}>
              {timeOptions.map((t) => (
                <div
                  key={t}
                  onClick={() => {
                    setDropoffTime(t);
                    setDropoffOpen(false);
                  }}
                  style={{
                    padding: "7px 16px",
                    cursor: "pointer",
                    fontSize: "13px",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "#f5f5f5")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  {t}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Return Date */}
        <div
          className="banner-form-field"
          style={{ ...fieldStyle, position: "relative" }}
        >
          <span style={labelStyle}>Return Date:</span>
          <div style={{ ...valueStyle }}>
            <Flatpickr
              value={checkOutDate}
              onChange={(dates) => setCheckOutDate(dates)}
              options={{ dateFormat: "d/m/Y", minDate: "today" }}
              style={{
                border: "none !important",
                outline: "none !important",
                fontSize: "14px",
                fontWeight: 600,
                color: "#aaa",
                background: "transparent",
                width: "90px",
                cursor: "pointer",
                padding: 0,
                height: "20px",
                lineHeight: 1,
              }}
            />
            <Chevron />
          </div>
        </div>

        {/* Return Time */}
        <div
          ref={returnRef}
          className="banner-form-field"
          style={{ ...fieldStyle, position: "relative" }}
        >
          <span style={labelStyle}>Return Time:</span>
          <button
            type="button"
            style={valueStyle}
            onClick={() => setReturnOpen((p) => !p)}
          >
            {returnTime}
            <Chevron />
          </button>
          {returnOpen && (
            <div style={dropdownStyle}>
              {timeOptions.map((t) => (
                <div
                  key={t}
                  onClick={() => {
                    setReturnTime(t);
                    setReturnOpen(false);
                  }}
                  style={{
                    padding: "7px 16px",
                    cursor: "pointer",
                    fontSize: "13px",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "#f5f5f5")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  {t}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Vehicle No */}
        <div
          ref={vehicleRef}
          className="banner-form-field"
          style={{ ...fieldStyle, position: "relative" }}
        >
          <span style={labelStyle}>Vehicle No:</span>

          <button
            type="button"
            style={valueStyle}
            onClick={() => setVehicleOpen((p) => !p)}
          >
            {vehicleNo || "Select"}
            <Chevron />
          </button>

          {vehicleOpen && (
            <div style={dropdownStyle}>
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                <div
                  key={num}
                  onClick={() => {
                    setVehicleNo(String(num));
                    setVehicleOpen(false);
                  }}
                  style={{
                    padding: "7px 16px",
                    cursor: "pointer",
                    fontSize: "13px",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "#f5f5f5")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  {num}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Promo Code */}
        <div
          className="banner-form-field promo-field"
          style={{ ...fieldStyle, borderRight: "none", minWidth: "130px" }}
        >
          <span
            style={{
              ...labelStyle,
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <svg
              width="10"
              height="10"
              viewBox="0 0 24 24"
              fill="currentColor"
              style={{ flexShrink: 0 }}
            >
              <path d="M21.41 11.58L12.41 2.58A2 2 0 0 0 11 2H4A2 2 0 0 0 2 4V11A2 2 0 0 0 2.59 12.42L11.59 21.42A2 2 0 0 0 13 22A2 2 0 0 0 14.41 21.41L21.41 14.41A2 2 0 0 0 22 13A2 2 0 0 0 21.41 11.58M13 20L4 11V4H11L20 13M6.5 5A1.5 1.5 0 1 1 5 6.5A1.5 1.5 0 0 1 6.5 5Z" />
            </svg>
            Promo Code:
          </span>
          <input
            type="text"
            className="promo-input"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            placeholder="Enter code"
            style={{
              ...valueStyle,
              fontSize: "14px",
              fontWeight: 600,
              color: "#aaa",
              border: "none",
              outline: "none",
              background: "transparent",
              padding: 0,
              width: "100%",
            }}
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="banner-form-submit"
          style={{
            background: GCAP_GREEN,
            color: "#fff",
            border: "none",
            borderRadius: "0 14px 14px 0",
            padding: "0 32px",
            fontWeight: 700,
            fontSize: "15px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            whiteSpace: "nowrap",
            flexShrink: 0,
            alignSelf: "stretch",
          }}
        >
          Get Quote
          <svg width="16" height="16" viewBox="0 0 14 14" fill="none">
            <g clipPath="url(#clip0_53_103)">
              <path
                d="M13.2218 13.2222L10.5188 10.5192M12.1959 6.48705C12.1959 9.6402 9.63977 12.1963 6.48662 12.1963C3.33348 12.1963 0.777344 9.6402 0.777344 6.48705C0.777344 3.3339 3.33348 0.777771 6.48662 0.777771C9.63977 0.777771 12.1959 3.3339 12.1959 6.48705Z"
                stroke="white"
                strokeWidth="1.575"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
            <defs>
              <clipPath id="clip0_53_103">
                <rect width="14" height="14" fill="white" />
              </clipPath>
            </defs>
          </svg>
        </button>
      </div>
    </form>
  );
};

export default BannerFormOne;
