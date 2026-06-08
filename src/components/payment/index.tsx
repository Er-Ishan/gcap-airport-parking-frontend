import HeaderOne from "../../layouts/headers/HeaderOne";
import FooterOne from "../../layouts/footers/FooterOne";
import BreadCrumb from "../common/BreadCrumb";
import PaymentPage from "./PaymentPage";

const PaymentPageWrapper = () => {
    return (
        <>
            <HeaderOne />
            <BreadCrumb title="Secure Payment" sub_title="Payment" />
            <PaymentPage />
            <FooterOne />
        </>
    );
};

export default PaymentPageWrapper;
