import type { RefObject } from "react";
import type { BookingReceiptData } from "./parkingSearch";

export function formatBookingDate(date: Date | string): string {
    if (!date) return "-";
    const d = typeof date === "string" ? new Date(date) : date;
    if (isNaN(d.getTime())) return String(date);
    return d.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}

export function downloadPdfFromElement(
    element: HTMLElement,
    filename: string,
    _scale?: number
): void {
    const printWindow = window.open("", "_blank", "width=960,height=720");
    if (!printWindow) {
        window.alert("Please allow pop-ups to download the PDF.");
        return;
    }

    printWindow.document.write(`<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>${filename.replace(".pdf", "")}</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: Arial, Helvetica, sans-serif; font-size: 13px; color: #111; padding: 24px; }
    img { max-width: 100%; }
    table { border-collapse: collapse; width: 100%; }
    td, th { padding: 8px; }
    @media print {
      body { padding: 0; }
      .no-print { display: none !important; }
    }
  </style>
</head>
<body>
${element.innerHTML}
</body>
</html>`);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
        printWindow.print();
        printWindow.close();
    }, 600);
}

export function scheduleReceiptSave(
    bookingData: BookingReceiptData | null,
    ref: RefObject<HTMLElement | null>
): () => void {
    if (!bookingData || !ref) return () => {};
    const timer = setTimeout(() => {
        if (ref.current) {
            downloadPdfFromElement(
                ref.current,
                `receipt_${bookingData.booking_id}.pdf`
            );
        }
    }, 5000);
    return () => clearTimeout(timer);
}
