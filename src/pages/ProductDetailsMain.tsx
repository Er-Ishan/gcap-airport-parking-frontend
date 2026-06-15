import ProductDetails from "../components/pages/product-details";
import SEO from "../components/SEO";
import Wrapper from "../layouts/Wrapper";

const ProductDetailsMain = () => {
   return (
      <Wrapper>
         <SEO pageTitle="Product Details" />
         <ProductDetails />
      </Wrapper>
   );
};

export default ProductDetailsMain;
