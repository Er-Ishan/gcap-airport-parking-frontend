import Hero from "./Hero"
import Choose from "./Choose"
import Counter from "./Counter"
import Ads from "./Ads"
import Testimonial from "../home-four/Testimonial"
import Blog from "./Blog"
import CtaTwo from "./CtaTwo"
import Listing from "./Listing"
import Location from "./Location"
import CtaThree from "./CtaThree"
import FooterTwo from '../../../layouts/footers/FooterTwo'
import HeaderOne from "../../../layouts/headers/HeaderOne"

const HomeFive = () => {
   return (
      <>
         <HeaderOne />
         <Hero />
         <Location />
         <CtaThree />
         <Choose />
         <Counter />
         <Listing />
         <Ads />
         <Testimonial style={true} />
         <Blog />
         <CtaTwo />
         <FooterTwo />
      </>
   )
}

export default HomeFive

