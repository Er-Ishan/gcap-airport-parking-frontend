import HeaderOne from "../../layouts/headers/HeaderOne";
import FooterOne from "../../layouts/footers/FooterOne";
import BookingForm from "./BookingForm";

const BookingFormPage = () => {
    return (
        <>
            <HeaderOne />
            <main>
                <BookingForm />
            </main>
            <FooterOne />
        </>
    );
};

export default BookingFormPage;
