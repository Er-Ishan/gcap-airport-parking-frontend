import PaymentPageWrapper from "../components/payment";
import SEO from "../components/SEO";
import Wrapper from "../layouts/Wrapper";

const PaymentMain = () => {
    return (
        <Wrapper>
            <SEO pageTitle="Secure Payment" />
            <PaymentPageWrapper />
        </Wrapper>
    );
};

export default PaymentMain;
