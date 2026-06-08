import Breadcrumb from "./Breadcrumb"
import FeatureDetailsArea from "./FeatureDetailsArea"
import FeatureAboutArea from "./FeatureAboutArea"
import HeaderOne from "../../../layouts/headers/HeaderOne"
import FooterSix from "../../../layouts/footers/FooterSix"

const FeatureDetailsOne = () => {
   return (
      <>
         <HeaderOne />
         <main>
            <Breadcrumb />
            <FeatureDetailsArea />
            <FeatureAboutArea />
         </main>
         <FooterSix />
      </>
   )
}

export default FeatureDetailsOne

