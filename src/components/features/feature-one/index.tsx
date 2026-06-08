import FeatureArea from "./FeatureArea"
import BreadCrumb from "./BreadCrumb"
import HeaderOne from "../../../layouts/headers/HeaderOne"
import FooterSix from "../../../layouts/footers/FooterSix"

const FeatureOne = () => {
   return (
      <>
         <HeaderOne />
         <main>
            <BreadCrumb />
            <FeatureArea />
         </main>
         <FooterSix />
      </>
   )
}

export default FeatureOne

