import BookingForm from "./BookingForm"
import Banner from "./Banner"
import Ads from "./Ads"
import Listing from "./Listing"
import CtaThree from "./Cta"
import Choose from "./Choose"
import Cta from "./CtaTwo"
import Location from "./Location"
import CtaTwo from "./CtaThree"
import Counter from "./Counter"
import Testimonial from "../home-seven/Testimonial"
import Blog from "./Blog"
import Brand from "../home-seven/Brand"
import HeaderOne from "../../../layouts/headers/HeaderOne"
import FooterTwo from '../../../layouts/footers/FooterTwo'

const HomeSix = () => {
  return (
    <>
      <HeaderOne />
      <main>
        <BookingForm />
        <Banner />
        <Ads />
        <Listing />
        <Choose />
        <Cta />
        <Location />
        <CtaTwo />
        <Counter />
        <CtaThree />
        <Testimonial />
        <Brand />
        <Blog />
      </main>
      <FooterTwo />
    </>
  )
}

export default HomeSix

