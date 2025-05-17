import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { User, BarChart3 } from "lucide-react";

const ModernProfileCard = () => {
  const [user, setUser] = useState(null);
  const [isHovering, setIsHovering] = useState(false);
  
  useEffect(() => {
    // Get user data from localStorage
    const fetchUserData = () => {
      try {
        const userData = localStorage.getItem("user");
        if (userData) {
          setUser(JSON.parse(userData));
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    
    fetchUserData();
  }, []);
  
  if (!user) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 mb-4 animate-pulse">
        <div className="h-24 bg-gray-200 rounded-t-lg"></div>
        <div className="flex justify-center mt-4">
          <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
        </div>
        <div className="mt-4 text-center">
          <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
          <div className="h-3 bg-gray-200 rounded w-3/4 mx-auto mt-2"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Card header with gradient background */}
      <div className="h-24 bg-gradient-to-r from-blue-500 to-purple-600"></div>
      
      {/* Profile image */}
      <div className="flex justify-center -mt-12">
        <div className="w-24 h-24 rounded-full border-4 border-white bg-gray-200 flex items-center justify-center">
          {user.avatar ? (
            <img 
              src={user.avatar} 
              alt="Profile" 
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <User size={40} className="text-gray-400" />
          )}
        </div>
      </div>
      
      {/* User info */}
      <div className="text-center px-4 py-3">
        <h3 className="text-xl font-semibold text-gray-800">
          {user.name}
        </h3>
        <p className="text-gray-500 text-sm">
          {user.email}
        </p>
      </div>
              
      {/* Navigation tabs */}
      <div className="px-4 pb-4">
        <NavLink 
          to="/profile" 
          className={({ isActive }) => `
            flex items-center p-3 rounded-lg mb-2 transition-colors duration-200
            ${isActive ? "bg-blue-100 text-blue-700" : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"}
          `}
        >
          <User size={18} className="mr-2" />
          <span>Profile</span>
        </NavLink>
        
        <NavLink 
          to="/analytics" 
          className={({ isActive }) => `
            flex items-center p-3 rounded-lg transition-colors duration-200
            ${isActive ? "bg-blue-100 text-blue-700" : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"}
          `}
        >
          <BarChart3 size={18} className="mr-2" />
          <span>Analytics</span>
        </NavLink>
      </div>
      
      {/* Status indicator */}
      <div className="px-4 pb-4 flex items-center">
        <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
        <span className="text-xs text-gray-500">Online</span>
      </div>
    </div>
  );
};

export default ModernProfileCard;