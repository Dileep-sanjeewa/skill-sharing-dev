import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import Layout from "../components/Layout";
import CreateBG from "../images/CreateBG.png";

const SkillExchange = ({ user }) => {
  const [skillList, setSkillList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
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
  }, []);

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

  return (
    <Layout>
      <div
        className="p-4 min-h-screen bg-cover bg-center"
        style={{ backgroundImage: `url(${CreateBG})` }}
      >
        <div className="space-y-4 flex justify-center flex-col items-center">
          {skillList.map((item, index) => (
            <div
              key={index}
              className="shadow-lg bg-gray-800 rounded-lg p-4 w-[600px]"
              style={{ border: "2px solid #E09145" }}
            >
              <div className="flex justify-between">
                <div className="flex gap-3">
                  <div>
                    <img
                      src={item?.userProfile}
                      alt="user"
                      className="w-14 h-14 rounded-full"
                    />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-neutral-200">
                      {item?.username}
                    </h2>
                    <p className="text-sm font-bold text-neutral-200">
                      Exchange on {item.exchangeDate}
                    </p>
                    <p className="text-sm italic text-neutral-300">
                      Mode: {item.preferredMode}
                    </p>
                  </div>
                </div>
                <div className="gap-3 flex">
                  {user?.id === item?.userId && (
                    <>
                      <AiFillDelete
                        size={20}
                        color="white"
                        className="cursor-pointer"
                        onClick={() => deleteSkillExchange(item)}
                      />
                      <AiFillEdit
                        size={20}
                        color="white"
                        className="cursor-pointer"
                        onClick={() => navigateEditPage(item)}
                      />
                    </>
                  )}
                </div>
              </div>

              <div className="mt-3 text-neutral-200">
                <p><strong>Skill Offered:</strong> {item.skillOffered}</p>
                <p><strong>Skill Requested:</strong> {item.skillRequested}</p>
                <p><strong>Description:</strong> {item.description}</p>
                <p><strong>Location:</strong> {item.location || "N/A"}</p>
                <p><strong>Contact Info:</strong> {item.contactInfo || "N/A"}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default SkillExchange;
