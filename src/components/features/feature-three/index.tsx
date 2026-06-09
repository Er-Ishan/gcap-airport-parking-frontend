import FeatureArea from "./FeatureArea"
import BreadCrumb from "./BreadCrumb"
import HeaderOne from "../../../layouts/headers/HeaderOne"
import FooterTwo from '../../../layouts/footers/FooterTwo'

const FeatureThree = () => {
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

export default FeatureThree

