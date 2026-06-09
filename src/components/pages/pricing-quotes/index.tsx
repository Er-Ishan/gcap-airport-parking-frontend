import HeaderOne from "../../../layouts/headers/HeaderOne";
import FooterTwo from "../../../layouts/footers/FooterTwo";
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
         <FooterTwo />
      </>
   );
};

export default PricingQuotes;
