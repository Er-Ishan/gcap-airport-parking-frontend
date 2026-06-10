import { Link } from "react-router-dom";

interface SidebarProps {
   sidebar: boolean;
   setSidebar: (offCanvas: boolean) => void;
}

const Sidebar = ({ sidebar, setSidebar }: SidebarProps) => {
   return (
      <>
         <div className={`offCanvas__info ${sidebar ? "active" : ""}`}>
            <div className="offCanvas__close-icon menu-close">
               <button onClick={() => setSidebar(false)}><i className="fa-sharp fa-regular fa-xmark"></i></button>
            </div>
            <div className="offCanvas__logo mb-20">
               <Link to="/"><img src="/assets/img/logo/logo-green.png" alt="Logo" style={{ height: "180px", width: "auto" }} /></Link>
            </div>
            <div className="offCanvas__side-info mb-30">
               <div className="contact-list mb-30">
                  <h4>Office Address</h4>
                  <p>GCAP Airport Parking <br /> United Kingdom</p>
               </div>
               <div className="contact-list mb-30">
                  <h4>Phone Number</h4>
                  <p>+44 1234 567890</p>
               </div>
               <div className="contact-list mb-30">
                  <h4>Email Address</h4>
                  <p>info@gcap.co.uk</p>
               </div>
            </div>
            <div className="offCanvas__social-icon mt-30">
               <Link to="#"><i className="fab fa-facebook-f"></i></Link>
               <Link to="#"><i className="fab fa-twitter"></i></Link>
               <Link to="#"><i className="fab fa-instagram"></i></Link>
               <Link to="#"><i className="fab fa-youtube"></i></Link>
            </div>
         </div>
         <div onClick={() => setSidebar(false)} className={`offCanvas__overly ${sidebar ? "active" : ""}`}></div>
      </>
   )
}

export default Sidebar
