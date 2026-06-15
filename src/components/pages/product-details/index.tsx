import HeaderOne from "../../../layouts/headers/HeaderOne";
import FooterTwo from "../../../layouts/footers/FooterTwo";
import ProductDetailsPage from "./ProductDetailsPage";

const ProductDetails = () => {
   return (
      <>
         <HeaderOne />
         <main>
            <ProductDetailsPage />
         </main>
         <FooterTwo />
      </>
   );
};

export default ProductDetails;
