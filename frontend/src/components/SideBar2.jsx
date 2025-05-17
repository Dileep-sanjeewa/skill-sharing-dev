import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const SideBar2 = ({ logUser }) => {
  const [users, setUsers] = useState(null);
  // const [logUser, setLogUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:8080/users");
        setUsers(res.data);
      } catch (error) {}
    };
    fetchUsers();
  }, []);

  // useEffect(() => {
  //   const logUser = localStorage.getItem("user");
  //   setLogUser(JSON.parse(logUser));
  // }, []);


  return (
    <div className="max-lg:hidden">
  <div className="flex flex-col min-h ">
    <aside className="right-0 fixed lg:w-[250px] w-[250px] border-r border-r-dashed border-r-neutral-100 p-4 bg-gray-800 rounded-lg shadow-md">
      <h1 className="text-center font-bold text-lg m-5 text-gray-100">Suggested Users</h1>
      <div className="flex flex-col gap-5 ml-1 text-sm text-neutral-200 ">
        {users?.map((user, index) => {
          return logUser?.id !== user?.id ? (
            
            <div
              key={index}
              className="flex items-center gap-5 cursor-pointer bg-transparent hover:bg-yellow-500 rounded-lg pl-2 pt-1 pb-1 pr-2 "
              onClick={() => navigate(`/profile/${user.id}`)}
            >
              <img
                src={user.profileImage}
                alt=""
                className="w-[40px] h-[40px] rounded-full"
              />
              <h1 className="font-bold">{user.name}</h1>
            </div>
          ) : null;
        })}
      </div>
    </aside>
  </div>
</div>
  );
};
export default SideBar2;
