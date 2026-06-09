import HeaderOne from "../../layouts/headers/HeaderOne";
import FooterTwo from "../../layouts/footers/FooterTwo";
import BreadCrumb from "../common/BreadCrumb";
import BookingConfirmation from "./BookingConfirmation";

const BookingConfirmationPage = () => {
    return (
        <>
            <HeaderOne />
            <BreadCrumb title="Booking Confirmation" sub_title="Confirmation" />
            <BookingConfirmation />
            <FooterTwo />
        </>
    );
};

export default BookingConfirmationPage;
