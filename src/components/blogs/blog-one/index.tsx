import FooterTwo from "../../../layouts/footers/FooterTwo"
import HeaderOne from "../../../layouts/headers/HeaderOne"
import BreadCrumb from "../../common/BreadCrumb"
import BlogArea from "./BlogArea"

const BlogOne = () => {
   return (
      <>
         <HeaderOne />
         <main>
            <BreadCrumb title="Blogs" sub_title="Blog" />
            <BlogArea />
         </main>
         <FooterTwo />
      </>
   )
}

export default BlogOne

