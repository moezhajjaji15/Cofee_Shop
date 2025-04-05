import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaCoins, FaUserEdit, FaKey, FaSave, FaTimes } from "react-icons/fa";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isPasswordChanging, setIsPasswordChanging] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    points: 0
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("You must be logged in to view your profile.");
      navigate("/login");
      return;
    }

    axios
      .get("http://localhost:4000/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setUser(response.data.user);
        setFormData({
          firstName: response.data.user.firstName,
          lastName: response.data.user.lastName,
          email: response.data.user.email,
          mobile: response.data.user.mobile,
          points: response.data.user.points
        });
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        if (err.response && err.response.status === 401) {
          setError("Session expired, please log in again.");
          localStorage.removeItem("token");
          navigate("/login");
        } else {
          setError("An error occurred while fetching the profile.");
        }
      });
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    const token = localStorage.getItem("token");

    axios
      .put("http://localhost:4000/profile", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setUser(response.data.user);
        setIsEditing(false);
        setSuccessMessage("✅ Profile updated successfully!");
        setError("");
      })
      .catch(() => {
        setError("Failed to update profile");
        setSuccessMessage("");
      });
  };

  const handlePasswordSubmit = () => {
    const token = localStorage.getItem("token");

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("New passwords do not match.");
      setSuccessMessage("");
      return;
    }

    axios
      .put("http://localhost:4000/change-password", passwordData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        setIsPasswordChanging(false);
        setSuccessMessage("✅ Password updated successfully!");
        setError("");
        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      })
      .catch(() => {
        setError("Failed to update password.");
        setSuccessMessage("");
      });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar - Points Card */}
          <div className="w-full md:w-1/3 lg:w-1/4">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-6">
              <div className="flex flex-col items-center">
                <div className="bg-yellow-100 p-4 rounded-full mb-4">
                  <FaCoins className="text-yellow-500 text-3xl" />
                </div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">Your Points</h2>
                <div className="text-4xl font-bold text-orange-500 mb-4 flex items-center">
                  {user.points} <FaCoins className="ml-2 text-yellow-500" />
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                  <div 
                    className="bg-orange-500 h-2.5 rounded-full" 
                    style={{ width: `${Math.min(100, (user.points % 1000) / 10)}%` }}
                  ></div>
                </div>
                
                <p className="text-sm text-gray-600 text-center mb-4">
                  {1000 - (user.points % 1000)} points until next reward
                </p>
                
                <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200">
                  Redeem Points
                </button>
              </div>
            </div>
          </div>

          {/* Main Profile Content */}
          <div className="w-full md:w-2/3 lg:w-3/4">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-orange-500 px-6 py-4">
                <h1 className="text-2xl font-bold text-white">Profile Information</h1>
              </div>
              
              <div className="p-6">
                {error && (
                  <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
                    {error}
                  </div>
                )}
                
                {successMessage && (
                  <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6">
                    {successMessage}
                  </div>
                )}

                <div className="space-y-4">
                  {["firstName", "lastName", "email", "mobile"].map((field) => (
                    <div key={field} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                      <label className="text-gray-700 font-medium">
                        {field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}
                      </label>
                      {isEditing ? (
                        <input
                          type={field === "email" ? "email" : "text"}
                          name={field}
                          value={formData[field]}
                          onChange={handleChange}
                          className="col-span-2 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
                        />
                      ) : (
                        <p className="col-span-2 text-gray-900 font-medium bg-gray-50 px-4 py-2 rounded-lg">
                          {user[field] || "Not provided"}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                {/* Password Change Section */}
                {isPasswordChanging && (
                  <div className="mt-8 border-t pt-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <FaKey className="mr-2 text-orange-500" /> Change Password
                    </h3>
                    <div className="space-y-4">
                      {["currentPassword", "newPassword", "confirmPassword"].map((field) => (
                        <div key={field} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                          <label className="text-gray-700 font-medium">
                            {field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}
                          </label>
                          <input
                            type="password"
                            name={field}
                            placeholder={`Enter ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`}
                            value={passwordData[field]}
                            onChange={handlePasswordChange}
                            className="col-span-2 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-8 flex flex-wrap gap-4 justify-end">
                  {isEditing ? (
                    <>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-6 rounded-lg transition"
                      >
                        <FaTimes /> Cancel
                      </button>
                      <button
                        onClick={handleSubmit}
                        className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-6 rounded-lg transition"
                      >
                        <FaSave /> Save Changes
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => setIsPasswordChanging(!isPasswordChanging)}
                        className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg transition"
                      >
                        <FaKey /> {isPasswordChanging ? "Cancel" : "Change Password"}
                      </button>
                      <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-6 rounded-lg transition"
                      >
                        <FaUserEdit /> Edit Profile
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;