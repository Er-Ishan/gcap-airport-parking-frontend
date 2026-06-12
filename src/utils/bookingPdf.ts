import html2pdf from "html2pdf.js";
import type { RefObject } from "react";
import type { BookingReceiptData } from "./parkingSearch";
import { apiFetch } from "../services/parkingApi";

const API = import.meta.env.VITE_API_URL as string;
const INTERNAL_KEY = import.meta.env.VITE_INTERNAL_API_KEY as string | undefined;

const defaultPdfOptions = {
    margin: 0.3,
    image: { type: "jpeg" as const, quality: 1 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: "in" as const, format: "a4" as const, orientation: "portrait" as const },
};

export function formatBookingDate(dateInput?: string | Date): string {
    if (!dateInput) return "-";
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return String(dateInput);
    return date.toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

export async function generatePdfBase64(element: HTMLElement): Promise<string> {
    const pdf = await html2pdf()
        .set(defaultPdfOptions)
        .from(element)
        .outputPdf("datauristring");

    return pdf.split(",")[1];
}

export function downloadPdfFromElement(
    element: HTMLElement,
    filename: string,
    margin = 0.3
): void {
    html2pdf()
        .set({ ...defaultPdfOptions, margin, filename })
        .from(element)
        .save();
}

export async function saveReceiptPdfToDb(
    bookingId: number | string,
    element: HTMLElement
): Promise<boolean> {
    if (!INTERNAL_KEY) return false;

    try {
        const receiptPdf = await generatePdfBase64(element);
        const res = await apiFetch(`${API}/api/save-receipt-pdf`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-internal-api-key": INTERNAL_KEY,
            },
            body: JSON.stringify({
                booking_id: bookingId,
                receipt_pdf: receiptPdf,
            }),
        });
        const data = await res.json();
        return Boolean(data.success);
    } catch {
        return false;
    }
}

export function scheduleReceiptSave(
    bookingData: BookingReceiptData | null,
    ref: RefObject<HTMLElement | null>
): () => void {
    if (!bookingData?.booking_id) return () => undefined;

    const timer = setTimeout(() => {
        if (ref.current) {
            void saveReceiptPdfToDb(bookingData.booking_id, ref.current);
        }
    }, 1000);

    return () => clearTimeout(timer);
}
