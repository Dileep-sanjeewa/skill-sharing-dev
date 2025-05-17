import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import Layout from "../components/Layout";

const Progress = () => {
  const [progressList, setProgressList] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get user from localStorage
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
    
    const fetchProgressList = async () => {
      try {
        const res = await axios.get("http://localhost:8080/progress");
        if (res.status === 200) {
          setProgressList(res.data);
        }
      } catch (error) {
        toast.error("Failed to fetch progress data");
      }
    };
    fetchProgressList();
  }, []);

  const deleteProgress = async (progress) => {
    try {
      await axios.delete(`http://localhost:8080/progress/${progress.progressId}`);
      setProgressList((prev) =>
        prev.filter((item) => item.progressId !== progress.progressId)
      );
      toast.success("Progress deleted successfully");
    } catch (error) {
      toast.error("Failed to delete progress");
    }
  };

  const navigateEditPage = (progress) => {
    navigate(`/CreateProgress/${progress.progressId}`);
  };

 
  return (
    <Layout>
   <div
  className="p-4 min-h-screen bg-cover bg-center"
  style={{ backgroundColor: "#5dade2" }}
>
  <div className="mx-auto max-w-3xl space-y-6">
    {progressList.length === 0 ? (
      <div className="bg-gray-800 rounded-xl p-6 text-center w-full max-w-[600px] border border-orange-300 transition-all duration-300 hover:border-orange-400">
        <p className="text-white text-lg font-medium">No progress entries available yet.</p>
      </div>
    ) : (
      progressList.map((progress, index) => (
        <div
          key={index}
          className="relative overflow-hidden rounded-xl bg-white border border-gray-200 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-orange-300 hover:-translate-y-0.5"
        >
          <div className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  {progress?.userProfile ? (
                    <img
                      src={progress.userProfile}
                      alt="user"
                      className="h-14 w-14 rounded-full border-2 border-white shadow-lg hover:border-orange-200 transition-colors duration-300"
                    />
                  ) : (
                    <div className="h-14 w-14 rounded-full bg-gray-600 flex items-center justify-center text-white border-2 border-white">
                      ?
                    </div>
                  )}
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    {progress?.username || "Unknown User"}
                  </h2>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-sm text-gray-500 font-medium">
                      Updated on {progress.progressDate}
                    </span>
                    <span className="rounded-full bg-orange-100 px-3 py-1 text-sm font-medium text-orange-700">
                      {progress.skillCategory}
                    </span>
                  </div>
                </div>
              </div>

              {user?.id === progress?.userId && (
                <div className="flex gap-3">
                  <AiFillDelete
                    size={20}
                    className="text-gray-400 cursor-pointer hover:text-red-600 transition-colors duration-200"
                    onClick={() => deleteProgress(progress)}
                  />
                  <AiFillEdit
                    size={20}
                    className="text-gray-400 cursor-pointer hover:text-blue-600 transition-colors duration-200"
                    onClick={() => navigateEditPage(progress)}
                  />
                </div>
              )}
            </div>

            <div className="mt-6 space-y-4">
              <div className="p-4 rounded-lg bg-gray-50">
                <h3 className="text-lg font-semibold text-orange-600 mb-2">
                  {progress.milestone}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {progress.description}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100/80">
                    <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Skill Category</p>
                    <p className="font-semibold text-gray-800">{progress.skillCategory}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100/80">
                    <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Completion</p>
                    <p className="font-semibold text-gray-800">
                      {progress.completionPercentage}%
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100/80">
                    <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Resources</p>
                    <p className="font-semibold text-gray-800">
                      {progress.learningResources}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))
    )}
  </div>
</div>
    </Layout>
  );
};

export default Progress;