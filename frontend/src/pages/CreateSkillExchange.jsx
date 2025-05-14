import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import Layout from "../components/Layout";

const CreateSkillExchange = () => {
  const [skillOffered, setSkillOffered] = useState("");
  const [skillRequested, setSkillRequested] = useState("");
  const [description, setDescription] = useState("");
  const [exchangeDate, setExchangeDate] = useState("");
  const [preferredMode, setPreferredMode] = useState("");
  const [location, setLocation] = useState("");
  const [contactInfo, setContactInfo] = useState("");

  const [user, setUser] = useState({});
  const [editMode, setEditMode] = useState(false);
  const { skillExchangeId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);

    if (skillExchangeId) {
      const fetchSkillExchange = async () => {
        try {
          const res = await axios.get(`http://localhost:8080/skillExchange/${skillExchangeId}`);
          const data = res.data;
          setSkillOffered(data.skillOffered);
          setSkillRequested(data.skillRequested);
          setDescription(data.description);
          setExchangeDate(data.exchangeDate);
          setPreferredMode(data.preferredMode);
          setLocation(data.location);
          setContactInfo(data.contactInfo);
          setEditMode(true);
        } catch (err) {
          toast.error("Error fetching data");
        }
      };
      fetchSkillExchange();
    }
  }, [skillExchangeId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!skillOffered || !skillRequested || !description) {
      return toast.error("Please fill all required fields");
    }

    const payload = {
      userId: user.id,
      username: user.username,
      userProfile: user.profileImage,
      skillOffered,
      skillRequested,
      description,
      exchangeDate,
      preferredMode,
      location,
      contactInfo,
    };

    try {
      if (editMode) {
        await axios.put(`http://localhost:8080/skillExchange/${skillExchangeId}`, payload);
        toast.success("Skill Exchange updated");
      } else {
        await axios.post("http://localhost:8080/skillExchange", payload);
        toast.success("Skill Exchange created");
      }
      navigate("/");
    } catch (err) {
      toast.error("Submission failed");
    }
  };

  const handleCancel = () => {
    navigate("/");
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto mt-10 p-6 bg-gray-800 text-white rounded-lg shadow-md">
        <h2 className="text-2xl mb-6 text-center">{editMode ? "Edit" : "Create"} Skill Exchange</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Skill Offered" value={skillOffered}
            onChange={(e) => setSkillOffered(e.target.value)}
            className="w-full p-2 rounded bg-gray-700" />

          <input type="text" placeholder="Skill Requested" value={skillRequested}
            onChange={(e) => setSkillRequested(e.target.value)}
            className="w-full p-2 rounded bg-gray-700" />

          <textarea placeholder="Description" value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 rounded bg-gray-700" />

          <input type="date" value={exchangeDate}
            onChange={(e) => setExchangeDate(e.target.value)}
            className="w-full p-2 rounded bg-gray-700" />

          <select value={preferredMode}
            onChange={(e) => setPreferredMode(e.target.value)}
            className="w-full p-2 rounded bg-gray-700">
            <option value="">Preferred Mode</option>
            <option value="online">Online</option>
            <option value="in-person">In-Person</option>
            <option value="hybrid">Hybrid</option>
          </select>

          <input type="text" placeholder="Location (if in-person)" value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full p-2 rounded bg-gray-700" />

          <input type="text" placeholder="Contact Info" value={contactInfo}
            onChange={(e) => setContactInfo(e.target.value)}
            className="w-full p-2 rounded bg-gray-700" />

          <div className="flex justify-between">
            <button type="submit" className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-6 rounded">
              {editMode ? "Update" : "Create"}
            </button>
            <button type="button" onClick={handleCancel} className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-6 rounded">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default CreateSkillExchange;
