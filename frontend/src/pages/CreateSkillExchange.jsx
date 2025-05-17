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
  const [errors, setErrors] = useState({}); // Added error state
  const [user, setUser] = useState({});
  const [editMode, setEditMode] = useState(false);
  const { skillExchangeId } = useParams();
  const navigate = useNavigate();

  // =============== VALIDATION FUNCTIONS ===============
  const validateForm = () => {
    const newErrors = {};
    const currentDate = new Date().toISOString().split('T')[0];

    // Required fields validation
    if (!skillOffered.trim()) newErrors.skillOffered = "Skill offered is required";
    if (!skillRequested.trim()) newErrors.skillRequested = "Skill requested is required";
    
    // Description validation
    if (!description.trim()) {
      newErrors.description = "Description is required";
    } else if (description.length < 20) {
      newErrors.description = "Description must be at least 20 characters";
    }

    // Date validation
    if (exchangeDate && exchangeDate > currentDate) {
      newErrors.exchangeDate = "Date cannot be in the future";
    }

    // Preferred mode validation
    if (!preferredMode) {
      newErrors.preferredMode = "Please select a preferred mode";
    }

    // Location validation for in-person meetings
    if (preferredMode === "in-person" && !location.trim()) {
      newErrors.location = "Location is required for in-person exchanges";
    }

    // Contact info validation
    if (!contactInfo.trim()) {
      newErrors.contactInfo = "Contact information is required";
    } else {
      if (preferredMode === "online" && !/^\S+@\S+\.\S+$/.test(contactInfo)) {
        newErrors.contactInfo = "Invalid email format";
      }
      if (preferredMode === "in-person" && !/^[\d\s+()\-]{7,}$/.test(contactInfo)) {
        newErrors.contactInfo = "Invalid phone number format";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  // =============== END VALIDATION FUNCTIONS ===============

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
    
    // Run validation before submission
    if (!validateForm()) {
      toast.error("Please fix the form errors");
      return;
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
      <div style={{ backgroundColor: "#5dade2" }} className="min-h-screen py-6">
        <div className="max-w-2xl mx-auto mt-10 p-6 bg-gray-800 text-white rounded-lg shadow-md">
          <h2 className="text-2xl mb-6 text-center">{editMode ? "Edit" : "Create"} Skill Exchange</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Skill Offered Input */}
            <div>
              <input 
                type="text" 
                placeholder="Skill Offered *" 
                value={skillOffered}
                onChange={(e) => {
                  setSkillOffered(e.target.value);
                  setErrors(prev => ({ ...prev, skillOffered: "" }));
                }}
                className={`w-full p-2 rounded ${errors.skillOffered ? "border-2 border-red-500" : "bg-gray-700"}`}
              />
              {errors.skillOffered && <p className="text-red-400 text-sm">{errors.skillOffered}</p>}
            </div>

            {/* Skill Requested Input */}
            <div>
              <input 
                type="text" 
                placeholder="Skill Requested *" 
                value={skillRequested}
                onChange={(e) => {
                  setSkillRequested(e.target.value);
                  setErrors(prev => ({ ...prev, skillRequested: "" }));
                }}
                className={`w-full p-2 rounded ${errors.skillRequested ? "border-2 border-red-500" : "bg-gray-700"}`}
              />
              {errors.skillRequested && <p className="text-red-400 text-sm">{errors.skillRequested}</p>}
            </div>

            {/* Description Input */}
            <div>
              <textarea 
                placeholder="Description *" 
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  setErrors(prev => ({ ...prev, description: "" }));
                }}
                className={`w-full p-2 rounded ${errors.description ? "border-2 border-red-500" : "bg-gray-700"}`}
                rows="4"
              />
              {errors.description && <p className="text-red-400 text-sm">{errors.description}</p>}
            </div>

            {/* Exchange Date Input */}
            <div>
              <input 
                type="date" 
                value={exchangeDate}
                onChange={(e) => {
                  setExchangeDate(e.target.value);
                  setErrors(prev => ({ ...prev, exchangeDate: "" }));
                }}
                max={new Date().toISOString().split('T')[0]}
                className={`w-full p-2 rounded ${errors.exchangeDate ? "border-2 border-red-500" : "bg-gray-700"}`}
              />
              {errors.exchangeDate && <p className="text-red-400 text-sm">{errors.exchangeDate}</p>}
            </div>

            {/* Preferred Mode Select */}
            <div>
              <select
                value={preferredMode}
                onChange={(e) => {
                  setPreferredMode(e.target.value);
                  setErrors(prev => ({ ...prev, preferredMode: "", location: "", contactInfo: "" }));
                }}
                className={`w-full p-2 rounded ${errors.preferredMode ? "border-2 border-red-500" : "bg-gray-700"}`}
              >
                <option value="">Preferred Mode *</option>
                <option value="online">Online</option>
                <option value="in-person">In-Person</option>
                <option value="hybrid">Hybrid</option>
              </select>
              {errors.preferredMode && <p className="text-red-400 text-sm">{errors.preferredMode}</p>}
            </div>

            {/* Location Input (conditional) */}
            {preferredMode === "in-person" && (
              <div>
                <input 
                  type="text" 
                  placeholder="Location *" 
                  value={location}
                  onChange={(e) => {
                    setLocation(e.target.value);
                    setErrors(prev => ({ ...prev, location: "" }));
                  }}
                  className={`w-full p-2 rounded ${errors.location ? "border-2 border-red-500" : "bg-gray-700"}`}
                />
                {errors.location && <p className="text-red-400 text-sm">{errors.location}</p>}
              </div>
            )}

            {/* Contact Info Input */}
            <div>
              <input 
                type="text" 
                placeholder={
                  preferredMode === "online" ? "Email *" : 
                  preferredMode === "in-person" ? "Phone Number *" : 
                  "Contact Information *"
                }
                value={contactInfo}
                onChange={(e) => {
                  setContactInfo(e.target.value);
                  setErrors(prev => ({ ...prev, contactInfo: "" }));
                }}
                className={`w-full p-2 rounded ${errors.contactInfo ? "border-2 border-red-500" : "bg-gray-700"}`}
              />
              {errors.contactInfo && <p className="text-red-400 text-sm">{errors.contactInfo}</p>}
            </div>

            {/* Buttons */}
            <div className="flex justify-between">
              <button 
                type="submit" 
                className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-6 rounded transition-colors"
              >
                {editMode ? "Update" : "Create"}
              </button>
              <button 
                type="button" 
                onClick={handleCancel} 
                className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-6 rounded transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default CreateSkillExchange;