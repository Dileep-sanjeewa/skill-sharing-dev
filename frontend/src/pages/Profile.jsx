import React, { useEffect, useState } from "react";
import { useParams, NavLink } from "react-router-dom";
import axios from "axios";
import PostsList from "../components/PostsList";
import CreateBG from "../images/CreateBG.png";
import SideBar2 from "../components/SideBar2";
import Layout from "../components/Layout";
import CoverBG from "../images/CoverBG.png";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loginUser, setLoginUser] = useState(null);
  const { userId } = useParams();
  const [posts, setPosts] = useState([]);
  const [reFetchPost, setReFetchPost] = useState(false);
  const [reFetchUser, setReFetchUser] = useState(false);

  useEffect(() => {
    setLoading(true);
    setUser(null);
    const fetchData = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/users/${userId}`);
        setUser(res.data);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, reFetchUser]);

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/posts/user/${userId}`
        );
        setPosts(res.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchUserPosts();
  }, [userId, reFetchPost]);

  useEffect(() => {
    setLoading(true);
    setUser(null);
    const fetchData = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const userData = localStorage.getItem("user");
        setLoginUser(JSON.parse(userData));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleFollowUser = async () => {
    try {
      const res = await axios.post(
        `http://localhost:8080/users/follow?userId=${loginUser.id}&FollowedUserId=${user?.id}`
      );
      setReFetchUser(!reFetchUser);
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = async () => {
    try {
      window.location.href = "http://localhost:8080/logout";
      localStorage.removeItem("user");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <Layout>
      <div
        className="w-full flex items-center justify-center flex-col"
        style={{  backgroundColor: "#5dade2" }}
      >
        <div className="pt-5">
          <SideBar2 logUser={user}/>
        </div>
        <div className="w-[800px] bg-gray-800 rounded-lg">
        <section>
          <img
            className="w-full h-64 object-cover"
            src={CoverBG}
            alt="Cover"
           />
        </section>


          <section className="pl-6">
            <div className="flex justify-between items-start mt-5 h-20 ">
              <img
                className="-mt-28 w-40 h-40  border-4 border-white rounded-full "
                alt="w"
                src={user?.profileImage}
              />
              <div className="pl-4">
                {loginUser?.id !== user?.id ? (
                  <button
                    onClick={handleFollowUser}
                    className="bg-transparent hover:bg-yellow-500 text-white px-8 py-2 rounded-3xl space-x-3"
                  >
                    {user?.followingUsers?.includes(loginUser?.id)
                      ? "Unfollow"
                      : "Follow"}
                  </button>
                ) : (
                  <button
                    className="bg-transparent hover:bg-red-500 text-white px-8 py-2 rounded-3xl space-x-3 "
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                )}
              </div>
            </div>

            <div>
              <div className="flex item-center flex-col">
                <h1 className="font-bold text-lg text-neutral-200">
                  {user?.name}
                </h1>
              </div>
            </div>
            <div className="flex items-center space-x-5">
              <div className="flex items-center space-x-1 font-semibold">
                <span className="text-neutral-200">{user?.followingCount}</span>
                <span className="text-neutral-200">Following</span>
              </div>
              <div className="flex items-center space-x-1 font-semibold">
                <span className="text-neutral-200">
                  {user?.followersCount}
                </span>
                <span className="text-neutral-200">Followers</span>
              </div>
            </div>
            <div className="mt-2 space-y-3">
              <p className="text-neutral-200">Hey there!</p>
              {loginUser?.id !== user?.id ? null : (
                <div className="flex items-center space-x-12 pb-4">
                  <NavLink
                    to="/post"
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-15 py-2 rounded-md text-center"
                    style={{ width: "150px" }}
                  >
                    Post
                  </NavLink>
                  <NavLink
                    to="/CreateProgress"
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-15 py-2 rounded-md text-center"
                    style={{ width: "150px" }}
                  >
                  Your progress
                  </NavLink>

                  <NavLink
                    to="/CreateSkillExchange"
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-15 py-2 rounded-md text-center"
                    style={{ width: "150px" }}
                  >
                  SkillExchange
                  </NavLink>
                  
                  
                </div>
              )}
            </div>
          </section>
        </div>
        <div className="mt-10 ">
          {posts?.map((post, index) => {
            return (
              <PostsList
                post={post}
                user={loginUser}
                key={index}
                reFetchPost={reFetchPost}
                setReFetchPost={setReFetchPost}
              />
            );
          })}
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
