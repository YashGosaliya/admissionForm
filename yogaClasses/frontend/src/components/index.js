import React from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./dashboard";
import Home from "./home";
import Register from "./register";
import Login from "./login";
import Profile from "./dashboard/profile";
const Visual = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  );
};

export default Visual;
