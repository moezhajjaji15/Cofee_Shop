import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./Components/Pages/HomePage";
import AboutUsPage from "./Components/Pages/AboutUsPage";
import ContactUsPage from "./Components/Pages/ContactUsPage";
import MenuPage from "./Components/Pages/MenuPage";
import ServicesPage from "./Components/Pages/ServicesPage";
import Footer from "./Components/Footer/Footer";
import AuthPage from "./Components/AuthPage/AuthPage";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route exact path='/' element={<HomePage />} />
          <Route path='/about-us' element={<AboutUsPage />} />
          <Route path='/contact-us' element={<ContactUsPage />} />
          <Route path='/menu' element={<MenuPage />} />
          <Route path='/services' element={<ServicesPage />} />
          <Route path='/auth' element={<AuthPage />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  );
};

export default App;
