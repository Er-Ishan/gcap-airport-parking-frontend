import Breadcrumb from "./Breadcrumb"
import FeatureDetailsArea from "./FeatureDetailsArea"
import FeatureAboutArea from "./FeatureAboutArea"
import HeaderOne from "../../../layouts/headers/HeaderOne"
import FooterTwo from '../../../layouts/footers/FooterTwo'

const FeatureDetailsOne = () => {
   return (
      <>
         <HeaderOne />
         <main>
            <Breadcrumb />
            <FeatureDetailsArea />
            <FeatureAboutArea />
         </main>
         <FooterTwo />
      </>
   )
}

export default FeatureDetailsOne

