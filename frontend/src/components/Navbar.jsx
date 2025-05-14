import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  AiOutlineHome,
  AiOutlineSetting,
  AiOutlineSearch,
} from "react-icons/ai";
import { BiSolidMessageAltAdd } from "react-icons/bi";
import { FaChartLine } from "react-icons/fa";
import { FaExchangeAlt } from "react-icons/fa";
import logo from "../images/logoSkill (2).png";

const Navbar = ({ user }) => {
  const [showSettings, setShowSettings] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "http://localhost:8080/logout";
  };

  return (
    <nav className="w-full flex items-center justify-between px-6 h-[75px] bg-white shadow-md fixed top-0 z-50 border-b border-gray-200">
      {/* Left Section: Logo */}
      <div className="flex items-center gap-3">
        <NavLink to="/" className="flex items-center gap-2">
          <img src={logo} alt="logo" className="w-12 h-12 object-cover rounded-md" />
          <span className="text-xl font-bold text-gray-800 hidden sm:block">SkillShare</span>
        </NavLink>
      </div>

      {/* Center Section: Navigation Icons */}
      <div className="flex items-center gap-10 text-gray-600">
        <NavLink to="/" className="flex flex-col items-center text-sm hover:text-blue-600">
          <AiOutlineHome size={22} />
          <span className="text-xs">Home</span>
        </NavLink>

        <NavLink to="/post" className="flex flex-col items-center text-sm hover:text-blue-600">
          <BiSolidMessageAltAdd size={22} />
          <span className="text-xs">Post</span>
        </NavLink>

        <NavLink to="/progress" className="flex flex-col items-center text-sm hover:text-blue-600">
          <FaChartLine size={20} />
          <span className="text-xs">Progress</span>
        </NavLink>

        <NavLink to="/skillExchange" className="flex flex-col items-center text-sm hover:text-blue-600">
          <FaExchangeAlt size={20} />
          <span className="text-xs">SkillX</span>
        </NavLink>

        <NavLink to="/analyze" className="flex flex-col items-center text-sm hover:text-blue-600">
          <FaChartLine size={20} />
          <span className="text-xs">Analyze</span>
        </NavLink>

        {/* Search Icon for Suggesting Users */}
        <NavLink to="/suggest-users" className="flex flex-col items-center text-sm hover:text-blue-600">
          <AiOutlineSearch size={22} />
          <span className="text-xs">Search</span>
        </NavLink>
      </div>

      {/* Right Section: User Profile & Settings */}
      <div className="flex items-center gap-4 relative">
        <div
          onClick={() => navigate(`/profile/${user?.id}`)}
          className="cursor-pointer flex items-center gap-2"
        >
          <img
            src={user?.profileImage}
            alt="profile"
            className="w-10 h-10 rounded-full border border-gray-300"
          />
          <div className="flex-col text-xs hidden sm:flex">
            <p className="font-semibold text-gray-800">{user?.name}</p>
            <p className="text-gray-500">{user?.email}</p>
          </div>
        </div>

        {/* Settings Icon */}
        <div className="relative">
          <button onClick={() => setShowSettings(!showSettings)}>
            <AiOutlineSetting size={22} className="text-gray-700 hover:text-blue-600" />
          </button>
          {showSettings && (
            <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-md border border-gray-200 z-50">
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
