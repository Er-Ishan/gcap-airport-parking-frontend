import { useSearchParams } from "react-router-dom";
import BannerFormTwo from "../../common/banner-form/BannerFormTwo"

const BreadCrumb = () => {
   const [searchParams] = useSearchParams();
   const airportSlug = searchParams.get("airport");
   const airportName = airportSlug
      ? airportSlug.charAt(0).toUpperCase() + airportSlug.slice(1)
      : null;

   return (
      <div className="tg-booking-form-area p-relative z-index-1 tg-listing-booking-shadow">
         <img className="tg-booking-4-shape d-none d-lg-block" src="/assets/img/booking/shape.png" alt="shape" />
         <img className="tg-booking-4-shape-2 d-none d-lg-block" src="/assets/img/booking/shape-2.png" alt="shape" />
         <div className="container">
            {airportName && (
               <div className="row">
                  <div className="col-12 pt-25">
                     <h2 style={{ color: "#fff", marginBottom: "4px" }}>{airportName} Airport Parking</h2>
                     <p style={{ color: "rgba(255,255,255,0.75)", marginBottom: "0" }}>
                        Compare and book secure parking at {airportName} Airport
                     </p>
                  </div>
               </div>
            )}
            <div className="row">
               <div className="col-12">
                  <div className="tg-booking-form-item pt-20 pb-10">
                     <BannerFormTwo airport={airportName} />
                  </div>
               </div>
            </div>
         </div>
      </div>
   )
}

export default BreadCrumb
