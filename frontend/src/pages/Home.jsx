import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import PostsList from "../components/PostsList";
import axios from "axios";
import toast from "react-hot-toast";
import { useActiveTab } from "../context/ActiveTabContext";
import { SharedPostlist } from "../components/SharedPostlist";



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
      <div style={{ backgroundColor: "#5dade2" }} className="min-h-screen py-6">
        <div className="container mx-auto px-4">
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
                key={index}
                reFetchSharedPost={reFetchSharedPost}
                setReFetchSharedPost={setReFetchSharedPost}
              />
            );
          })}
        </div>
      </div>
    </Layout>
  );
};

export default Home;