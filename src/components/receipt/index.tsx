import HeaderOne from "../../layouts/headers/HeaderOne";
import FooterTwo from "../../layouts/footers/FooterTwo";
import BreadCrumb from "../common/BreadCrumb";
import Receipt from "./Receipt";

const ReceiptPage = () => {
    return (
        <>
            <HeaderOne />
            <BreadCrumb title="Booking Receipt" sub_title="Receipt" />
            <main>
                <Receipt />
            </main>
            <FooterTwo />
        </>
    );
};

export default ReceiptPage;
