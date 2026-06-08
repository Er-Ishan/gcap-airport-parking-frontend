import NavMenu from "./Menu/NavMenu"
import { Link } from "react-router-dom";
import { useState } from "react";
import Offcanvas from "./Menu/Offcanvas";
import Sidebar from "./Menu/Sidebar";
import UseSticky from "../../hooks/UseSticky";
import PhoneIcon from "../../svg/PhoneIcon";
import UserIcon from "../../svg/UserIcon";

const HeaderSix = () => {

   const { sticky } = UseSticky();
   const [offCanvas, setOffCanvas] = useState<boolean>(false);
   const [sidebar, setSidebar] = useState<boolean>(false);

   return (
      <>
         <header className="tg-header-height">
            <div className={`tg-header__area tg-header-lg-space z-index-999 tg-transparent ${sticky ? "header-sticky" : ""}`} id="header-sticky">
               <div className="container">
                  <div className="row align-items-center">
                     <div className="col-lg-8 col-5">
                        <div className="tgmenu__wrap d-flex align-items-center">
                           <div className="logo flex-auto">
                              <Link className="logo-1" to="/"><img src="/assets/img/logo/logo-white.png" alt="GCAP Airport Parking" /></Link>
                              <Link className="logo-2 d-none" to="/"><img src="/assets/img/logo/logo-green.png" alt="GCAP Airport Parking" style={{ height: "50px", width: "auto" }} /></Link>
                           </div>
                           <nav className="tgmenu__nav ml-90 d-none d-xl-block">
                              <div className="tgmenu__navbar-wrap tgmenu__main-menu d-none d-xl-flex">
                                 <NavMenu />
                              </div>
                           </nav>
                        </div>
                     </div>
                     <div className="col-lg-4 col-7">
                        <div className="tg-menu-right-action d-flex align-items-center justify-content-end">
                           <div className="tg-header-contact-info d-flex align-items-center">
                              <span className="tg-header-contact-icon mr-10 d-none d-xl-block">
                                 <PhoneIcon />
                              </span>
                              <div className="tg-header-contact-number d-none d-xl-block" style={{ whiteSpace: "nowrap" }}>
                                 <span>Call Us:</span>
                                 <Link to="tel:+441234567890">+44 1234 567890</Link>
                              </div>
                           </div>
                           <div className="tg-header-btn ml-20 d-none d-sm-block">
                              <Link className="tg-btn-header" to="/login">
                                 <span><UserIcon /></span>
                                 Login
                              </Link>
                           </div>
                           <div className="tg-header-menu-bar lh-1 p-relative ml-20 pl-20">
                              <button onClick={() => setSidebar(true)} style={{ cursor: "pointer" }} className="tgmenu-offcanvas-open-btn menu-tigger d-none d-xl-block">
                                 <span></span>
                                 <span></span>
                                 <span></span>
                              </button>
                              <button onClick={() => setOffCanvas(true)} style={{ cursor: "pointer" }} className="tgmenu-offcanvas-open-btn mobile-nav-toggler d-block d-xl-none">
                                 <span></span>
                                 <span></span>
                                 <span></span>
                              </button>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </header>
         <Sidebar sidebar={sidebar} setSidebar={setSidebar} />
         <Offcanvas offCanvas={offCanvas} setOffCanvas={setOffCanvas} />
      </>
   )
}

export default HeaderSix
