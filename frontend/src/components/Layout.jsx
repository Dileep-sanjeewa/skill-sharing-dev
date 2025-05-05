import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import SideBar2 from "./SideBar2";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Layout = ({ children }) => {
  const [user, setUser] = useState({});
  const navigate = useNavigate();
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      fetchUser();
    }
    setUser(JSON.parse(userData));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchUser = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/user", {
        withCredentials: true,
      });
      console.log(res);
      localStorage.setItem("user", JSON.stringify(res.data));
      setUser(res.data);
    } catch (error) {
      if (error.response.status === 401) {
        navigate("/login");
      }
    }
  };

  return (
    <div className="flex h-full bg-gray-800">
      <div className="flex w-full fixed  ">
        <Navbar user={user} />
      </div>
      <div className="flex  mt-[70px]  w-full ">
        
        <div className="flex-1 bg-white">{children}</div>
        
      </div>
    </div>
  );
};

export default Layout;
