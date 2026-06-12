declare module "html2pdf.js" {
    interface Html2PdfOptions {
        margin?: number;
        filename?: string;
        image?: { type?: string; quality?: number };
        html2canvas?: { scale?: number };
        jsPDF?: { unit?: string; format?: string; orientation?: string };
    }

    interface Html2PdfWorker {
        set(options: Html2PdfOptions): Html2PdfWorker;
        from(element: HTMLElement): Html2PdfWorker;
        save(): Promise<void>;
        outputPdf(type: string): Promise<string>;
    }

    function html2pdf(): Html2PdfWorker;
    export default html2pdf;
}
