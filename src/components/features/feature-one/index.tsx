import FeatureArea from "./FeatureArea"
import BreadCrumb from "./BreadCrumb"
import HeaderOne from "../../../layouts/headers/HeaderOne"
import FooterTwo from "../../../layouts/footers/FooterTwo"

const FeatureOne = () => {
   return (
      <>
         <HeaderOne />
         <main>
            <BreadCrumb />
            <FeatureArea />
         </main>
         <FooterTwo />
      </>
   )
}

export default FeatureOne

