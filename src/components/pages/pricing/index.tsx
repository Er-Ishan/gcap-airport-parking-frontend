import PricingArea from "./PricingArea"
import Cta from "./Cta"
import HeaderOne from "../../../layouts/headers/HeaderOne"
import BreadCrumb from "../../common/BreadCrumb"
import FooterTwo from "../../../layouts/footers/FooterTwo"

const Pricing = () => {
  return (
    <>
      <HeaderOne />
      <main>
        <BreadCrumb title="Pricing Plan" sub_title="Pricing Plan" />
        <PricingArea />
        <Cta />
      </main>
      <FooterTwo />
    </>
  )
}

export default Pricing

