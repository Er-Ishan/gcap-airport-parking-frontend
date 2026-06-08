import BookingConfirmationPage from "../components/booking-confirmation";
import SEO from "../components/SEO";
import Wrapper from "../layouts/Wrapper";

const BookingConfirmationMain = () => {
    return (
        <Wrapper>
            <SEO pageTitle="Booking Confirmed" />
            <BookingConfirmationPage />
        </Wrapper>
    );
};

export default BookingConfirmationMain;
