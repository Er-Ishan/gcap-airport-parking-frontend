import FooterTwo from "../../../../layouts/footers/FooterTwo"
import HeaderOne from "../../../../layouts/headers/HeaderOne"
import BreadCrumb from "../../../common/BreadCrumb"
import CheckoutArea from "./CheckoutArea"

const Checkout = () => {
   return (
      <>
         <HeaderOne />
         <main>
            <BreadCrumb title="Checkout Page" sub_title="Checkout Page" />
            <CheckoutArea />
         </main>
         <FooterTwo />
      </>
   )
}

export default Checkout

