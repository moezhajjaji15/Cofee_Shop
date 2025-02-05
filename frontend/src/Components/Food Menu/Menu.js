import React, { useState } from "react";
import MyMenu from "./MyMenu";
import { MenuData } from "./MenuData";
import Fade from 'react-reveal/Fade';
import { FaShoppingCart, FaTrashAlt } from "react-icons/fa"; // Importation des icônes

const Menu = () => {
  const [menuItems, setMenuItems] = useState(MenuData);
  const [activeSection, setActiveSection] = useState("All");
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);

  const filterMenu = (section) => {
    setActiveSection(section);
    if (section === "All") {
      setMenuItems(MenuData);
    } else {
      const filteredItems = MenuData.filter((item) => item.category === section);
      setMenuItems(filteredItems);
    }
  };

  const handleAddToCart = (item) => {
    setCart((prevCart) => [...prevCart, item]);
  };

  const handleRemoveFromCart = (index) => {
    setCart((prevCart) => prevCart.filter((_, i) => i !== index));
  };

  const handleOrder = () => {
    alert("Commande validée !");
    setCart([]);
    setShowCart(false);
  };

  // Fonction pour calculer le total des prix
  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price, 0).toFixed();
  };

  return (
    <section className="text-gray-600 body-font">
      <div className="container lg:max-w-[1324px] px-5 py-20 mx-auto">
        <div className="flex flex-col text-center w-full mb-12 lg:mb-20">
          <p className="title-font text-orange-400 sec-heading font-medium text-3xl mb-2">
            Food Menu
          </p>
          <h1 className="font-nunito hero-text font-black text-black text-3xl lg:text-5xl">
            Most Popular Items
          </h1>
        </div>
        <div className="flex justify-center items-center mb-8">
          <div className="flex justify-center">
            {["All", "Coffee", "Tea", "Juices & Cocktails", "Ice Cream", "Pastries", "Crepes", "Extras"].map(
              (section) => (
                <button
                  key={section}
                  onClick={() => filterMenu(section)}
                  className={`mx-2 px-4 py-2 rounded-lg ${
                    activeSection === section ? "bg-orange-400 text-white" : "bg-gray-200"
                  }`}
                >
                  {section}
                </button>
              )
            )}
          </div>
          <div className="relative ml-4">
            <button
              onClick={() => setShowCart(!showCart)}
              className="flex items-center"
            >
              <FaShoppingCart size={24} className="text-orange-400 mr-2" />
              <span className="text-lg font-bold">{cart.length}</span>
            </button>
            {showCart && (
              <div className="absolute right-0 top-16 bg-white shadow-lg rounded-lg w-80 p-4 z-50 max-h-96 overflow-y-auto">
                <h2 className="text-lg font-bold mb-3">Votre Panier</h2>
                <ul>
                  {cart.map((item, index) => (
                    <li
                      key={index}
                      className="flex justify-between items-center py-2"
                    >
                      <div className="flex items-center w-2/3">
                        <img
                          src={item.img}
                          alt={item.title}
                          className="w-12 h-12 rounded-md mr-3"
                        />
                        <span className="text-gray-700 font-medium truncate">
                          {item.title}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-gray-600 font-medium mr-3 whitespace-nowrap">
                          {item.price.toFixed()}
                        </span>
                        {/* Remplacement du bouton de suppression avec une icône dynamique */}
                        <button
                          onClick={() => handleRemoveFromCart(index)}
                          className="text-red-500 text-lg"
                        >
                          <FaTrashAlt />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
                {cart.length > 0 ? (
                  <>
                    {/* Affichage du total */}
                    <div className="flex justify-between items-center mt-4">
                      <span className="text-lg font-bold">Total :</span>
                      <span className="text-lg font-bold">{calculateTotal()} Dinars</span>
                      
                    </div>
                    <button
                      onClick={handleOrder}
                      className="mt-4 w-full bg-orange-400 text-white text-sm px-3 py-2 rounded-lg hover:bg-orange-500 transition-all"
                    >
                      Valider la Commande
                    </button>
                  </>
                ) : (
                  <p className="text-gray-500 text-sm mt-4">Votre panier est vide.</p>
                )}
              </div>
            )}
          </div>
        </div>
        <Fade bottom>
          <div className="flex flex-wrap -m-2">
            {menuItems.map((item) => (
              <MyMenu
                key={item.id}
                img={item.img}
                description={item.desc}
                title={item.title}
                price={item.price}
                onAddToCart={() => handleAddToCart(item)}
              />
            ))}
          </div>
        </Fade>
      </div>
    </section>
  );
};

export default Menu;
