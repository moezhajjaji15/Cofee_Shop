import React from "react";
import contactIMG from "../../assests/img/video.jpg";
import Slide from 'react-reveal/Slide';


const MyContact = () => {

  const duration = 1000;





  return (
    <>
    <section className="text-gray-600 body-font relative">
  <div className="container lg:max-w-[1324px] px-5 py-2 lg:py-14 mx-auto flex sm:flex-nowrap flex-wrap">
    <div className="lg:w-2/3 md:w-1/2  overflow-hidden  flex items-end justify-start ">
      <img className="object-cover h-full w-fit " src={contactIMG} alt="" />
    </div>
    <div className="lg:w-2/3 md:w-1/2 bg-black p-3 lg:p-10 flex flex-col md:ml-auto w-full md:py-8 md:mt-0"> 
    <Slide bottom duration={duration}>     
        <p className='title-font text-orange-400 sec-heading font-medium text-3xl mb-2'>Reservation</p>
        <h1 className='font-nunito hero-text font-black text-white text-2xl mb-3 lg:text-5xl'>Book A Table Online </h1>
          
      <div className="relative mb-4">
        <input type="text" placeholder='Enter Name...' className="w-full bg-white rounded border border-gray-300 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"/>
      </div>
      <div className="relative mb-4">
        <input type="email" placeholder="Enter Email..." className="w-full bg-white rounded border border-gray-300 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"/>
    </div>
      <div className="relative mb-4">
        <textarea placeholder="Special request..."  className="w-full bg-white rounded border border-gray-300  h-32 text-base outline-none text-gray-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"></textarea>
      </div>
      <button className="text-white font-bold bg-orange-400 border-0 py-2 mb-2  lg:text-lg">BOOK NOW</button>
      </Slide>  
    </div>
  </div>
</section>
    </>
  );
};

export default MyContact;
