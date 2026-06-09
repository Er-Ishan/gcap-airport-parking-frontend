import About from "./About"
import Banner from "./Banner"
import Blog from "./Blog"
import Choose from "./Choose"
import CtaThree from "./Cta"
import CtaTwo from "./CtaTwo"
import Location from "./Location"
import Testimonial from "./Testimonial"
import Cta from "../home-one/Cta"
import HeaderOne from "../../../layouts/headers/HeaderOne"
import BannerFormThree from "../../common/banner-form/BannerFormThree"
import FooterTwo from '../../../layouts/footers/FooterTwo'
import Listing from"./Listing";

const HomeThree = () => {
   return (
      <>
         <HeaderOne />
         <main>
            <Banner />
            <BannerFormThree />
            <About />
            <Listing />
            <Choose />
            <CtaThree />
            <Location />
            <CtaTwo />
            <Testimonial />
            <Blog />
            <Cta />
         </main>
         <FooterTwo />
      </>
   )
}

export default HomeThree

