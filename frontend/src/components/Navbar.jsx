import React from "react";
import { Link, NavLink } from "react-router-dom";
import logo from "../images/logoSkill (2).png"; 

const Navbar = ({ user }) => {
  return (
    <div className="text-gray-900 flex w-full h-[70px] z-50 fixed top-0 bg-gray-800 shadow-md">
      <div className="flex items-center justify-between w-full px-4">
        <NavLink to="/">
          <div>
            <img src={logo} alt="logo" className="w-20 h-20" /> {/* Logo image */}
          </div>
        </NavLink>

        <div className="flex items-center">
          <div className="flex items-center justify-between px-1 py-5 text-gray-900 rounded-lg">
            <Link to={`/profile/${user?.id}`} className="flex items-center mr-5">
              <div className="mr-5">
                <div className="">
                  <img
                    className="w-[50px] h-[50px] min-w-[50px] rounded-full border-gray-400 border-2"
                    src={user?.profileImage}
                    alt="profile"
                  />
                </div>
              </div>
              <div className="mr-2">
                <p className="text-base font-bold uppercase text-gray-100">{user?.name}</p>
                <p className="text-xs text-gray-300">{user?.email}</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
