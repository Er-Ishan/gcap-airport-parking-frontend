import FooterSix from '../../../../layouts/footers/FooterSix'
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
         <FooterSix />
      </>
   )
}

export default Shop

