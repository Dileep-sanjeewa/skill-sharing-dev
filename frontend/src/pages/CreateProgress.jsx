import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { useNavigate, useParams } from "react-router-dom";
import { useActiveTab } from "../context/ActiveTabContext";
import toast from "react-hot-toast";
import axios from "axios";

const CreateProgress = () => {
  const [progressDate, setProgressDate] = useState("");
  const [description, setDescription] = useState("");
  const [milestone, setMilestone] = useState("");
  const [skillCategory, setSkillCategory] = useState("");
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [learningResources, setLearningResources] = useState("");
  const [user, setUser] = useState({});
  const [editProgress, setEditProgress] = useState(false);
  const [errors, setErrors] = useState({});
  const { setActiveTab } = useActiveTab();
  const { progressId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (progressId) {
      const fetchSingleProgress = async () => {
        try {
          const { data } = await axios.get(`http://localhost:8080/progress/${progressId}`);
          setMilestone(data.milestone);
          setDescription(data.description);
          setProgressDate(data.progressDate);
          setSkillCategory(data.skillCategory);
          setCompletionPercentage(data.completionPercentage || 0);
          setLearningResources(data.learningResources);
          setEditProgress(true);
        } catch (error) {
          console.log(error);
        }
      };
      fetchSingleProgress();
    }
  }, [progressId]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    setUser(user);
  }, []);

  const validateForm = () => {
    const newErrors = {};
    const currentDate = new Date().toISOString().split('T')[0];

    if (!milestone.trim()) {
      newErrors.milestone = "Milestone is required";
    } else if (milestone.length < 5) {
      newErrors.milestone = "Milestone must be at least 5 characters";
    }

    if (!progressDate) {
      newErrors.progressDate = "Progress date is required";
    } else if (progressDate > currentDate) {
      newErrors.progressDate = "Date cannot be in the future";
    }

    if (!description.trim()) {
      newErrors.description = "Description is required";
    } else if (description.length < 20) {
      newErrors.description = "Description must be at least 20 characters";
    }

    if (!skillCategory.trim()) {
      newErrors.skillCategory = "Skill category is required";
    } else if (!/^[a-zA-Z\s]+$/.test(skillCategory)) {
      newErrors.skillCategory = "Only letters and spaces allowed";
    }

    if (completionPercentage < 0 || completionPercentage > 100) {
      newErrors.completionPercentage = "Percentage must be between 0-100";
    }

    if (learningResources && !/^[a-zA-Z0-9\s.,-]+$/.test(learningResources)) {
      newErrors.learningResources = "Invalid characters in learning resources";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    if (!validateForm()) {
      toast.error("Please fix the form errors");
      return;
    }

    const progressData = {
      userId: user.id,
      username: user.username,
      userProfile: user.profile,
      milestone,
      description,
      progressDate,
      skillCategory,
      completionPercentage,
      learningResources,
    };

    try {
      const res = editProgress
        ? await axios.put(`http://localhost:8080/progress/${progressId}`, progressData)
        : await axios.post(`http://localhost:8080/progress`, progressData);

      if (res.status === 200 || res.status === 201) {
        toast.success(editProgress ? "Progress Updated" : "Progress Added");
        resetForm();
        navigate("/");
        setActiveTab("tab5");
      }
    } catch (error) {
      toast.error(editProgress ? "Failed to update" : "Failed to add");
    }
  };

  const resetForm = () => {
    setMilestone("");
    setDescription("");
    setProgressDate("");
    setSkillCategory("");
    setCompletionPercentage(0);
    setLearningResources("");
    setErrors({});
  };

  const goToProgress = () => {
    navigate("/");
    setActiveTab("tab5");
  };

  return (
    <Layout>
      <div style={{ backgroundColor: "#5dade2" }} className="min-h-screen py-6">
        <form
          onSubmit={handleSubmit}
          className="max-w-xl mx-auto bg-gray-800 p-6 rounded-lg shadow-md"
        >
          <h1 className="mb-4 text-3xl font-semibold text-center text-indigo-600">
            {editProgress ? "Edit Progress" : "Create Progress"}
          </h1>

          <div className="space-y-6">
            <div>
              <label className="block text-sm text-neutral-200">Milestone *</label>
              <input
                type="text"
                value={milestone}
                onChange={(e) => {
                  setMilestone(e.target.value);
                  setErrors(prev => ({ ...prev, milestone: "" }));
                }}
                className={`w-full p-2 mt-1 rounded-md bg-gray-800 text-neutral-200 border ${
                  errors.milestone ? "border-red-500" : "border-gray-300"
                }`}
                required
              />
              {errors.milestone && (
                <p className="text-red-400 text-sm mt-1">{errors.milestone}</p>
              )}
            </div>

            <div>
              <label className="block text-sm text-neutral-200">Progress Date *</label>
              <input
                type="date"
                value={progressDate}
                onChange={(e) => {
                  setProgressDate(e.target.value);
                  setErrors(prev => ({ ...prev, progressDate: "" }));
                }}
                max={new Date().toISOString().split('T')[0]}
                className={`w-full p-2 mt-1 rounded-md bg-gray-800 text-neutral-200 border ${
                  errors.progressDate ? "border-red-500" : "border-gray-300"
                }`}
                required
              />
              {errors.progressDate && (
                <p className="text-red-400 text-sm mt-1">{errors.progressDate}</p>
              )}
            </div>

            <div>
              <label className="block text-sm text-neutral-200">Description *</label>
              <textarea
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  setErrors(prev => ({ ...prev, description: "" }));
                }}
                rows="4"
                className={`w-full p-2 mt-1 rounded-md bg-gray-800 text-neutral-200 border ${
                  errors.description ? "border-red-500" : "border-gray-300"
                }`}
                minLength="20"
                required
              ></textarea>
              {errors.description && (
                <p className="text-red-400 text-sm mt-1">{errors.description}</p>
              )}
            </div>

            <div>
              <label className="block text-sm text-neutral-200">Skill Category *</label>
              <input
                type="text"
                value={skillCategory}
                onChange={(e) => {
                  setSkillCategory(e.target.value);
                  setErrors(prev => ({ ...prev, skillCategory: "" }));
                }}
                className={`w-full p-2 mt-1 rounded-md bg-gray-800 text-neutral-200 border ${
                  errors.skillCategory ? "border-red-500" : "border-gray-300"
                }`}
                pattern="[A-Za-z\s]+"
                title="Only letters and spaces allowed"
                required
              />
              {errors.skillCategory && (
                <p className="text-red-400 text-sm mt-1">{errors.skillCategory}</p>
              )}
            </div>

            <div>
              <label className="block text-sm text-neutral-200">
                Completion Percentage: {completionPercentage}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={completionPercentage}
                onChange={(e) => {
                  setCompletionPercentage(Number(e.target.value));
                  setErrors(prev => ({ ...prev, completionPercentage: "" }));
                }}
                className="w-full"
              />
              {errors.completionPercentage && (
                <p className="text-red-400 text-sm mt-1">{errors.completionPercentage}</p>
              )}
            </div>

            <div>
              <label className="block text-sm text-neutral-200">Learning Resources</label>
              <input
                type="text"
                value={learningResources}
                onChange={(e) => {
                  setLearningResources(e.target.value);
                  setErrors(prev => ({ ...prev, learningResources: "" }));
                }}
                className={`w-full p-2 mt-1 rounded-md bg-gray-800 text-neutral-200 border ${
                  errors.learningResources ? "border-red-500" : "border-gray-300"
                }`}
                pattern="[a-zA-Z0-9\s.,-]+"
                title="Only letters, numbers, spaces, and punctuation allowed"
              />
              {errors.learningResources && (
                <p className="text-red-400 text-sm mt-1">{errors.learningResources}</p>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-6 px-4 py-2 text-sm font-medium text-white bg-yellow-500 rounded-md shadow hover:bg-yellow-600 transition-colors"
          >
            {editProgress ? "Update Progress" : "Create Progress"}
          </button>

          <button
            type="button"
            onClick={goToProgress}
            className="w-full px-4 mt-2 py-2 text-sm font-medium text-gray-300 bg-gray-700 rounded-md shadow hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default CreateProgress;