import React, { useRef, useState, useEffect } from "react";
import Flatpickr from "react-flatpickr";
import {
  TIME_OPTIONS,
  addDaysToDateString,
  formatPrettyDate,
  type PromoData,
} from "../../utils/parkingSearch";
import "./ParkingSearchEditForm.css";

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
  const [vehicleNo, setVehicleNo] = useState("0");
  const [dropPickerDate, setDropPickerDate] = useState<Date[]>(
    dropDatePart ? [new Date(dropDatePart)] : [],
  );
  const [returnPickerDate, setReturnPickerDate] = useState<Date[]>(
    returnDatePart ? [new Date(returnDatePart)] : [],
  );

  const returnFpRef = useRef<{
    flatpickr?: { set: (opt: string, val: unknown) => void };
  } | null>(null);

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
      <div className="parking-search-form-wrapper">
        <form onSubmit={onSubmit}>
          <div className="row g-3 booking-form-row">
            {/* Airport */}
            <div className="col-12 col-md-6 col-lg-3">
              <label className="parking-form-label">
                <i
                  className="fa-regular fa-location-dot me-1"
                ></i>
                Airport
              </label>
              <select
                value={selectedAirport}
                onChange={(e) => onAirportChange(e.target.value)}
                className="parking-form-input"
              >
                {AIRPORTS.map((a) => (
                  <option key={a.value} value={a.value}>
                    {a.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Drop-off date */}
            <div className="col-12 col-md-6 col-lg-3">
              <label className="parking-form-label">
                <i
                  className="fa-regular fa-calendar me-1"
                ></i>
                Drop-off date
              </label>
              <div className="parking-datepicker-wrapper">
                <Flatpickr
                  value={dropPickerDate}
                  onChange={handleDropDateChange}
                  options={{ dateFormat: "d/m/Y", minDate: "today" }}
                  className="parking-form-input"
                  placeholder="dd/mm/yyyy"
                />
              </div>
            </div>

            {/* Drop-off time */}
            <div className="col-12 col-md-6 col-lg-3">
              <label className="parking-form-label">
                <i
                  className="fa-regular fa-clock me-1"
                ></i>
                Drop-off time
              </label>
              <select
                value={dropTimePart}
                onChange={(e) =>
                  onDropDateStateChange(`${dropDatePart} ${e.target.value}`)
                }
                className="parking-form-input"
              >
                {TIME_OPTIONS.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Return date */}
            <div className="col-12 col-md-6 col-lg-3">
              <label className="parking-form-label">
                <i
                  className="fa-regular fa-calendar-check me-1"
                ></i>
                Return date
              </label>
              <Flatpickr
                ref={returnFpRef as any}
                value={returnPickerDate}
                onChange={handleReturnDateChange}
                options={{
                  dateFormat: "d/m/Y",
                  minDate: dropDatePart ? new Date(dropDatePart) : "today",
                }}
                className="parking-form-input"
                placeholder="dd/mm/yyyy"
              />
            </div>

            {/* Return time */}
            <div className="col-12 col-md-6 col-lg-3">
              <label className="parking-form-label">
                <i
                  className="fa-regular fa-clock me-1"
                ></i>
                Return time
              </label>
              <select
                value={returnTimePart}
                onChange={(e) =>
                  onReturnDateStateChange(`${returnDatePart} ${e.target.value}`)
                }
                className="parking-form-input"
              >
                {TIME_OPTIONS.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Vehicle No */}
            <div className="col-12 col-md-6 col-lg-2">
              <label className="parking-form-label">
                <i
                  className="fa-solid fa-car me-1"
                ></i>
                Vehicle No
              </label>

              <select
                value={vehicleNo}
                onChange={(e) => setVehicleNo(e.target.value)}
                className="parking-form-input"
              >
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
            </div>

            {/* Promo code */}
            <div className="col-12 col-md-6 col-lg-3">
              <label className="parking-form-label">
                <i
                  className="fa-solid fa-tag me-1"
                ></i>
                Promo code
              </label>
              <input
                type="text"
                placeholder="Enter code"
                value={promoCode}
                onChange={(e) =>
                  onPromoCodeChange(e.target.value.toUpperCase())
                }
                className="parking-form-input"
              />
              {promoError && (
                <small className="parking-form-error">
                  {promoError}
                </small>
              )}
              {promoData && (
                <small className="parking-form-success">
                  ✓ {promoData.discount_value}
                  {promoData.discount_type === "percentage" ? "%" : "£"} off
                  applied
                </small>
              )}
            </div>

            {/* Submit */}
            <div className="col-12 col-lg-auto">
              <button
                type="submit"
                className="bk-search-button parking-submit-btn"
                disabled={searching}
              >
                {searching ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin"></i> Searching…
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-magnifying-glass"></i> Search
                  </>
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
