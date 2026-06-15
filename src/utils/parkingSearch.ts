export const MONTHS = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export function addDays(date: Date, days: number): Date {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
}

export function formatDateForInput(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

export function addDaysToDateString(dateStr: string, days: number): string {
    const d = new Date(dateStr);
    d.setDate(d.getDate() + days);
    return formatDateForInput(d);
}

export function getDefaultDropDate(): string {
    return formatDateForInput(addDays(new Date(), 2));
}

export function getDefaultReturnDate(dropDate?: string): string {
    const base = dropDate ? new Date(dropDate) : addDays(new Date(), 2);
    return formatDateForInput(addDays(base, 7));
}

export function formatPrettyDate(dateStr: string): string {
    if (!dateStr) return "";
    const [y, m, d] = dateStr.split("-");
    return `${MONTHS[Number(m) - 1]} ${Number(d)}, ${y}`;
}

export function formatDateDisplay(dateTime: string): string {
    const datePart = dateTime.split(" ")[0];
    const date = new Date(datePart);
    return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

export function getStoredDateTime(key: string, fallback: string): string {
    const stored = localStorage.getItem(key);
    if (!stored) return fallback;
    const datePart = stored.split(" ")[0];
    const date = new Date(datePart);
    return isNaN(date.getTime()) ? fallback : stored;
}

export function buildDateTime(date: string, time: string): string {
    return `${date} ${time}`;
}

export function splitDateTime(dateTime: string): { date: string; time: string } {
    const parts = dateTime.trim().split(" ");
    return { date: parts[0] || "", time: parts[1] || "04:00" };
}

export interface ParkingProduct {
    id: number;
    product_name: string;
    service_type?: string;
    airport_name?: string;
    image_data?: string | null;
    nonflex?: string;
    point_1?: string | null;
    point_2?: string | null;
    point_3?: string | null;
    point_4?: string | null;
    point_5?: string | null;
    point_6?: string | null;
    product_overview?: string;
    product_description?: string;
    dropoff_procedure?: string;
    return_procedure?: string;
    status?: string;
}

export interface PromoData {
    discount_type: string;
    discount_value: string | number;
}

export interface TimeOption {
    value: string;
    label: string;
}

export const TIME_OPTIONS: TimeOption[] = (() => {
    const opts: TimeOption[] = [];
    for (let hour = 0; hour < 24; hour++) {
        for (let min = 0; min < 60; min += 15) {
            const hh = String(hour).padStart(2, "0");
            const mm = String(min).padStart(2, "0");
            opts.push({ value: `${hh}:${mm}`, label: `${hh}:${mm}` });
        }
    }
    return opts;
})();

export function updateDateTimePart(current: string, newValue: string, part: "date" | "time"): string {
    const [date, time] = current.split(" ");
    return part === "date" ? `${newValue} ${time || "10:00"}` : `${date} ${newValue}`;
}

export interface Terminal {
    terminal_id: number;
    terminal_name: string;
}

export interface BookingLocationState {
    productId: number;
    dropDate: string;
    returnDate: string;
    travelling_from: string;
    basePrice: number;
    discountAmount?: number;
    finalPrice: number;
    promo?: PromoData | null;
    product_overview?: string;
    product_description?: string;
    dropoff_procedure?: string;
    vehicleNo?: string;
}

export interface BookingReceiptData {
    booking_id: number | string;
    transaction_id?: string;
    title?: string;
    first_name: string;
    last_name: string;
    email: string;
    mobile: string;
    vehicle_make?: string;
    vehicle_model?: string;
    vehicle_colour?: string;
    vehicle_registration?: string;
    vehicle_no?: string | number;
    depart_flight?: string;
    depart_terminal?: string;
    return_flight?: string;
    return_terminal?: string;
    product_name: string;
    travelling_from: string;
    service?: string;
    drop_off_date: string;
    return_date: string;
    no_of_days: number;
    quote_amount?: number | string;
    discount?: number | string;
    booking_fee?: number | string;
    total_payable: number | string;
    addons?: {
        cancellation_cover?: boolean;
        [key: string]: unknown;
    };
}
