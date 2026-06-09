import FooterTwo from "../../../layouts/footers/FooterTwo"
import HeaderOne from "../../../layouts/headers/HeaderOne"
import BreadCrumb from "../../common/BreadCrumb"
import ErrorArea from "./ErrorArea"

const NotFound = () => {
  return (
    <>
      <HeaderOne />
      <main>
        <BreadCrumb title="404 Error Page" sub_title="404" />
        <ErrorArea />
      </main>
      <FooterTwo />
    </>
  )
}

export default NotFound

