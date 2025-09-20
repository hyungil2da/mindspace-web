import React from "react";
import { Routes, Route } from "react-router-dom";
import DashBoard from "./Menu/DashBoard";
import Visitor from "./Menu/Visitor";
import User from "./Menu/User";
import UserSetting from "./Menu/UserSetting";
import NewTotal from "./Menu/NewTotal";
import UserTotal from "./Menu/UserTotal";
import Post from "./Menu/Post";
import FAQ from "./Menu/FAQ";
import Notice from "./Menu/Notice";
import Ask from "./Menu/Ask";
import Statistics from "./Menu/Statistics";
import Count from "./Menu/Count";
import Setting from "./Menu/Setting";
import "./App.css";
import Main_Page from "./pages/Main_Page";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/Main_page" element={<Main_Page />} />
        <Route path="/DashBoard" element={<DashBoard />} />
        <Route path="/Visitor" element={<Visitor />} />
        <Route path="/User" element={<User />} />
        <Route path="/NewTotal" element={<NewTotal />} />
        <Route path="/UserTotal" element={<UserTotal />} />
        <Route path="/Post" element={<Post />} />
        <Route path="/FAQ" element={<FAQ />} />
        <Route path="/Notice" element={<Notice />} />
        <Route path="/Ask/:id" element={<Ask />} />
        <Route path="/Statistics" element={<Statistics />} />
        <Route path="/Count" element={<Count />} />
        <Route path="/Setting" element={<Setting />} />
        <Route path="/UserSetting" element={<UserSetting />} />
        <Route path="/" element={<Main_Page />} />
      </Routes>
    </div>
  );
};

export default App;
