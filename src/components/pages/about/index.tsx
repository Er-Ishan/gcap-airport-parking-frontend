import FooterTwo from "../../../layouts/footers/FooterTwo"
import HeaderOne from "../../../layouts/headers/HeaderOne"
import BreadCrumb from "../../common/BreadCrumb"
import AboutArea from "./AboutArea"
import Choose from "./Choose"
import Cta from "./Cta"

const About = () => {
   return (
      <>
         <HeaderOne />
         <main>
            <BreadCrumb title="About Us" sub_title="About Us" />
            <AboutArea />
            <Choose />
            <Cta />
         </main>
         <FooterTwo />
      </>
   )
}

export default About

