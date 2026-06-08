import Banner from './Banner'
import Listing from './Listing'
import Choose from './Choose'
import Location from './Location'
import Process from './Process'
import Pricing from './Pricing'
import Counter from './Counter'
import Cta from './Cta'
import Testimonial from './Testimonial'
import Blog from '../home-one/Blog'
import HeaderOne from "../../../layouts/headers/HeaderOne"
import FooterTwo from '../../../layouts/footers/FooterTwo'

const HomeTwo = () => {
   return (
      <>
         <HeaderOne />
         <main>
            <Banner />
            <Listing />
            <Choose />
            <Location />
            <Process />
            <Pricing />
            <Counter />
            <Cta />
            <Testimonial />
            <Blog style={true} />
         </main>
         <FooterTwo />
      </>
   )
}

export default HomeTwo

