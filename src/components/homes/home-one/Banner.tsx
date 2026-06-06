import BannerFormOne from "../../common/banner-form/BannerFormOne"

const Banner = () => {
   return (
      <div className="tg-hero-area tg-hero-tu-wrapper include-bg" style={{ backgroundImage: `url(/assets/img/hero/tu/banner.jpg)` }}>
         <div className="container">
            <div className="row justify-content-center">
               <div className="col-xl-10">
                  <div className="tg-hero-content text-center">
                     <div className="tg-hero-title-box mb-30">
                        <h2 className="tg-hero-title wow fadeInUp" data-wow-delay=".4s" data-wow-duration=".5s">Compare Airport Parking</h2>
                        <h3 className="tg-hero-tu-title wow fadeInUp" data-wow-delay=".4s" data-wow-duration=".7s">Prices Easily</h3>
                     </div>
                     <div className="tg-booking-form-item tg-booking-tu-wrapper mt-15">
                        <BannerFormOne />
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   )
}

export default Banner
