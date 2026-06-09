import FooterTwo from "../../../../layouts/footers/FooterTwo"
import HeaderOne from "../../../../layouts/headers/HeaderOne"
import BreadCrumb from "../../../common/BreadCrumb"
import WishlistArea from "./WishlistArea"

const Wishlist = () => {
  return (
    <>
      <HeaderOne />
      <main>
        <BreadCrumb title="Wishlist Page" sub_title="Wishlist" />
        <WishlistArea />
      </main>
      <FooterTwo />
    </>
  )
}

export default Wishlist

