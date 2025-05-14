import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { useNavigate, useParams } from "react-router-dom";
import CreateBG from "../images/CreateBG.png";
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    if (!milestone || !description || !progressDate || !skillCategory) {
      return toast.error("Please fill all required fields");
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
        setMilestone("");
        setDescription("");
        setProgressDate("");
        setSkillCategory("");
        setCompletionPercentage(0);
        setLearningResources("");
        navigate("/");
        setActiveTab("tab5");
      }
    } catch (error) {
      toast.error(editProgress ? "Failed to update" : "Failed to add");
    }
  };

  const goToProgress = () => {
    navigate("/");
    setActiveTab("tab5");
  };

  return (
    <Layout>
      <div className="min-h-screen p-4 bg-cover bg-center" style={{ backgroundImage: `url(${CreateBG})` }}>
        <form
          onSubmit={handleSubmit}
          className="max-w-xl mx-auto bg-gray-800 p-6 rounded-lg shadow-md"
        >
          <h1 className="mb-4 text-3xl font-semibold text-center text-indigo-600">
            {editProgress ? "Edit Progress" : "Create Progress"}
          </h1>

          <div className="space-y-6">
            <div>
              <label className="block text-sm text-neutral-200">Milestone</label>
              <input
                type="text"
                value={milestone}
                onChange={(e) => setMilestone(e.target.value)}
                className="w-full p-2 mt-1 rounded-md bg-gray-800 text-neutral-200 border border-gray-300"
              />
            </div>

            <div>
              <label className="block text-sm text-neutral-200">Progress Date</label>
              <input
                type="date"
                value={progressDate}
                onChange={(e) => setProgressDate(e.target.value)}
                className="w-full p-2 mt-1 rounded-md bg-gray-800 text-neutral-200 border border-gray-300"
              />
            </div>

            <div>
              <label className="block text-sm text-neutral-200">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="4"
                className="w-full p-2 mt-1 rounded-md bg-gray-800 text-neutral-200 border border-gray-300"
              ></textarea>
            </div>

            <div>
              <label className="block text-sm text-neutral-200">Skill Category</label>
              <input
                type="text"
                value={skillCategory}
                onChange={(e) => setSkillCategory(e.target.value)}
                className="w-full p-2 mt-1 rounded-md bg-gray-800 text-neutral-200 border border-gray-300"
                placeholder="e.g., Programming, Design, Language"
              />
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
                onChange={(e) => setCompletionPercentage(Number(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm text-neutral-200">Learning Resources</label>
              <input
                type="text"
                value={learningResources}
                onChange={(e) => setLearningResources(e.target.value)}
                className="w-full p-2 mt-1 rounded-md bg-gray-800 text-neutral-200 border border-gray-300"
                placeholder="e.g., YouTube, Course, Book"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-6 px-4 py-2 text-sm font-medium text-white bg-yellow-500 rounded-md shadow hover:bg-yellow-600"
          >
            Submit Progress
          </button>

          <button
            type="button"
            onClick={goToProgress}
            className="w-full px-4 mt-2 py-2 text-sm font-medium text-black bg-transparent rounded-md shadow hover:bg-red-700"
          >
            Cancel
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default CreateProgress;
