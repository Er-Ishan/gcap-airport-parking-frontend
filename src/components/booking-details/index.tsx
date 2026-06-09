import HeaderOne from "../../layouts/headers/HeaderOne";
import FooterTwo from "../../layouts/footers/FooterTwo";
import BreadCrumb from "../common/BreadCrumb";
import BookingDetails from "./BookingDetails";

const BookingDetailsPage = () => {
    return (
        <>
            <HeaderOne />
            <BreadCrumb title="Booking Details" sub_title="Details" />
            <main>
                <BookingDetails />
            </main>
            <FooterTwo />
        </>
    );
};

export default BookingDetailsPage;
