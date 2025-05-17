import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Layout = ({ children }) => {
  const [user, setUser] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      fetchUser();
    } else {
      setUser(JSON.parse(userData));
    }
  }, []);

  const fetchUser = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/user", {
        withCredentials: true,
      });
      localStorage.setItem("user", JSON.stringify(res.data));
      setUser(res.data);
    } catch (error) {
      if (error.response?.status === 401) {
        navigate("/login");
      }
    }
  };

  return (
    <div className="pt-[75px] min-h-screen bg-gray-100 flex flex-col">
      <Navbar user={user} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
