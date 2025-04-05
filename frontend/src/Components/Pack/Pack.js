import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaCoins, FaShoppingCart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Pack = () => {
  const [packs, setPacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // État pour le modal d'affichage des photos
  const [showModal, setShowModal] = useState(false);
  const [selectedPack, setSelectedPack] = useState(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPacks = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/packs");
        setPacks(response.data);
        setLoading(false);
      } catch (err) {
        setError("Erreur lors du chargement des packs");
        setLoading(false);
        console.error(err);
      }
    };

    fetchPacks();
  }, []);

  // Redirige vers la page de commande pour un pack donné
  const handlePurchase = (packId) => {
    navigate(`/order/pack/${packId}`);
  };

  // Affiche le modal avec les photos des menus du pack
  const handleShowPhotos = (pack) => {
    setSelectedPack(pack);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedPack(null);
    setShowModal(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-center text-orange-500 mb-12">
        Nos Packs Exclusifs
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {packs.map((pack) => (
          <div
            key={pack.id}
            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            <div className="bg-orange-500 p-4">
              <h3 className="text-xl font-bold text-white text-center">{pack.name}</h3>
            </div>

            <div className="p-6">
              <p className="text-gray-600 mb-4">{pack.description}</p>

              <div className="mb-4">
                <h4 className="font-semibold text-gray-800 mb-2">Contenu du pack :</h4>
                <ul className="space-y-2">
                  {pack.menus?.map((menu) => (
                    <li key={menu.id} className="flex items-center">
                      <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                      <span>{menu.title} - {menu.price} DT</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex justify-between items-center mt-6">
                <div className="flex items-center">
                  <FaCoins className="text-yellow-500 mr-2" />
                  <span className="font-bold">{pack.price} DT</span>
                </div>

                <div className="flex items-center bg-orange-100 px-3 py-1 rounded-full">
                  <FaCoins className="text-yellow-500 mr-1" />
                  <span className="text-sm font-medium">{pack.points} points</span>
                </div>
              </div>

              <div className="flex mt-6 space-x-2">
                <button
                  onClick={() => handlePurchase(pack.id)}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center transition"
                >
                  <FaShoppingCart className="mr-2" />
                  Commander
                </button>
                <button
                  onClick={() => handleShowPhotos(pack)}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center transition"
                >
                  Voir Photos
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal pour afficher les photos des menus du pack sélectionné */}
      {showModal && selectedPack && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 w-11/12 md:w-2/3 lg:w-1/2">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold">{selectedPack.name} - Photos</h3>
              <button
                onClick={handleCloseModal}
                className="text-red-500 font-bold text-xl"
              >
                X
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {selectedPack.menus?.map((menu) => (
                <div key={menu.id} className="flex flex-col items-center">
                  {menu.img ? (
                    <img
                      src={menu.img}
                      alt={menu.title}
                      className="w-full h-32 object-cover rounded-md"
                    />
                  ) : (
                    <div className="w-full h-32 bg-gray-200 flex items-center justify-center rounded-md">
                      Pas d'image
                    </div>
                  )}
                  <p className="mt-2 text-center">{menu.title}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pack;
