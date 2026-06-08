import type { ParkingProduct, PromoData } from "../utils/parkingSearch";

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

const MOCK_PRODUCTS: ParkingProduct[] = [
    {
        id: 1,
        product_name: "Purple Parking Meet & Greet",
        service_type: "Meet & Greet",
        nonflex: "Refundable",
        image_data: "/assets/img/banner/thumb.jpg",
        point_1: "Professional valet driver at departures",
        point_2: "CCTV monitored secure compound",
        point_3: "Flight monitoring included",
        point_4: "Free cancellation",
        point_5: "Fast Track available",
    },
    {
        id: 2,
        product_name: "APH Airport Parking",
        service_type: "Park & Ride",
        nonflex: "Refundable",
        image_data: "/assets/img/banner/banner-2/thumb.jpg",
        point_1: "Free regular shuttle to terminal",
        point_2: "CCTV monitored car park",
        point_3: "Covered parking available",
        point_4: "Free cancellation",
        point_5: "Disabled access",
    },
    {
        id: 3,
        product_name: "Official On-Airport Car Park",
        service_type: "On-Airport",
        nonflex: "Non-Refundable",
        image_data: "/assets/img/about/about.jpg",
        point_1: "Walk to terminal in minutes",
        point_2: "24/7 uniformed security",
        point_3: "Covered multi-storey",
        point_4: "EV charging points",
        point_5: "Accessible bays available",
    },
    {
        id: 4,
        product_name: "NCP Long Stay Parking",
        service_type: "Park & Walk",
        nonflex: "Refundable",
        image_data: "/assets/img/about/about-2.jpg",
        point_1: "3-minute walk to terminal",
        point_2: "CCTV monitored open-air",
        point_3: "Online booking",
        point_4: "Free cancellation",
    },
    {
        id: 5,
        product_name: "Maple Manor Meet & Greet",
        service_type: "Meet & Greet",
        nonflex: "Refundable",
        image_data: "/assets/img/about/about-3.jpg",
        point_1: "Driver meets you at check-in",
        point_2: "Fully covered secure storage",
        point_3: "24/7 security patrols",
        point_4: "Free cancellation",
        point_5: "Priority return at arrivals",
    },
    {
        id: 6,
        product_name: "Tourex Airport Parking",
        service_type: "Park & Ride",
        nonflex: "Non-Refundable",
        image_data: "/assets/img/about/about-4.jpg",
        point_1: "Regular shuttle service",
        point_2: "CCTV monitored",
        point_3: "Disabled access",
        point_4: "Open-air parking",
    },
];

const MOCK_PRICING: Record<number, number> = {
    1: 64.99,
    2: 52.00,
    3: 110.00,
    4: 42.00,
    5: 71.00,
    6: 38.50,
};

const MOCK_TERMINALS = [
    { terminal_id: 1, terminal_name: "Terminal 1" },
    { terminal_id: 2, terminal_name: "Terminal 2" },
    { terminal_id: 3, terminal_name: "Terminal 3" },
    { terminal_id: 4, terminal_name: "Terminal 4" },
    { terminal_id: 5, terminal_name: "Terminal 5" },
];

export async function searchParkingDeals(
    _dropDate: string,
    _returnDate: string,
    _airport: string,
    promoCode?: string
): Promise<ParkingSearchResult> {
    let promoData: PromoData | null = null;
    let promoError = "";

    if (promoCode?.trim()) {
        if (promoCode.trim().toUpperCase() === "SAVE10") {
            promoData = { discount_type: "percentage", discount_value: 10 };
        } else if (promoCode.trim().toUpperCase() === "FLAT5") {
            promoData = { discount_type: "fixed", discount_value: 5 };
        } else {
            promoError = "Promo code not available or expired";
        }
    }

    return {
        products: MOCK_PRODUCTS,
        pricing: MOCK_PRICING,
        promoData,
        promoError,
        loadError: "",
    };
}

export async function fetchProductById(id: number): Promise<Record<string, unknown> | null> {
    const product = MOCK_PRODUCTS.find((p) => p.id === id);
    if (!product) return null;
    return {
        ...product,
        service_provider: "GCAP Parking",
        product_name: product.product_name,
        service_type: product.service_type,
        nonflex: product.nonflex,
    };
}

export async function fetchTerminalsByProduct(_productId: number) {
    return MOCK_TERMINALS;
}

export async function fetchBookingFees(): Promise<number> {
    return 1.99;
}

export async function fetchCancellationCharge(): Promise<CancellationCharge | null> {
    return { is_enabled: 1, price: "4.99" };
}

export async function createBooking(
    _payload: Record<string, unknown>
): Promise<{ success: boolean; booking_id?: number; message?: string }> {
    const mockBookingId = Math.floor(Math.random() * 90000) + 10000;
    return { success: true, booking_id: mockBookingId };
}

export function applyPromoDiscount(basePrice: number, promo: PromoData | null): number {
    if (!promo || !basePrice) return basePrice;
    return promo.discount_type === "percentage"
        ? basePrice - (basePrice * Number(promo.discount_value)) / 100
        : basePrice - Number(promo.discount_value);
}

export async function validatePromoCode(
    code: string
): Promise<{ valid: boolean; promo?: PromoData; error?: string }> {
    if (!code.trim()) return { valid: true };
    if (code.trim().toUpperCase() === "SAVE10") {
        return { valid: true, promo: { discount_type: "percentage", discount_value: 10 } };
    }
    if (code.trim().toUpperCase() === "FLAT5") {
        return { valid: true, promo: { discount_type: "fixed", discount_value: 5 } };
    }
    return { valid: false, error: "Promo code not available or expired" };
}
