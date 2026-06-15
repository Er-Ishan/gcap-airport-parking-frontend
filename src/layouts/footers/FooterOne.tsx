import { Link } from "react-router-dom";

const FooterOne = () => {
   return (
      <footer>
         <div className="tg-footer-area tg-footer-one-bg tg-footer-space">
            <div className="container">
               <div className="tg-footer-top mb-45">
                  <div className="row g-4">

                     {/* Logo + newsletter + socials */}
                     <div className="col-lg-5 col-md-12 col-12">
                        <div className="tg-footer-widget mb-40" style={{ maxWidth: "420px" }}>
                           <div className="tg-footer-logo mb-20">
                              <Link to="/"><img src="/assets/img/logo/logo-white.png" alt="GCAP Airport Parking" style={{ height: "100px", width: "auto" }} /></Link>
                           </div>
                           <p className="mb-20">Your trusted airport parking partner. Book secure, affordable parking at airports across the UK.</p>
                           <div className="tg-footer-form mb-30">
                              <form onSubmit={(e) => e.preventDefault()}>
                                 <input type="email" placeholder="Enter your email" />
                                 <button className="tg-footer-form-btn" type="submit">
                                    <svg width="22" height="17" viewBox="0 0 22 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                       <path d="M1.52514 8.47486H20.4749M20.4749 8.47486L13.5 1.5M20.4749 8.47486L13.5 15.4497" stroke="white" strokeWidth="1.77778" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                 </button>
                              </form>
                           </div>
                           <div className="tg-footer-social">
                              <Link to="#"><i className="fa-brands fa-facebook-f"></i></Link>
                              <Link to="#"><i className="fa-brands fa-twitter"></i></Link>
                              <Link to="#"><i className="fa-brands fa-instagram"></i></Link>
                              <Link to="#"><i className="fa-brands fa-pinterest-p"></i></Link>
                              <Link to="#"><i className="fa-brands fa-youtube"></i></Link>
                           </div>
                        </div>
                     </div>

                     {/* Quick Links */}
                     <div className="col-lg-3 col-md-6 col-12">
                        <div className="tg-footer-widget tg-footer-link mb-40">
                           <h3 className="tg-footer-widget-title mb-25">Quick Links</h3>
                           <ul>
                              <li><Link to="/">Home</Link></li>
                              <li><Link to="/about">About Us</Link></li>
                              <li><Link to="/faq">FAQ</Link></li>
                              <li><Link to="/contact">Contact Us</Link></li>
                              <li><Link to="/terms-and-conditions">Terms & Conditions</Link></li>
                              <li><Link to="/privacy-policy">Privacy Policy</Link></li>
                           </ul>
                        </div>
                     </div>

                     {/* Contact Info */}
                     <div className="col-lg-4 col-md-6 col-12">
                        <div className="tg-footer-widget tg-footer-info mb-40">
                           <h3 className="tg-footer-widget-title mb-25">Information</h3>
                           <ul>
                              <li>
                                 <Link className="tg-info-item" to="https://www.google.com/maps">
                                    <span className="tg-info-icon">
                                       <svg width="20" height="24" viewBox="0 0 20 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                          <path d="M19.0013 10.0608C19.0013 16.8486 10.3346 22.6668 10.3346 22.6668C10.3346 22.6668 1.66797 16.8486 1.66797 10.0608C1.66797 7.74615 2.58106 5.52634 4.20638 3.88965C5.83169 2.25297 8.03609 1.3335 10.3346 1.3335C12.6332 1.3335 14.8376 2.25297 16.4629 3.88965C18.0882 5.52634 19.0013 7.74615 19.0013 10.0608Z" stroke="white" strokeWidth="1.73333" strokeLinecap="round" strokeLinejoin="round" />
                                          <path d="M10.3346 12.9699C11.9301 12.9699 13.2235 11.6674 13.2235 10.0608C13.2235 8.45412 11.9301 7.15168 10.3346 7.15168C8.73915 7.15168 7.44575 8.45412 7.44575 10.0608C7.44575 11.6674 8.73915 12.9699 10.3346 12.9699Z" stroke="white" strokeWidth="1.73333" strokeLinecap="round" strokeLinejoin="round" />
                                       </svg>
                                    </span>
                                    United Kingdom
                                 </Link>
                              </li>
                              <li>
                                 <Link className="tg-info-item" to="tel:+441234567890">
                                    <span className="tg-info-icon">
                                       <i className="fa-sharp text-white fa-solid fa-phone"></i>
                                    </span>
                                    +44 1234 567890
                                 </Link>
                              </li>
                              <li>
                                 <div className="tg-info-item">
                                    <span className="tg-info-icon">
                                       <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                          <path d="M11.9987 5.60006V12.0001L16.2654 14.1334M22.6654 12.0002C22.6654 17.8912 17.8897 22.6668 11.9987 22.6668C6.10766 22.6668 1.33203 17.8912 1.33203 12.0002C1.33203 6.10912 6.10766 1.3335 11.9987 1.3335C17.8897 1.3335 22.6654 6.10912 22.6654 12.0002Z" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                       </svg>
                                    </span>
                                    <p className="mb-0">
                                       Mon – Sat: 8 am – 5 pm,<br />
                                       Sunday: <span className="text-white d-inline-block">CLOSED</span>
                                    </p>
                                 </div>
                              </li>
                           </ul>
                        </div>
                     </div>

                  </div>
               </div>
            </div>
            <div className="tg-footer-copyright" style={{ padding: "28px 15px", margin: "0 100px" }}>
               <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
                  <p style={{ margin: 0, color: "#ffffff" }}>
                     Copyright <Link to="#">©GCAP Airport Parking</Link> | All Rights Reserved
                  </p>
                  <p style={{ margin: 0, fontSize: "14px", fontWeight: 600, textAlign: "right", color: "#ffffff" }}>
                     This site is developed and maintained by{" "}
                     <a href="https://techbaba.co.uk/" target="_blank" rel="noopener noreferrer" style={{ fontWeight: 700, textDecoration: "none", color: "#67a71e" }}>
                        Tech Baba
                     </a>
                  </p>
               </div>
            </div>
         </div>
      </footer>
   );
};

export default FooterOne;
