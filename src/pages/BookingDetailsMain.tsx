import BookingDetailsPage from "../components/booking-details";
import SEO from "../components/SEO";
import Wrapper from "../layouts/Wrapper";

const BookingDetailsMain = () => {
    return (
        <Wrapper>
            <SEO pageTitle="Booking Details | GCAP Airport Parking" />
            <BookingDetailsPage />
        </Wrapper>
    );
};

export default BookingDetailsMain;
