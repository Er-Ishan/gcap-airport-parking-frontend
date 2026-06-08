import HeaderOne from "../../../layouts/headers/HeaderOne";
import FooterOne from "../../../layouts/footers/FooterOne";
import BreadCrumb from "../../common/BreadCrumb";
import PricingQuotesArea from "./PricingQuotesArea";

const PricingQuotes = () => {
   return (
      <>
         <HeaderOne />
         <main>
            <BreadCrumb title="Parking Pricing Quotes" sub_title="Pricing Quotes" />
            <PricingQuotesArea />
         </main>
         <FooterOne />
      </>
   );
};

export default PricingQuotes;
