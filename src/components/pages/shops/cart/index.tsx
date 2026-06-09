import FooterTwo from "../../../../layouts/footers/FooterTwo"
import HeaderOne from "../../../../layouts/headers/HeaderOne"
import BreadCrumb from "../../../common/BreadCrumb"
import CartArea from "./CartArea"

const Cart = () => {
   return (
      <>
         <HeaderOne />
         <main>
            <BreadCrumb title="Cart Page" sub_title="Cart" />
            <CartArea />
         </main>
         <FooterTwo />
      </>
   )
}

export default Cart

