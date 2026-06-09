import ReceiptPage from "../components/receipt";
import SEO from "../components/SEO";
import Wrapper from "../layouts/Wrapper";

const ReceiptMain = () => {
    return (
        <Wrapper>
            <SEO pageTitle="Booking Receipt | GCAP Airport Parking" />
            <ReceiptPage />
        </Wrapper>
    );
};

export default ReceiptMain;
