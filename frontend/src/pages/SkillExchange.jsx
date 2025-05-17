import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import Layout from "../components/Layout";


const SkillExchange = ({ user }) => {
  const [skillList, setSkillList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Get user from localStorage if not provided as prop
    const getUser = () => {
      const userData = localStorage.getItem("user");
      return userData ? JSON.parse(userData) : null;
    };
    
    const currentUser = user || getUser();

    const fetchSkillList = async () => {
      try {
        const res = await axios.get("http://localhost:8080/skillExchange");
        if (res.status === 200) {
          setSkillList(res.data);
        }
      } catch (error) {
        toast.error("Failed to fetch skill exchange data");
      }
    };
    fetchSkillList();
  }, [user]);

  const deleteSkillExchange = async (item) => {
    try {
      await axios.delete(`http://localhost:8080/skillExchange/${item.id}`);
      setSkillList((prev) =>
        prev.filter((entry) => entry.id !== item.id)
      );
      toast.success("Skill Exchange deleted successfully");
    } catch (error) {
      toast.error("Failed to delete skill exchange");
    }
  };

  const navigateEditPage = (item) => {
    navigate(`/CreateSkillExchange/${item.id}`);
  };

  

  const getCurrentUser = () => {
    const userData = localStorage.getItem("user");
    return userData ? JSON.parse(userData) : null;
  };

  const currentUser = user || getCurrentUser();

  return (
    <Layout>
      <div
  className="p-4 min-h-screen bg-cover bg-center"
  style={{ backgroundColor: "#5dade2" }}
>
  <div className="mx-auto max-w-3xl space-y-6">
    {skillList.length === 0 ? (
      <div className="bg-gray-800 rounded-xl p-6 text-center w-full max-w-[600px] border border-orange-300 transition-all duration-300 hover:border-orange-400">
        <p className="text-white text-lg font-medium">No skill exchanges available yet.</p>
      </div>
    ) : (
      skillList.map((item, index) => (
        <div
          key={index}
          className="relative overflow-hidden rounded-xl bg-white border border-gray-200 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-orange-300 hover:-translate-y-0.5"
        >
          <div className="p-6">
            {/* Header Section */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img
                    src={item?.userProfile}
                    alt="user"
                    className="h-14 w-14 rounded-full border-2 border-white shadow-lg hover:border-orange-200 transition-colors duration-300"
                  />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">{item?.username}</h2>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-sm text-gray-500 font-medium">
                      {item.exchangeDate}
                    </span>
                    <span className="rounded-full bg-orange-100 px-3 py-1 text-sm font-medium text-orange-700">
                      {item.preferredMode}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Icons */}
              {currentUser?.id === item?.userId && (
                <div className="flex gap-3">
                  <AiFillDelete
                    size={20}
                    className="text-gray-400 cursor-pointer hover:text-red-600 transition-colors duration-200"
                    onClick={() => deleteSkillExchange(item)}
                  />
                  <AiFillEdit
                    size={20}
                    className="text-gray-400 cursor-pointer hover:text-blue-600 transition-colors duration-200"
                    onClick={() => navigateEditPage(item)}
                  />
                </div>
              )}
            </div>

            {/* Skills Section */}
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100/80">
                    <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Offering</p>
                    <p className="font-semibold text-gray-800">{item.skillOffered}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100/80">
                    <svg className="h-6 w-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Requesting</p>
                    <p className="font-semibold text-gray-800">{item.skillRequested}</p>
                  </div>
                </div>
              </div>

              {/* Details Section */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100/80">
                    <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Location</p>
                    <p className="font-semibold text-gray-800">{item.location || "N/A"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100/80">
                    <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Contact</p>
                    <p className="font-semibold text-gray-800">{item.contactInfo || "N/A"}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
           {item.description && (
  <div className="mt-6 relative group">
    <div className="absolute -inset-1 bg-gradient-to-r from-orange-100 to-yellow-100 rounded-lg blur opacity-0 group-hover:opacity-40 transition-opacity duration-300"></div>
    <div className="relative rounded-lg bg-white p-4 border-l-4 border-orange-400 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-all duration-300">
      <div className="flex gap-3">
        <div className="flex-shrink-0">
          <svg 
            className="w-5 h-5 text-orange-500 mt-0.5" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="1.5" 
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
        </div>
        <p className="text-gray-700 text-[15px] leading-relaxed font-[450]">
          {item.description}
        </p>
      </div>
    </div>
  </div>
)}
          </div>
        </div>
      ))
    )}
  </div>
</div>
    </Layout>
  );
};

export default SkillExchange;