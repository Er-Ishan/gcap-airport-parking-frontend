import FaqArea from "./FaqArea"
import Cta from "../pricing/Cta"
import HeaderOne from "../../../layouts/headers/HeaderOne"
import BreadCrumb from "../../common/BreadCrumb"
import FooterTwo from "../../../layouts/footers/FooterTwo"

const Faq = () => {
   return (
      <>
         <HeaderOne />
         <main>
            <BreadCrumb title="Frequently Asked Question" sub_title="Faq’s" />
            <FaqArea />
            <Cta />
         </main>
         <FooterTwo />
      </>
   )
}

export default Faq

