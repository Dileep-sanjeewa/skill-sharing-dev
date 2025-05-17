import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  AiOutlineHome,
  AiOutlineSetting,
  AiOutlineSearch,
} from "react-icons/ai";
import { BiSolidMessageAltAdd } from "react-icons/bi";
import { FaChartLine, FaExchangeAlt } from "react-icons/fa";
import logo from "../images/logoSkill (2).png";
import axios from "axios";

const Navbar = ({ user }) => {
  const [showSettings, setShowSettings] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:8080/users");
        setUsers(res.data);
      } catch (error) {
        console.error("Failed to fetch users", error);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredUsers([]);
    } else {
      const filtered = users.filter(
        (u) =>
          u.id !== user?.id &&
          u.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, users, user]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "http://localhost:8080/logout";
  };

  const handleSkillXClick = () => {
    navigate("/SkillExchange");
  };

  const handleProgressClick = () => {
    navigate("/Progress");
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
        <NavLink 
          to="/" 
          className="flex flex-col items-center text-sm hover:text-blue-600"
        >
          <AiOutlineHome size={22} />
          <span className="text-xs">Home</span>
        </NavLink>

        

        <div 
          onClick={handleProgressClick}
          className="flex flex-col items-center text-sm hover:text-blue-600 cursor-pointer"
        >
          <FaChartLine size={20} />
          <span className="text-xs">Progress</span>
        </div>

        <div 
          onClick={handleSkillXClick}
          className="flex flex-col items-center text-sm hover:text-blue-600 cursor-pointer"
        >
          <FaExchangeAlt size={20} />
          <span className="text-xs">SkillX</span>
        </div>

        <NavLink to="/analyze" className="flex flex-col items-center text-sm hover:text-blue-600">
          <FaChartLine size={20} />
          <span className="text-xs">Analyze</span>
        </NavLink>

        {/* Search Input (instead of search icon) */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none w-40"
          />
          <AiOutlineSearch className="absolute right-2 top-2 text-gray-400" size={18} />

          {filteredUsers.length > 0 && (
            <div className="absolute bg-white border border-gray-200 w-full mt-1 rounded-md shadow-md z-50 max-h-60 overflow-y-auto">
              {filteredUsers.map((u) => (
                <div
                  key={u.id}
                  className="px-3 py-2 cursor-pointer hover:bg-blue-100 text-sm flex items-center gap-2"
                  onClick={() => {
                    navigate(`/profile/${u.id}`);
                    setSearchTerm("");
                  }}
                >
                  <img src={u.profileImage} alt="user" className="w-6 h-6 rounded-full" />
                  <span>{u.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
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