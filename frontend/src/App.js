import { BrowserRouter, Route, Routes } from "react-router-dom";
import './App.css';
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Post from "./pages/Post";
import { Toaster } from "react-hot-toast";
import Profile from "./pages/Profile";
import Progress from "./pages/Progress";
import CreateProgress from "./pages/CreateProgress";
import SkillExchange from "./pages/SkillExchange";
import CreateSkillExchange from "./pages/CreateSkillExchange";
import AnalyzePage from "./pages/AnalyzePage";



function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" />
      
      <Routes>
        
        <Route path="/login" element={<Login />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/" element={<Home />} />
        <Route path="/post" element={<Post />} />
        <Route path="/post/:postId" element={<Post />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/:userId" element={<Profile />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/CreateProgress" element={<CreateProgress />} />
        <Route path="/CreateProgress/:progressId" element={<CreateProgress />} />
        <Route path="/skillExchange" element={<SkillExchange />} />
        <Route path="/CreateSkillExchange" element={<CreateSkillExchange />} />
        <Route path="/CreateSkillExchange/:skillExchangeId" element={<CreateSkillExchange />} />
        <Route path="/analyze" element={<AnalyzePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
