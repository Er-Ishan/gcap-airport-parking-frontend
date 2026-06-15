import React, { useRef, useState, useEffect } from "react";
import Flatpickr from "react-flatpickr";
import {
  TIME_OPTIONS,
  addDaysToDateString,
  type PromoData,
} from "../../utils/parkingSearch";
import type { AirportOption } from "../../services/parkingApi";
import "./ParkingSearchEditForm.css";

interface Props {
  airports: AirportOption[];
  selectedAirport: string;
  dropDateState: string;
  returnDateState: string;
  promoCode: string;
  promoError: string;
  promoData: PromoData | null;
  returnManuallySet: boolean;
  vehicleNo: string;
  searching?: boolean;
  onAirportChange: (airport: string) => void;
  onDropDateStateChange: (value: string) => void;
  onReturnDateStateChange: (value: string) => void;
  onPromoCodeChange: (code: string) => void;
  onReturnManuallySet: (value: boolean) => void;
  onVehicleNoChange: (value: string) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const Chevron = () => (
  <svg width="12" height="8" viewBox="0 0 14 8" fill="none" style={{ flexShrink: 0, marginLeft: "6px" }}>
    <path d="M1.667 1L7 6.333 12.333 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const GCAP_GREEN = "#67a71e";

const ParkingSearchEditForm: React.FC<Props> = ({
  airports,
  selectedAirport,
  dropDateState,
  returnDateState,
  promoCode,
  promoError,
  promoData,
  returnManuallySet,
  vehicleNo,
  searching = false,
  onAirportChange,
  onDropDateStateChange,
  onReturnDateStateChange,
  onPromoCodeChange,
  onReturnManuallySet,
  onVehicleNoChange,
  onSubmit,
}) => {
  const dropDatePart = dropDateState.split(" ")[0] || "";
  const dropTimePart = dropDateState.split(" ")[1] || "10:00";
  const returnDatePart = returnDateState.split(" ")[0] || "";
  const returnTimePart = returnDateState.split(" ")[1] || "10:00";
  const [dropPickerDate, setDropPickerDate] = useState<Date[]>(
    dropDatePart ? [new Date(dropDatePart)] : [],
  );
  const [returnPickerDate, setReturnPickerDate] = useState<Date[]>(
    returnDatePart ? [new Date(returnDatePart)] : [],
  );

  const [airportOpen, setAirportOpen] = useState(false);
  const airportRef = useRef<HTMLDivElement>(null);

  const returnFpRef = useRef<{
    flatpickr?: { set: (opt: string, val: unknown) => void };
  } | null>(null);

  useEffect(() => {
    if (returnFpRef.current?.flatpickr && dropDatePart) {
      returnFpRef.current.flatpickr.set("minDate", new Date(dropDatePart));
    }
  }, [dropDatePart]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (airportRef.current && !airportRef.current.contains(e.target as Node))
        setAirportOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
      <div className="parking-search-form-wrapper">
        <form onSubmit={onSubmit}>
          <div className="parking-form-row">
            {/* Airport */}
            <div className="parking-form-field" ref={airportRef} style={{ position: "relative" }}>
              <label className="parking-form-label">
                <i className="fa-regular fa-location-dot me-1"></i>Airport
              </label>
              <button
                type="button"
                className="parking-form-input parking-airport-btn"
                onClick={() => setAirportOpen((p) => !p)}
              >
                <span style={{ flex: 1, textAlign: "left", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{selectedAirport || "Select Airport"}</span>
                <Chevron />
              </button>
              {airportOpen && (
                <div className="parking-airport-dropdown">
                  {airports.map((a) => (
                    <div
                      key={a.airport_id}
                      className="parking-airport-option"
                      onClick={() => { onAirportChange(a.airport_name); setAirportOpen(false); }}
                    >
                      <i className="fa-regular fa-location-dot" style={{ color: GCAP_GREEN }}></i>
                      {a.airport_name}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Drop-off date */}
            <div className="parking-form-field">
              <label className="parking-form-label">
                <i className="fa-regular fa-calendar me-1"></i>Drop-off date
              </label>
              <Flatpickr
                value={dropPickerDate}
                onChange={handleDropDateChange}
                options={{ dateFormat: "d/m/Y", minDate: "today" }}
                className="parking-form-input"
                placeholder="dd/mm/yyyy"
              />
            </div>

            {/* Drop-off time */}
            <div className="parking-form-field parking-form-field--narrow">
              <label className="parking-form-label">
                <i className="fa-regular fa-clock me-1"></i>Drop-off time
              </label>
              <select
                value={dropTimePart}
                onChange={(e) => onDropDateStateChange(`${dropDatePart} ${e.target.value}`)}
                className="parking-form-input"
              >
                {TIME_OPTIONS.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>

            {/* Return date */}
            <div className="parking-form-field">
              <label className="parking-form-label">
                <i className="fa-regular fa-calendar-check me-1"></i>Return date
              </label>
              <Flatpickr
                ref={returnFpRef as any}
                value={returnPickerDate}
                onChange={handleReturnDateChange}
                options={{ dateFormat: "d/m/Y", minDate: dropDatePart ? new Date(dropDatePart) : "today" }}
                className="parking-form-input"
                placeholder="dd/mm/yyyy"
              />
            </div>

            {/* Return time */}
            <div className="parking-form-field parking-form-field--narrow">
              <label className="parking-form-label">
                <i className="fa-regular fa-clock me-1"></i>Return time
              </label>
              <select
                value={returnTimePart}
                onChange={(e) => onReturnDateStateChange(`${returnDatePart} ${e.target.value}`)}
                className="parking-form-input"
              >
                {TIME_OPTIONS.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>

            {/* Vehicle No */}
            <div className="parking-form-field parking-form-field--narrow">
              <label className="parking-form-label">
                <i className="fa-solid fa-car me-1"></i>Vehicle
              </label>
              <select
                value={vehicleNo}
                onChange={(e) => onVehicleNoChange(e.target.value)}
                className="parking-form-input"
              >
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
            </div>

            {/* Promo code */}
            <div className="parking-form-field">
              <label className="parking-form-label">
                <i className="fa-solid fa-tag me-1"></i>Promo code
              </label>
              <input
                type="text"
                placeholder="Enter code"
                value={promoCode}
                onChange={(e) => onPromoCodeChange(e.target.value.toUpperCase())}
                className="parking-form-input"
              />
              {promoError && <small className="parking-form-error">{promoError}</small>}
              {promoData && (
                <small className="parking-form-success">
                  ✓ {promoData.discount_value}{promoData.discount_type === "percentage" ? "%" : "£"} off applied
                </small>
              )}
            </div>

            {/* Submit */}
            <div className="parking-form-field parking-form-field--submit">
              <button
                type="submit"
                className="bk-search-button parking-submit-btn"
                disabled={searching}
              >
                {searching ? (
                  <><i className="fa-solid fa-spinner fa-spin"></i> Searching…</>
                ) : (
                  <><i className="fa-solid fa-magnifying-glass"></i> Search</>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ParkingSearchEditForm;
