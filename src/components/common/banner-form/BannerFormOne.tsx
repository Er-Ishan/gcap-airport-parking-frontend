import { useEffect, useRef, useState } from "react";
import Flatpickr from 'react-flatpickr';

interface DataType {
   id: number;
   title: string;
   count: number
}

const guest_data: DataType[] = [
   {
      id: 1,
      title: "Rooms",
      count: 0
   },
   {
      id: 2,
      title: "Adults",
      count: 0
   },
   {
      id: 3,
      title: "Children",
      count: 0
   },
];
const generateTimeOptions = () => {
   const times = [];

   for (let hour = 0; hour < 24; hour++) {
      for (let min = 0; min < 60; min += 15) {
         const hh = String(hour).padStart(2, "0");
         const mm = String(min).padStart(2, "0");

         times.push(`${hh}:${mm}`);
      }
   }

   return times;
};

const timeOptions = generateTimeOptions();

const BannerFormOne = () => {

   const [airport, setAirport] = useState(false);
   const [checkInDate, setCheckInDate] = useState<Date | Date[]>(new Date());
   const [checkOutDate, setCheckOutDate] = useState<Date | Date[]>(new Date());
   const [dropoffTime, setDropoffTime] = useState("00:00");
   const [dropoffOpen, setDropoffOpen] = useState(false);
   const [returnTime, setReturnTime] = useState("00:00");
   const [returnOpen, setReturnOpen] = useState(false);
   const locationRef = useRef<HTMLDivElement>(null);


   return (
      <form onSubmit={(e) => e.preventDefault()}>
         <div className="tg-booking-form-input-group d-flex align-items-end justify-content-between">
            <div className="tg-booking-form-parent-inner tg-hero-quantity p-relative mr-15 mb-10">
               <span className="tg-booking-form-title">Airport:</span>
               <div ref={locationRef} onClick={() => setAirport((prev) => !prev)} className={`tg-booking-add-input-field tg-booking-quantity-toggle ${location ? "active" : ""} `}>
                  <span className="location">

                  </span>
                  <span className="tg-booking-title-value">Luton</span>

                  <span className="angle-down">
                     <svg width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1.6665 1L6.99984 6.33333L12.3332 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                     </svg>
                  </span>

               </div>
               <div className={`tg-booking-form-location-list tg-booking-quantity-active ${airport ? "tg-list-open" : ""}`}>
                  <ul className="scrool-bar scrool-height pr-5">
                     <li>
                        <i className="fa-regular fa-location-dot"></i>
                        <span>Heathrow</span>
                     </li>
                     <li>
                        <i className="fa-regular fa-location-dot"></i>
                        <span>Gatwick</span>
                     </li>
                     <li>
                        <i className="fa-regular fa-location-dot"></i>
                        <span>Manchester</span>
                     </li>
                     <li>
                        <i className="fa-regular fa-location-dot"></i>
                        <span>Stanted</span>
                     </li>
                     <li>
                        <i className="fa-regular fa-location-dot"></i>
                        <span>Liverpool</span>
                     </li>
                  </ul>
               </div>
            </div>
            <div className="tg-booking-form-parent-inner mr-15 mb-10">
               <span className="tg-booking-form-title">Drop off date:</span>
               <div className="tg-booking-add-input-date p-relative">

                  <Flatpickr
                     value={checkInDate}
                     onChange={(selectedDates) => setCheckInDate(selectedDates)}
                     options={{
                        dateFormat: 'd/m/Y',
                        minDate: 'today',
                     }}
                     className="input"
                     placeholder="dd/mm/yyyy"
                  />
                  <span className="angle-down">
                     <svg width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1.6665 1L6.99984 6.33333L12.3332 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                     </svg>
                  </span>
               </div>
            </div>

            <div className="tg-booking-form-parent-inner tg-hero-quantity p-relative mr-15 mb-10">
               <span className="tg-booking-form-title">Drop Off Time:</span>

               <div
                  onClick={() => setDropoffOpen((prev) => !prev)}
                  className={`tg-booking-add-input-field tg-booking-quantity-toggle ${dropoffOpen ? "active" : ""
                     }`}
               >

                  <span className="tg-booking-title-value">{dropoffTime}</span>

                  <span className="angle-down">
                     <svg width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1.6665 1L6.99984 6.33333L12.3332 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                     </svg>
                  </span>
               </div>

               <div className={`tg-booking-form-location-list tg-booking-quantity-active ${dropoffOpen ? "tg-list-open" : ""
                  }`}>
                  <ul className="scrool-bar scrool-height pr-5">
                     {timeOptions.map((time) => (
                        <li
                           key={time}
                           onClick={() => {
                              setDropoffTime(time);
                              setDropoffOpen(false);
                           }}
                        >
                           <i className="fa-regular fa-clock"></i>
                           <span>{time}</span>
                        </li>
                     ))}
                  </ul>
               </div>
            </div>

            <div className="tg-booking-form-parent-inner mr-15 mb-10">
               <span className="tg-booking-form-title">Return date:</span>
               <div className="tg-booking-add-input-date p-relative">

                  <Flatpickr
                     value={checkOutDate}
                     onChange={(selectedDates) => setCheckOutDate(selectedDates)}
                     options={{
                        dateFormat: 'd/m/Y',
                        minDate: 'today',
                     }}
                     className="input"
                     placeholder="dd/mm/yyyy"
                  />
                  <span className="angle-down">
                     <svg width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1.6665 1L6.99984 6.33333L12.3332 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                     </svg>
                  </span>
               </div>
            </div>

                     <div className="tg-booking-form-parent-inner tg-hero-quantity p-relative mr-15 mb-10">
               <span className="tg-booking-form-title">Return Time:</span>

               <div
                  onClick={() => setReturnOpen((prev) => !prev)}
                  className={`tg-booking-add-input-field tg-booking-quantity-toggle ${returnOpen ? "active" : ""
                     }`}
               >
                  {/* <span className="location">
                     <i className="fa-regular fa-clock"></i>
                  </span> */}

                  <span className="tg-booking-title-value">{returnTime}</span>

                  <span className="angle-down">
                     <svg width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1.6665 1L6.99984 6.33333L12.3332 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                     </svg>
                  </span>
               </div>

               <div className={`tg-booking-form-location-list tg-booking-quantity-active ${returnOpen ? "tg-list-open" : ""
                  }`}>
                  <ul className="scrool-bar scrool-height pr-5">
                     {timeOptions.map((time) => (
                        <li
                           key={time}
                           onClick={() => {
                              setReturnTime(time);
                              setReturnOpen(false);
                           }}
                        >
                           <i className="fa-regular fa-clock"></i>
                           <span>{time}</span>
                        </li>
                     ))}
                  </ul>
               </div>
            </div>

            <div className="tg-booking-form-search-btn mb-10">
               <button className="bk-search-button" type="submit">Get Quote
                  <span className="ml-5">
                     <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clipPath="url(#clip0_53_103)">
                           <path d="M13.2218 13.2222L10.5188 10.5192M12.1959 6.48705C12.1959 9.6402 9.63977 12.1963 6.48662 12.1963C3.33348 12.1963 0.777344 9.6402 0.777344 6.48705C0.777344 3.3339 3.33348 0.777771 6.48662 0.777771C9.63977 0.777771 12.1959 3.3339 12.1959 6.48705Z" stroke="currentColor" strokeWidth="1.575" strokeLinecap="round" strokeLinejoin="round" />
                        </g>
                        <defs>
                           <clipPath id="clip0_53_103">
                              <rect width="14" height="14" fill="currentColor" />
                           </clipPath>
                        </defs>
                     </svg>
                  </span>
               </button>
            </div>
         </div>
      </form>
   )
}

export default BannerFormOne
