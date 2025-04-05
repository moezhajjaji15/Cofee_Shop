import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import MobileHeader from "./MobileHeader";

const DesktopHeader = () => {
  const [open, setOpen] = useState(false);
  const [showAuthForm, setShowAuthForm] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null); // Ajout pour stocker les infos utilisateur
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    
    if (token && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
    }
  }, []);

  const toggleOpen = () => setOpen(!open);
  const toggleAuthForm = () => setShowAuthForm(!showAuthForm);

  const handleLoginSuccess = (token, userData) => {
    setIsAuthenticated(true);
    setUser(userData);
    setShowAuthForm(false);
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

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

        {/* Mobile Menu */}
        <div className="lg:hidden">
          <button
            className="navbar-burger flex items-center text-orange-400"
            onClick={toggleOpen}
          >
            <i className="fa-sharp fa-solid fa-bars text-2xl -mt-3"></i>
          </button>
        </div>

        {/* Desktop Menu */}
        <ul className="hidden absolute top-1/2 left-1/2 text-orange-400 cursor-pointer text-xl font-normal font-heebo transform -translate-y-1/2 -translate-x-1/2 lg:mx-auto lg:flex lg:items-right lg:w-auto lg:space-x-6">
          <NavLink className="mr-9" to={"/"}>Home</NavLink>
          <NavLink className="mr-9" to={"/about-us"}>About</NavLink>
          <NavLink className="mr-9" to={"/services"}>Services</NavLink>
          <NavLink className="mr-9" to={"/menu"}>Menu</NavLink>
          
          {/* Lien Pack conditionnel */}
          {isAuthenticated && (
            <NavLink className="mr-9" to={"/pack"}>Pack</NavLink>
          )}
          
          <NavLink className="mr-9" to={"/contact-us"}>Contact</NavLink>
        </ul>

        {/* Auth Buttons */}
        <div className="flex items-center space-x-4">
          {!isAuthenticated ? (
            <button
              className="inline-flex items-center bg-orange-400 border-0 py-2 px-5 focus:outline-none font-bold text-white mt-4 md:mt-0 hover:bg-white hover:text-orange-400 hover:border hover:border-orange-400"
              onClick={toggleAuthForm}
            >
              Connexion
            </button>
          ) : (
            <>
              <button
                className="inline-flex items-center bg-orange-400 border-0 py-2 px-5 focus:outline-none font-bold text-white mt-4 md:mt-0 hover:bg-white hover:text-orange-400 hover:border hover:border-orange-400"
                onClick={handleLogout}
              >
                Déconnexion
              </button>
              
              {/* Bouton Profile */}
              <NavLink
                to="/profile"
                className="inline-flex lg:block hidden items-center bg-orange-400 border-0 py-2 px-5 focus:outline-none font-bold text-white mt-4 md:mt-0 hover:bg-white hover:text-orange-400 hover:border hover:border-orange-400"
              >
                Profile
              </NavLink>
            </>
          )}
        </div>
      </nav>

      {/* Mobile Header */}
      {open && <MobileHeader toggleOpen={toggleOpen} isAuthenticated={isAuthenticated} />}

      {/* Authentication Form */}
      {showAuthForm && (
        <AuthPage closeAuthForm={toggleAuthForm} onLoginSuccess={handleLoginSuccess} />
      )}
    </>
  );
};

const AuthPage = ({ closeAuthForm, onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  const toggleForm = () => setIsLogin(!isLogin);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!isLogin && formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
  
    const url = isLogin ? "http://localhost:4000/login" : "http://localhost:4000/signup";
    const body = isLogin
      ? { email: formData.email, password: formData.password }
      : {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          mobile: formData.mobile,
          password: formData.password,
        };
  
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }
  
      if (isLogin) {
        alert("Login successful!");
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        onLoginSuccess(data.token, data.user);
      } else {
        alert("Signup successful! Please login.");
        setIsLogin(true);
        setFormData({
          ...formData,
          password: "",
          confirmPassword: ""
        });
        setError("");
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div
      className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center"
      style={{ zIndex: 1000 }}
    >
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 relative">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
          onClick={closeAuthForm}
        >
          &times;
        </button>

        <h1 className="font-nunito hero-text font-black text-orange-400 text-2xl lg:text-3xl mb-4 text-center">
          {isLogin ? "Login" : "Signup"} to <span className="text-orange-400">Restoran</span>
        </h1>

        {error && <div className="text-red-500 mb-4 text-center">{error}</div>}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <>
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
                  required
                />
              </div>

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
                  required
                />
              </div>
            </>
          )}

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
              required
            />
          </div>

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
                required
              />
            </div>
          )}

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
              required
              minLength="0"
            />
          </div>

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
                required
                minLength="6"
              />
            </div>
          )}

          <div className="flex justify-center mb-4">
            <button
              type="submit"
              className="w-full bg-orange-400 text-white py-2 px-4 rounded-lg hover:bg-orange-500 focus:outline-none"
            >
              {isLogin ? "Login" : "Signup"}
            </button>
          </div>
        </form>

        <div className="text-center">
          <span
            onClick={toggleForm}
            className="text-blue-500 hover:text-blue-700 cursor-pointer"
          >
            {isLogin ? "Don't have an account? Signup" : "Already have an account? Login"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default DesktopHeader;