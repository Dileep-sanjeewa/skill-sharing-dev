import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { TETabs, TETabsItem } from "tw-elements-react";
import PostsList from "../components/PostsList";
import axios from "axios";
import toast from "react-hot-toast";
import { useActiveTab } from "../context/ActiveTabContext";
import { SharedPostlist } from "../components/SharedPostlist";
import { FaChartLine } from 'react-icons/fa';
import { FaExchangeAlt } from 'react-icons/fa';
import Progress from "./Progress";
import SkillExchange from "./SkillExchange";


const Home = () => {
  const { activeTab, setActiveTab } = useActiveTab();
  const [user, setUser] = useState(null);
  const [reFetchPost, setReFetchPost] = useState(false);
  const [posts, setPosts] = useState([]);
  const [sharedPosts, setSharedPosts] = useState([]);
  const [reFetchSharedPost, setReFetchSharedPost] = useState(false);

  useEffect(() => {
    const fetchAllPosts = async () => {
      try {
        const { data } = await axios.get("http://localhost:8080/posts");
        setPosts(data);
      } catch (error) {
        toast.error("Server error");
      }
    };
    fetchAllPosts();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const userData = localStorage.getItem("user");
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const updatePost = (updatedPost) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => (post.id === updatedPost.id ? updatedPost : post))
    );
  };

  const deletePost = (deletedPost) => {
    setPosts((prevPosts) =>
      prevPosts.filter((post) => post.id !== deletedPost.id)
    );
  };

  useEffect(() => {
    const fetchAllPosts = async () => {
      try {
        const { data } = await axios.get("http://localhost:8080/posts");
        setPosts(data);
      } catch (error) {
        toast.error("Server error");
      }
    };
    fetchAllPosts();
  }, [reFetchPost]);

  useEffect(() => {
    const fetchAllSharedPosts = async () => {
      try {
        const { data } = await axios.get("http://localhost:8080/share");
        setSharedPosts(data);
      } catch (error) {
        toast.error("Server error");
      }
    };
    fetchAllSharedPosts();
  }, [reFetchSharedPost]);

  return (
    <Layout>
      <>
      {/* Tab navigation */}
      <div className="mb-4">
          <TETabs fill>
            <TETabsItem
              onClick={() => setActiveTab("tab1")}
              active={activeTab === "tab1" || activeTab === ""}
              className={`text-sm font-medium px-4 py-2 rounded-t-md transition-all duration-300 
                ${activeTab === "tab1" || activeTab === ""
                  ? "bg-gradient-to-r from-blue-500 to-blue-700 text-white shadow-md"
                  : "bg-gray-200 text-gray-700 hover:bg-blue-100"}`}
            >
              Posts
            </TETabsItem>
            <TETabsItem
              onClick={() => setActiveTab("tab5")}
              active={activeTab === "tab5"}
              icon={<FaChartLine />}
              className={`text-sm font-medium px-4 py-2 rounded-t-md transition-all duration-300 
                ${activeTab === "tab5"
                  ? "bg-gradient-to-r from-blue-500 to-blue-700 text-white shadow-md"
                  : "bg-gray-200 text-gray-700 hover:bg-blue-100"}`}
            >
              <FaChartLine /> Progress
            </TETabsItem>

            <TETabsItem
              onClick={() => setActiveTab("tab6")}
              active={activeTab === "tab6"}
              icon={<FaExchangeAlt />}
              className={`text-sm font-medium px-4 py-2 rounded-t-md transition-all duration-300 
                ${activeTab === "tab6"
                  ? "bg-gradient-to-r from-blue-500 to-blue-700 text-white shadow-md"
                  : "bg-gray-200 text-gray-700 hover:bg-blue-100"}`}
            >
              <FaExchangeAlt /> Skill Exchange
            </TETabsItem>
          </TETabs>
        </div>

      {activeTab === "tab1" && (
        <div>
          {posts?.map((post, index) => {
            return (
              <PostsList
                post={post}
                user={user}
                key={index}
                onUpdatePost={updatePost}
                onDeletePost={deletePost}
                reFetchPost={reFetchPost}
                setReFetchPost={setReFetchPost}
                setReFetchSharedPost={setReFetchSharedPost}
                reFetchSharedPost={reFetchSharedPost}
              />
            );
          })}
          {sharedPosts?.map((sharePost, index) => {
            return (
              <SharedPostlist
                post={sharePost}
                user={user}
                reFetchSharedPost={reFetchSharedPost}
                setReFetchSharedPost={setReFetchSharedPost}
              />
            );
          })}
        </div>
      )}
      
      {activeTab === "tab5" && (
        <div>
          <Progress user={user} />
        </div>
      )}
      {activeTab === "tab6" && (
          <div>
            <SkillExchange user={user} />
          </div>
        )}
      </>
    </Layout>
  );
};

export default Home;