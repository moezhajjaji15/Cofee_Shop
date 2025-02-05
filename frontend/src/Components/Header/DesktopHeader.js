import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import MobileHeader from "./MobileHeader";

const DesktopHeader = () => {
  const [open, setOpen] = useState(false);
  const [showAuthForm, setShowAuthForm] = useState(false);

  const toggleOpen = () => setOpen(!open);
  const toggleAuthForm = () => setShowAuthForm(!showAuthForm);

  return (
    <>
      <nav className="relative px-5 lg:px-10 py-5 lg:py-8 flex justify-between items-center">
        {/* Logo */}
        <NavLink
          className="flex title-font cursor-pointer text-orange-400 text-2xl lg:text-3xl font-nunito font-black items-center mb-4 md:mb-0"
          to="/"
        >
          <i className="fa fa-utensils me-2"></i>
          <h1>Restoran</h1>
        </NavLink>

        {/* Menu pour mobile */}
        <div className="lg:hidden">
          <button
            className="navbar-burger flex items-center text-orange-400"
            onClick={toggleOpen}
          >
            <i className="fa-sharp fa-solid fa-bars text-2xl -mt-3"></i>
          </button>
        </div>

        {/* Menu pour desktop */}
        <ul className="hidden absolute top-1/2 left-1/2 text-orange-400 cursor-pointer text-xl font-normal font-heebo transform -translate-y-1/2 -translate-x-1/2 lg:mx-auto lg:flex lg:items-right lg:w-auto lg:space-x-6">
          <NavLink className="mr-9" to={"/"}>
            Home
          </NavLink>
          <NavLink className="mr-9" to={"/about-us"}>
            About
          </NavLink>
          <NavLink className="mr-9" to={"/services"}>
            Services
          </NavLink>
          <NavLink className="mr-9" to={"/menu"}>
            Menu
          </NavLink>
          <NavLink className="mr-9" to={"/contact-us"}>
            Contact
          </NavLink>
        </ul>

        {/* Boutons de connexion et réservation */}
        <div className="flex items-center space-x-4">
          <button
            className="inline-flex items-center bg-orange-400 border-0 py-2 px-5 focus:outline-none font-bold text-white mt-4 md:mt-0 hover:bg-white hover:text-orange-400 hover:border hover:border-orange-400"
            onClick={toggleAuthForm}
          >
            Connexion
          </button>

          <button className="inline-flex lg:block hidden items-center bg-orange-400 border-0 py-2 px-5 focus:outline-none font-bold text-white mt-4 md:mt-0 hover:bg-white hover:text-orange-400 hover:border hover:border-orange-400">
            Book a table
          </button>
        </div>
      </nav>

      {/* Affichage du header mobile */}
      {open && <MobileHeader toggleOpen={toggleOpen} />}

      {/* Affichage du formulaire d'authentification */}
      {showAuthForm && <AuthPage closeAuthForm={toggleAuthForm} />}
    </>
  );
};

const AuthPage = ({ closeAuthForm }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "", // Champ mobile pour l'inscription
    password: "",
    confirmPassword: "",
  });

  const toggleForm = () => setIsLogin(!isLogin);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isLogin && formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    // Logique de soumission du formulaire
    alert("Form submitted successfully!");
  };

  return (
    <div
      className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center"
      style={{ zIndex: 1000 }}
    >
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 relative">
        {/* Bouton de fermeture */}
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
          onClick={closeAuthForm}
        >
          &times;
        </button>

        {/* Titre du formulaire */}
        <h1 className="font-nunito hero-text font-black text-orange-400 text-2xl lg:text-3xl mb-4 text-center">
          {isLogin ? "Login" : "Signup"} to <span className="text-orange-400">Restoran</span>
        </h1>

        {/* Formulaire */}
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              {/* Prénom */}
              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2" htmlFor="firstName">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  placeholder="Enter your first name"
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </div>

              {/* Nom de famille */}
              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2" htmlFor="lastName">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  placeholder="Enter your last name"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>
            </>
          )}

          {/* Email */}
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          {/* Mobile (uniquement pour l'inscription) */}
          {!isLogin && (
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2" htmlFor="mobile">
                Mobile
              </label>
              <input
                type="tel"
                id="mobile"
                name="mobile"
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                placeholder="Enter your mobile number"
                value={formData.mobile}
                onChange={handleChange}
              />
            </div>
          )}

          {/* Mot de passe */}
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          {/* Confirmation du mot de passe (uniquement pour l'inscription) */}
          {!isLogin && (
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>
          )}

          {/* Bouton de soumission */}
          <button
            type="submit"
            className="w-full text-orange-400 font-bold shadow-lg bg-white border-2 border-orange-400 px-4 py-2 rounded-lg focus:outline-none hover:bg-orange-400 hover:text-white"
          >
            {isLogin ? "Login" : "Signup"}
          </button>
        </form>

        {/* Lien pour basculer entre connexion et inscription */}
        <p className="text-center text-gray-500 text-sm mt-4">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button
            className="text-orange-400 font-bold ml-1"
            onClick={toggleForm}
          >
            {isLogin ? "Signup" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default DesktopHeader;