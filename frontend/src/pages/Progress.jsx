import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import CreateBG from "../images/CreateBG.png";

const Progress = ({ user }) => {
  const [progressList, setProgressList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
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
    <div
      className="p-4 min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${CreateBG})` }}
    >
      <div className="space-y-4 flex justify-center flex-col items-center">
        {progressList.map((progress, index) => (
          <div
            key={index}
            className="shadow-lg bg-gray-800 rounded-lg p-4 w-[600px]"
            style={{ border: "2px solid #E09145" }}
          >
            <div className="flex justify-between">
              <div className="flex gap-3">
                <div>
                  {progress?.userProfile ? (
                    <img
                      src={progress.userProfile}
                      alt="user"
                      className="w-14 h-14 rounded-full"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-gray-600 flex items-center justify-center text-white">
                      ?
                    </div>
                  )}
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-neutral-200">
                    {progress?.username || "Unknown User"}
                  </h2>
                  <p className="text-sm font-bold mb-2 text-neutral-200">
                    Progress on {progress.progressDate}
                  </p>
                </div>
              </div>
              <div className="gap-3 flex">
                {user?.id === progress?.userId && (
                  <>
                    <AiFillDelete
                      size={20}
                      color="white"
                      className="cursor-pointer"
                      onClick={() => deleteProgress(progress)}
                    />
                    <AiFillEdit
                      size={20}
                      color="white"
                      className="cursor-pointer"
                      onClick={() => navigateEditPage(progress)}
                    />
                  </>
                )}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2 text-neutral-200">
                {progress.milestone}
              </h2>
              <p className="text-sm italic text-neutral-200">
                "{progress.description}"
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Progress;
