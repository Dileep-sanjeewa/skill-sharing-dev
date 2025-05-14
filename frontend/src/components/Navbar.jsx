import React from "react";
import { Link, NavLink } from "react-router-dom";
import logo from "../images/logoSkill (2).png"; 

const Navbar = ({ user }) => {
  return (
    <div className="flex w-full h-[75px] z-50 fixed top-0 bg-blue-700 shadow-md text-white border-b border-blue-300">
    <div className="flex items-center justify-between w-full px-6">
      {/* Logo Section */}
      <NavLink to="/" className="flex items-center gap-3">
        <img
          src={logo}
          alt="logo"
          className="w-14 h-14 object-cover rounded-md"
        />
        <span className="text-xl font-bold tracking-wide text-white hidden sm:block">
          SkillShare
        </span>
      </NavLink>

      {/* User Info Section */}
      <div className="flex items-center">
        <Link
          to={`/profile/${user?.id}`}
          className="flex items-center gap-3 px-3 py-2 bg-blue-600 rounded-full hover:bg-blue-500 transition duration-300"
        >
          <img
            className="w-10 h-10 rounded-full border-2 border-white"
            src={user?.profileImage}
            alt="profile"
          />
          <div className="flex flex-col text-sm">
            <p className="font-semibold uppercase">{user?.name}</p>
            <p className="text-gray-200 text-xs">{user?.email}</p>
          </div>
        </Link>
      </div>
    </div>
  </div>
  );
};

export default Navbar;
