import Banner from "./Banner"
import FoodArea from "./FoodArea"
import Cta from "./Cta"
import Counter from "./Counter"
import ChooseArea from "./ChooseArea"
import Location from "./Location"
import Testimonial from "./Testimonial"
import Brand from "./Brand"
import Blog from "../home-three/Blog"
import Listing from "./Listing"
import CtaTwo from "../home-one/Cta"
import HeaderOne from "../../../layouts/headers/HeaderOne"
import FooterTwo from '../../../layouts/footers/FooterTwo'

const HomeSeven = () => {
   return (
      <>
         <HeaderOne />
         <main>
            <Banner />
            <FoodArea />
            <Listing />
            <Cta />
            <Counter />
            <ChooseArea />
            <Location />
            <Testimonial />
            <Brand />
            <Blog />
            <CtaTwo/>
         </main>
         <FooterTwo />
      </>
   )
}

export default HomeSeven

