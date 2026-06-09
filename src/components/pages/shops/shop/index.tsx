import FooterTwo from '../../../../layouts/footers/FooterTwo'
import HeaderOne from "../../../../layouts/headers/HeaderOne"
import BreadCrumb from '../../../common/BreadCrumb'
import ShopArea from './ShopArea'


const Shop = () => {
   return (
      <>
         <HeaderOne />
         <main>
            <BreadCrumb title="Shop Page" sub_title="Shop Archive Page" />
            <ShopArea />
         </main>
         <FooterTwo />
      </>
   )
}

export default Shop

