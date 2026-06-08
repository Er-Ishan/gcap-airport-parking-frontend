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
import FooterFour from "../../../layouts/footers/FooterFour"

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
         <FooterFour />
      </>
   )
}

export default HomeSeven

