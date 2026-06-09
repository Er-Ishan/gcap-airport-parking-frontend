import FooterTwo from "../../../../layouts/footers/FooterTwo"
import HeaderOne from "../../../../layouts/headers/HeaderOne"
import BreadCrumb from "../../../common/BreadCrumb"
import TeamDetailsArea from "./TeamDetailsArea"

const TeamDetails = () => {
   return (
      <>
         <HeaderOne />
         <main>
            <BreadCrumb title="Esther Howard" sub_title="Esther Howard" />
            <TeamDetailsArea />
         </main>
         <FooterTwo />
      </>
   )
}

export default TeamDetails

