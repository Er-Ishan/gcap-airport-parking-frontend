import PricingQuotes from "../components/pages/pricing-quotes";
import SEO from "../components/SEO";
import Wrapper from "../layouts/Wrapper";

const PricingQuotesMain = () => {
   return (
      <Wrapper>
         <SEO pageTitle="Parking Pricing Quotes" />
         <PricingQuotes />
      </Wrapper>
   );
};

export default PricingQuotesMain;
