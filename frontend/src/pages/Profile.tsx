import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import API from "../api.ts"; // axios instance

interface User {
  _id: string;
  name: string;
  email: string;
  isActive?: boolean;
}

const Profile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editableUser, setEditableUser] = useState<User | null>(null);

  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("You are not logged in");
      setLoading(false);
      return;
    }

    API.get("/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        setUser(res.data.user);
        setEditableUser(res.data.user);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.response?.data?.message || "Failed to fetch profile");
        setLoading(false);
      });
  }, []);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    setUser(editableUser);
    setIsEditing(false);
    // Note: In a real application, you would send a PUT/PATCH request to your backend here
  };

  const handleCancelClick = () => {
    setEditableUser(user);
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditableUser((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate('/login'); // Use navigate to redirect to the login route
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#271441] via-[#422766] to-[#442b83]">
        <p className="text-xl font-semibold animate-pulse text-gray-300">
          Loading profile...
        </p>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#1a0b2e] via-[#311b4e] to-[#190c3a]">
        <p className="text-xl font-semibold text-red-400">{error}</p>
      </div>
    );

  return (
    <div className="flex items-center justify-center min-h-screen p-6 bg-gradient-to-br from-[#0b0215] via-[#362376] to-[#0c0321]">
      <div className="relative w-full max-w-sm bg-gray-800 rounded-3xl shadow-2xl overflow-hidden transform transition-all hover:scale-105 duration-300">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 opacity-30 blur-3xl z-0"></div>
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-white/10 rounded-full blur-xl"></div>

        <div className="relative z-10 p-8 text-white">
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center border-4 border-gray-600 shadow-lg mb-4">
              <span className="text-5xl font-bold">
                {isEditing ? editableUser?.name.charAt(0).toUpperCase() : user?.name.charAt(0).toUpperCase()}
              </span>
            </div>
            {isEditing ? (
              <div className="w-full text-center">
                <input
                  type="text"
                  name="name"
                  value={editableUser?.name || ""}
                  onChange={handleChange}
                  className="w-full text-3xl font-extrabold text-center bg-transparent border-b-2 border-white/50 focus:outline-none mb-1"
                />
                <input
                  type="email"
                  name="email"
                  value={editableUser?.email || ""}
                  onChange={handleChange}
                  className="w-full text-lg font-light text-center bg-transparent border-b-2 border-white/50 focus:outline-none text-gray-300"
                />
              </div>
            ) : (
              <>
                <h2 className="text-3xl font-extrabold text-center mb-1">
                  {user?.name}
                </h2>
                <p className="text-lg text-gray-300 font-light text-center">
                  {user?.email}
                </p>
              </>
            )}
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-700/50 rounded-lg backdrop-blur-md border border-gray-600 shadow-lg">
              <p className="text-sm text-gray-400 font-medium">Status</p>
              <span
                className={`text-lg font-bold ${
                  user?.isActive ? "text-green-400" : "text-red-400"
                }`}
              >
                {user?.isActive ? "Active" : "Deactivated"}
              </span>
            </div>
            <div className="p-4 bg-gray-700/50 rounded-lg backdrop-blur-md border border-gray-600 shadow-lg">
              <p className="text-sm text-gray-400 font-medium">User ID</p>
              <span className="text-lg font-bold font-mono text-white break-words">
                {user?._id}
              </span>
            </div>
          </div>

          <div className="mt-8 flex flex-col items-center space-y-4">
            {isEditing ? (
              <>
                <div className="flex space-x-4">
                  <button
                    onClick={handleSaveClick}
                    className="px-6 py-2 rounded-full text-white font-bold transition-all duration-200 bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancelClick}
                    className="px-6 py-2 rounded-full text-white font-bold transition-all duration-200 bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <button
                onClick={handleEditClick}
                className="w-full px-6 py-2 rounded-full text-white font-bold transition-all duration-200 bg-purple-500 hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                Edit Profile
              </button>
            )}
            <button
              onClick={handleLogout}
              className="w-full px-6 py-2 rounded-full text-white font-bold transition-all duration-200 bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;