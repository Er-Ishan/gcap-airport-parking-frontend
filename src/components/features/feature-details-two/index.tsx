import BreadCrumb from "./BreadCrumb"
import TourDetailsArea from "./TourDetailsArea"
import TourAboutDetails from "./TourAboutDetails"
import Listing from "./Listing"
import HeaderOne from "../../../layouts/headers/HeaderOne"
import FooterTwo from '../../../layouts/footers/FooterTwo'

const FeatureDetailsTwo = () => {
   return (
      <>
         <HeaderOne />
         <main>
            <BreadCrumb />
            <TourDetailsArea />
            <TourAboutDetails />
            <Listing />
         </main>
         <FooterTwo />
      </>
   )
}

export default FeatureDetailsTwo

