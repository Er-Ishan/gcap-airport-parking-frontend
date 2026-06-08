import HeaderOne from "../../layouts/headers/HeaderOne";
import FooterOne from "../../layouts/footers/FooterOne";
import BreadCrumb from "../common/BreadCrumb";
import BookingConfirmation from "./BookingConfirmation";

const BookingConfirmationPage = () => {
    return (
        <>
            <HeaderOne />
            <BreadCrumb title="Booking Confirmation" sub_title="Confirmation" />
            <BookingConfirmation />
            <FooterOne />
        </>
    );
};

export default BookingConfirmationPage;
