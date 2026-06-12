import type { ParkingProduct, PromoData } from "../utils/parkingSearch";

const API = import.meta.env.VITE_API_URL as string;
const INTERNAL_KEY = import.meta.env.VITE_INTERNAL_API_KEY as string | undefined;
const COMPANY_DOMAIN = import.meta.env.VITE_COMPANY_DOMAIN as string | undefined;

/** Injects X-Company-Domain header so the backend resolves the correct company. */
export function apiFetch(url: string, options: RequestInit = {}): Promise<Response> {
    const headers = new Headers(options.headers as HeadersInit | undefined);
    if (COMPANY_DOMAIN) headers.set("X-Company-Domain", COMPANY_DOMAIN);
    return fetch(url, { ...options, headers });
}

/** Limit parallel API calls so the backend DB pool is not overwhelmed. */
async function mapWithConcurrency<T, R>(
    items: T[],
    limit: number,
    fn: (item: T) => Promise<R>
): Promise<R[]> {
    if (items.length === 0) return [];
    const results = new Array<R>(items.length);
    let nextIndex = 0;

    async function worker() {
        while (nextIndex < items.length) {
            const index = nextIndex++;
            results[index] = await fn(items[index]);
        }
    }

    const workers = Math.min(limit, items.length);
    await Promise.all(Array.from({ length: workers }, () => worker()));
    return results;
}

export async function fetchParkingProducts(
    dropDate: string,
    returnDate: string,
    airport: string
): Promise<ParkingProduct[]> {
    const res = await apiFetch(`${API}/api/parking-product`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dropDate, returnDate, airport }),
    });

    const data = await res.json();
    return Array.isArray(data.data) ? data.data : [];
}

export async function fetchProductPrice(
    productId: number,
    dropoffDate: string,
    returnDate: string
): Promise<number | null> {
    const res = await apiFetch(`${API}/api/calculate-price`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            product_id: productId,
            dropoff_date: dropoffDate,
            return_date: returnDate,
        }),
    });

    if (!res.ok) return null;

    const result = await res.json();
    if (!result.success) return null;

    return Number(result.total_price);
}

export async function validatePromoCode(
    code: string
): Promise<{ valid: boolean; promo?: PromoData; error?: string }> {
    if (!code.trim()) {
        return { valid: true };
    }

    try {
        const res = await apiFetch(`${API}/api/promocode/${encodeURIComponent(code.trim())}`);
        const data = await res.json();

        if (data.success) {
            return { valid: true, promo: data.promo };
        }

        return { valid: false, error: "Promo code not available or expired" };
    } catch {
        return { valid: false, error: "Server error while checking promo" };
    }
}

export interface CancellationCharge {
    is_enabled: number;
    price: string | number;
}

export interface ParkingSearchResult {
    products: ParkingProduct[];
    pricing: Record<number, number>;
    promoData: PromoData | null;
    promoError: string;
    loadError: string;
}

export async function searchParkingDeals(
    dropDate: string,
    returnDate: string,
    airport: string,
    promoCode?: string
): Promise<ParkingSearchResult> {
    let promoData: PromoData | null = null;
    let promoError = "";

    if (promoCode?.trim()) {
        const promoResult = await validatePromoCode(promoCode);
        if (!promoResult.valid) {
            return {
                products: [],
                pricing: {},
                promoData: null,
                promoError: promoResult.error || "Invalid promo code",
                loadError: "",
            };
        }
        promoData = promoResult.promo ?? null;
    }

    try {
        const list = await fetchParkingProducts(dropDate, returnDate, airport);
        const pricing: Record<number, number> = {};

        await mapWithConcurrency(list, 3, async (p) => {
            const price = await fetchProductPrice(p.id, dropDate, returnDate);
            if (price !== null) {
                pricing[p.id] = price;
            }
        });

        return {
            products: list,
            pricing,
            promoData,
            promoError,
            loadError:
                list.length === 0
                    ? "No parking options found for your dates and times. Try different times or dates."
                    : "",
        };
    } catch {
        return {
            products: [],
            pricing: {},
            promoData,
            promoError,
            loadError: "Unable to load parking deals. Please check that the server is running.",
        };
    }
}

export async function fetchCancellationCharge(): Promise<CancellationCharge | null> {
    try {
        const res = await apiFetch(`${API}/api/cancellation/charges`);
        const data = await res.json();
        if (data.success && data.data?.length > 0) {
            return data.data[0];
        }
    } catch {
        /* ignore */
    }
    return null;
}

export async function fetchBookingFees(): Promise<number> {
    try {
        const res = await apiFetch(`${API}/api/booking-fees`);
        const data = await res.json();
        if (data.success) {
            return Number(data.booking_fees || 0);
        }
    } catch {
        /* ignore */
    }
    return 0;
}

export async function fetchProductById(id: number) {
    const res = await apiFetch(`${API}/api/parking-product/${id}`);
    const data = await res.json();
    return data.success ? data.data : null;
}

export async function fetchTerminalsByProduct(productId: number) {
    const res = await apiFetch(`${API}/api/data/terminals-by-product/${productId}`);
    return res.json();
}

export async function createBooking(
    payload: Record<string, unknown>
): Promise<{ success: boolean; booking_id?: number; message?: string }> {
    const res = await apiFetch(`${API}/api/create-booking`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    return res.json();
}

export async function completeBookingAfterPayment(payload: {
    booking_id: number | string;
    transaction_id: string;
    payment_method_id: string | null;
}): Promise<{ success: boolean; ref_no?: string; message?: string }> {
    const res = await apiFetch(`${API}/api/create-booking-after-payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    return res.json();
}

export async function notifyPaymentSessionExpired(
    bookingId: number | string
): Promise<{ success: boolean; payment_link?: string }> {
    const fallbackLink = `/retry-payment/${bookingId}`;

    if (!INTERNAL_KEY) {
        return { success: true, payment_link: fallbackLink };
    }

    try {
        const res = await apiFetch(`${API}/api/stripe/payment-session-expired`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-internal-api-key": INTERNAL_KEY,
            },
            body: JSON.stringify({ booking_id: bookingId }),
        });
        const data = await res.json();
        return {
            ...data,
            payment_link: data.payment_link || fallbackLink,
        };
    } catch {
        return { success: true, payment_link: fallbackLink };
    }
}

export interface CompanyInfo {
    name: string;
    support_email_address: string | null;
    mobile_no: string | null;
    ref_prefix: string;
}

export interface AirportOption {
    airport_id: number;
    airport_name: string;
    iata_code: string;
}

export async function fetchAirports(): Promise<AirportOption[]> {
    try {
        const res = await apiFetch(`${API}/api/data/airports`);
        const data = await res.json();
        if (data.success && Array.isArray(data.airports)) return data.airports;
    } catch {
        /* ignore */
    }
    return [];
}

export async function fetchCompanyInfo(): Promise<CompanyInfo | null> {
    try {
        const res = await apiFetch(`${API}/api/company-info`);
        const data = await res.json();
        if (data.success) return data.company as CompanyInfo;
    } catch {
        /* ignore */
    }
    return null;
}

export function applyPromoDiscount(basePrice: number, promo: PromoData | null): number {
    if (!promo || !basePrice) return basePrice;

    if (promo.discount_type === "percentage") {
        return basePrice - (basePrice * Number(promo.discount_value)) / 100;
    }

    return basePrice - Number(promo.discount_value);
}
