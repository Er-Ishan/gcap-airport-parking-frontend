import BlogDetailsArea from "./BlogDetailsArea"
import FooterTwo from "../../../layouts/footers/FooterTwo"
import HeaderOne from "../../../layouts/headers/HeaderOne"
import BreadCrumb from "../../common/BreadCrumb"

const BlogDetails = () => {
  return (
    <>
      <HeaderOne />
      <main>
        <BreadCrumb title="Blog Details" sub_title="Exploring The Green Spac Realar Residence Area Harmony" />
        <BlogDetailsArea />
      </main>
      <FooterTwo />
    </>
  )
}

export default BlogDetails

