import BookingFormPage from "../components/booking-form";
import SEO from "../components/SEO";
import Wrapper from "../layouts/Wrapper";

const BookingFormMain = () => {
    return (
        <Wrapper>
            <SEO pageTitle="Complete Your Booking" />
            <BookingFormPage />
        </Wrapper>
    );
};

export default BookingFormMain;
